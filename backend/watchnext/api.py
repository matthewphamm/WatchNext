"""FastAPI app serving recommendations to the web frontend.

The API is stateless: the browser keeps the visitor's ratings and watchlist and sends
them with each request, and the model folds them in on the fly.

Run: uvicorn watchnext.api:app --reload
"""
from contextlib import asynccontextmanager
from typing import Literal

import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field

from .posters import PosterService
from .recommender import Recommender
from .paths import BACKEND_DIR, MODEL_PATH
from .train import train

ROW_SIZE = 20

load_dotenv(BACKEND_DIR / ".env")  # local development; on Vercel, set env vars in the project


def load_model():
    if MODEL_PATH.exists():
        model = Recommender.load(MODEL_PATH)
        if getattr(model, "version", None) == Recommender.VERSION:
            return model
    return train()


@asynccontextmanager
async def lifespan(app):
    if not hasattr(app.state, "model"):
        app.state.model = load_model()
    if not hasattr(app.state, "posters"):
        app.state.posters = PosterService()
    yield


app = FastAPI(title="WatchNext API", lifespan=lifespan)


class Profile(BaseModel):
    ratings: dict[int, float] = Field(default_factory=dict)
    exclude: list[int] = Field(default_factory=list, description="Movies marked 'Not for me'")


class SearchQuery(Profile):
    q: str = ""
    genre: str | None = None
    sort: Literal["match", "rating", "popular", "newest"] = "match"
    hide_rated: bool = False
    ids: list[int] | None = Field(default=None, description="Limit results to these movies (watchlist)")
    limit: int = Field(default=60, ge=1, le=200)


def _model(request: Request) -> Recommender:
    return request.app.state.model


def _with_posters(request, movies, size="w342"):
    """Add TMDB poster and backdrop URLs (or None) to each movie dict, in place."""
    art = request.app.state.posters.art([m["tmdbId"] for m in movies], poster_size=size)
    for m in movies:
        found = art.get(m["tmdbId"], {})
        m["poster"], m["backdrop"] = found.get("poster"), found.get("backdrop")
    return movies


@app.get("/api/health")
def health():
    return {"ok": True}


@app.get("/api/genres")
def genres(request: Request):
    return _model(request).genres


@app.post("/api/home")
def home(profile: Profile, request: Request):
    model = _model(request)
    ratings, exclude = profile.ratings, profile.exclude
    preds = model.predict(ratings)
    cards = lambda idx: [model.to_dict(i, preds) for i in idx]
    top = model.recommend(ratings, n=ROW_SIZE + 1, exclude=exclude, preds=preds)
    hero, top = (top[0], top[1:]) if len(top) else (None, top)

    for_you = []
    loved = sorted(((r, m) for m, r in ratings.items() if r >= 4 and m in model.index), reverse=True)
    if loved:
        anchor = loved[0][1]
        similar = model.similar(anchor, n=ROW_SIZE, exclude=list(ratings) + exclude)
        for_you.append({"eyebrow": f"Because you loved {model.title(anchor)}",
                        "title": "More in the same vein", "movies": cards(similar)})
    for_you.append({"eyebrow": None if ratings else "Rate a few movies to personalize these",
                    "title": "Top matches for you", "movies": cards(top)})
    fav = _favorite_genre(model, ratings)
    if fav:
        picks = model.recommend(ratings, n=ROW_SIZE, exclude=exclude, genre=fav, preds=preds)
        for_you.append({"eyebrow": f"Because you rate {fav} highly",
                        "title": f"{fav} picks for you", "movies": cards(picks)})

    seen = set(ratings) | set(exclude)
    most_rated = [i for i in model.popular(n=ROW_SIZE * 3) if model.ids[i] not in seen][:ROW_SIZE]
    acclaimed = model.recommend({}, n=ROW_SIZE, exclude=list(seen), min_count=50)
    newest = _newest(model, seen, ROW_SIZE)

    rows = {
        "for_you": for_you,
        "popular": [
            {"eyebrow": None, "title": "Most rated on MovieLens", "movies": cards(most_rated)},
            {"eyebrow": None, "title": "Highest rated, at least 50 ratings", "movies": cards(acclaimed)},
        ],
        "newest": [
            {"eyebrow": None, "title": "Newest in the catalog", "movies": cards(newest)},
        ],
    }
    hero = model.to_dict(hero, preds) if hero is not None else None
    _with_posters(request, [m for group in rows.values() for row in group for m in row["movies"]]
                  + ([hero] if hero else []))
    return {"hero": hero, "rows": rows}


@app.post("/api/movies/{movie_id}")
def movie(movie_id: int, profile: Profile, request: Request):
    model = _model(request)
    if movie_id not in model.index:
        raise HTTPException(404, "Movie not found")
    preds = model.predict(profile.ratings)
    similar = [model.to_dict(i, preds) for i in model.similar(movie_id, n=12, exclude=profile.exclude)]
    detail = model.to_dict(model.index[movie_id], preds)
    _with_posters(request, [detail], size="w500")
    _with_posters(request, similar)
    return {"movie": detail, "reasons": model.explain(movie_id, profile.ratings), "similar": similar}


@app.post("/api/search")
def search(query: SearchQuery, request: Request):
    model = _model(request)
    preds = model.predict(query.ratings)
    mask = np.ones(len(model.ids), dtype=bool)
    if query.ids is not None:
        mask &= np.isin(model.ids, query.ids)
    if query.q.strip():
        mask &= model.movies["title"].str.contains(query.q.strip(), case=False, regex=False).to_numpy()
    if query.genre:
        mask &= np.array([query.genre in gs for gs in model.movies["genres"]])
    if query.hide_rated:
        mask &= ~np.isin(model.ids, list(query.ratings))
    mask &= ~np.isin(model.ids, query.exclude)

    idx = np.flatnonzero(mask)
    if query.sort == "match":
        key = -preds[idx]
    elif query.sort == "rating":
        key = -model.baseline[idx]  # shrunk average, so a single 5-star rating doesn't top the list
    elif query.sort == "popular":
        key = -model.counts[idx]
    else:
        key = -model.movies["year"].fillna(0).to_numpy(dtype=float)[idx]
    order = idx[np.lexsort((-model.counts[idx], key))]
    movies = _with_posters(request, [model.to_dict(i, preds) for i in order[:query.limit]])
    return {"total": int(len(idx)), "movies": movies}


@app.get("/api/onboarding")
def onboarding(request: Request, genres: str = "", limit: int = 20):
    """Well-known movies to rate first: the most rated, optionally within genres."""
    model = _model(request)
    wanted = [g for g in genres.split(",") if g]
    return _with_posters(request, [model.to_dict(i) for i in model.popular(n=min(limit, 100), genres=wanted)])


def _favorite_genre(model, ratings):
    scores = {}
    for m, r in ratings.items():
        if m in model.index:
            for g in model.movies.at[model.index[m], "genres"]:
                scores[g] = scores.get(g, 0) + (r - 3)
    best = max(scores.items(), key=lambda kv: kv[1], default=(None, 0))
    return best[0] if best[1] > 0 else None


def _newest(model, seen, n):
    years = model.movies["year"].fillna(0).to_numpy(dtype=float)
    candidates = [i for i in np.flatnonzero(model.counts >= 3) if model.ids[i] not in seen]
    candidates.sort(key=lambda i: (-years[i], -model.counts[i]))
    return candidates[:n]
