"""Hybrid movie recommender: collaborative filtering (TruncatedSVD) + content-based (TF-IDF).

Both models predict a rating on MovieLens's 0.5-5 scale, on top of a shared baseline:

    baseline(item) = global mean + item bias (shrunk toward 0 for rarely rated movies)

- Collaborative: TruncatedSVD factorizes the user x movie matrix of residuals
  (rating - baseline - user bias). A new visitor is "folded in" by projecting their
  residuals onto the learned movie factors, so no retraining is needed per request.
- Content: TF-IDF over genres, viewer tags and decade. A candidate movie's prediction
  is the similarity-weighted residual of the movies the visitor already rated.

The hybrid blends the two with alpha = n / (n + ALPHA_HALF), capped at ALPHA_MAX, so
content similarity carries new visitors and collaborative signals take over as they
rate more.
"""
from collections import Counter

import joblib
import numpy as np
import pandas as pd
from scipy import sparse
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize

MIN_RATING, MAX_RATING = 0.5, 5.0
ALPHA_HALF = 10
ALPHA_MAX = 0.8


def _token(prefix, text):
    return prefix + "_" + "".join(c if c.isalnum() else "_" for c in text.lower()).strip("_")


class Recommender:
    def __init__(self, n_components=50, item_shrink=10.0, user_shrink=5.0,
                 content_neighbors=20, content_shrink=0.5, random_state=0):
        self.n_components = n_components
        self.item_shrink = item_shrink
        self.user_shrink = user_shrink
        self.content_neighbors = content_neighbors
        self.content_shrink = content_shrink
        self.random_state = random_state

    # ------------------------------------------------------------------ fitting

    def fit(self, movies, ratings, tags=None):
        movies = movies.reset_index(drop=True)
        self.movies = movies
        self.ids = movies["movieId"].to_numpy()
        self.index = {mid: i for i, mid in enumerate(self.ids)}
        n_items = len(movies)

        ratings = ratings[ratings["movieId"].isin(self.index)]
        item_idx = ratings["movieId"].map(self.index).to_numpy()
        values = ratings["rating"].to_numpy(dtype=float)

        # Baseline: global mean + shrunk item bias.
        self.global_mean = float(values.mean())
        counts = np.bincount(item_idx, minlength=n_items)
        sums = np.bincount(item_idx, weights=values, minlength=n_items)
        self.counts = counts
        self.avg = np.divide(sums, counts, out=np.zeros(n_items), where=counts > 0)
        dev_sums = np.bincount(item_idx, weights=values - self.global_mean, minlength=n_items)
        self.baseline = self.global_mean + dev_sums / (counts + self.item_shrink)

        # Collaborative: SVD of residuals after baseline and user bias.
        user_codes, _ = pd.factorize(ratings["userId"])
        resid = values - self.baseline[item_idx]
        n_users = user_codes.max() + 1
        user_bias = (np.bincount(user_codes, weights=resid, minlength=n_users)
                     / (np.bincount(user_codes, minlength=n_users) + self.user_shrink))
        resid = resid - user_bias[user_codes]
        matrix = sparse.csr_matrix((resid, (user_codes, item_idx)), shape=(n_users, n_items))
        k = min(self.n_components, min(matrix.shape) - 1)
        svd = TruncatedSVD(n_components=k, random_state=self.random_state)
        svd.fit(matrix)
        self.item_factors = svd.components_.T  # (n_items, k), orthonormal columns
        self.item_factors_unit = normalize(self.item_factors)

        # Content: TF-IDF over genre, tag and decade tokens.
        tag_lists = {}
        if tags is not None and len(tags):
            for mid, group in tags.groupby("movieId")["tag"]:
                tag_lists[mid] = [t for t, _ in Counter(group).most_common()]
        self.tags = [tag_lists.get(mid, []) for mid in self.ids]
        docs = []
        for genres, year, mtags in zip(movies["genres"], movies["year"], self.tags):
            tokens = [_token("g", g) for g in genres] * 2  # genres weigh more than tags
            tokens += [_token("t", t) for t in mtags]
            if pd.notna(year):
                tokens.append(f"d_{int(year) // 10 * 10}s")
            docs.append(" ".join(tokens) or "empty")
        self.vectorizer = TfidfVectorizer(token_pattern=r"\S+", sublinear_tf=True)
        self.content = self.vectorizer.fit_transform(docs)  # rows are L2-normalized

        genre_counts = Counter(g for gs in movies["genres"] for g in gs)
        self.genres = [g for g, _ in genre_counts.most_common()]
        return self

    # --------------------------------------------------------------- prediction

    def _profile(self, user_ratings):
        """Return (indices, residuals, user_bias) for the visitor's known ratings."""
        pairs = [(self.index[m], float(r)) for m, r in user_ratings.items() if m in self.index and r]
        if not pairs:
            return np.array([], dtype=int), np.array([]), 0.0
        idx = np.array([p[0] for p in pairs])
        vals = np.array([p[1] for p in pairs])
        dev = vals - self.baseline[idx]
        user_bias = dev.sum() / (len(dev) + self.user_shrink)
        return idx, dev - user_bias, user_bias

    def _content_scores(self, idx, resid):
        """Similarity-weighted residual of rated movies, for every movie."""
        sims = (self.content @ self.content[idx].T).toarray()  # (n_items, n_rated)
        if sims.shape[1] > self.content_neighbors:
            cutoff = np.partition(sims, -self.content_neighbors, axis=1)[:, -self.content_neighbors][:, None]
            sims = np.where(sims >= cutoff, sims, 0.0)
        return (sims @ resid) / (sims.sum(axis=1) + self.content_shrink)

    def predict_components(self, user_ratings):
        """Return (baseline, collaborative, content, alpha) predictions for every movie."""
        idx, resid, user_bias = self._profile(user_ratings)
        base = self.baseline + user_bias
        if len(idx) == 0:
            return base, base, base, 0.0
        collab = base + self.item_factors @ (resid @ self.item_factors[idx])
        content = base + self._content_scores(idx, resid)
        alpha = min(ALPHA_MAX, len(idx) / (len(idx) + ALPHA_HALF))
        return base, collab, content, alpha

    def predict(self, user_ratings):
        """Hybrid predicted rating (0.5-5) for every movie."""
        _, collab, content, alpha = self.predict_components(user_ratings)
        return np.clip(alpha * collab + (1 - alpha) * content, MIN_RATING, MAX_RATING)

    @staticmethod
    def match_percent(pred):
        return np.rint(np.asarray(pred) / MAX_RATING * 100).astype(int)

    # ------------------------------------------------------------- recommending

    def _mask(self, user_ratings=(), exclude=(), genre=None, min_count=0):
        mask = self.counts >= min_count
        for mid in list(user_ratings) + list(exclude):
            if mid in self.index:
                mask[self.index[mid]] = False
        if genre:
            mask &= np.array([genre in gs for gs in self.movies["genres"]])
        return mask

    def recommend(self, user_ratings, n=20, exclude=(), genre=None, min_count=10, preds=None):
        """Top-n movie indices the visitor hasn't rated, best predicted first."""
        preds = self.predict(user_ratings) if preds is None else preds
        mask = self._mask(user_ratings, exclude, genre, min_count)
        candidates = np.flatnonzero(mask)
        return candidates[np.argsort(-preds[candidates], kind="stable")][:n]

    def similar(self, movie_id, n=12, exclude=(), min_count=20):
        """Movies most like movie_id, blending content and collaborative similarity."""
        i = self.index[movie_id]
        content_sim = (self.content @ self.content[i].T).toarray().ravel()
        collab_sim = self.item_factors_unit @ self.item_factors_unit[i]
        score = 0.6 * content_sim + 0.4 * collab_sim
        mask = self._mask(exclude=list(exclude) + [movie_id], min_count=min_count)
        candidates = np.flatnonzero(mask)
        return candidates[np.argsort(-score[candidates], kind="stable")][:n]

    def popular(self, n=20, genres=None):
        """Most-rated movies, optionally limited to any of the given genres."""
        mask = np.ones(len(self.ids), dtype=bool)
        if genres:
            wanted = set(genres)
            mask &= np.array([bool(wanted & set(gs)) for gs in self.movies["genres"]])
        candidates = np.flatnonzero(mask)
        return candidates[np.argsort(-self.counts[candidates], kind="stable")][:n]

    # -------------------------------------------------------------- explaining

    def explain(self, movie_id, user_ratings, max_reasons=3):
        """Plain-language reasons this movie fits the visitor. Each is {kind, text}."""
        i = self.index[movie_id]
        reasons = []
        liked = {m: r for m, r in user_ratings.items() if m in self.index and r and r >= 4 and m != movie_id}

        if liked:
            liked_idx = np.array([self.index[m] for m in liked])
            sims = (self.content[liked_idx] @ self.content[i].T).toarray().ravel()
            best = int(np.argmax(sims))
            if sims[best] >= 0.15:
                mid = list(liked)[best]
                reasons.append({"kind": "similar",
                                "text": f"You rated {self.title(mid)} {_stars(liked[mid])}"})

        if user_ratings:
            base, collab, _, _ = self.predict_components(user_ratings)
            if collab[i] - base[i] >= 0.25:
                reasons.append({"kind": "people", "text": "People with your taste rated it highly"})

            genre_scores = Counter()
            for m, r in user_ratings.items():
                if m in self.index and r:
                    for g in self.movies.at[self.index[m], "genres"]:
                        genre_scores[g] += r - 3
            fav = [g for g, s in genre_scores.most_common(3) if s > 0]
            shared = [g for g in fav if g in self.movies.at[i, "genres"]]
            if shared:
                reasons.append({"kind": "genre", "text": f"Fits your taste for {shared[0]}"})

        if self.counts[i]:
            noun = "rating" if self.counts[i] == 1 else "ratings"
            reasons.append({"kind": "stats",
                            "text": f"Averages {self.avg[i]:.1f} from {self.counts[i]} MovieLens {noun}"})
        return reasons[:max_reasons]

    # ------------------------------------------------------------------ helpers

    def title(self, movie_id):
        return self.movies.at[self.index[movie_id], "title"]

    def to_dict(self, i, preds=None):
        row = self.movies.iloc[i]
        year = row["year"]
        out = {
            "id": int(self.ids[i]),
            "title": row["title"],
            "year": None if pd.isna(year) else int(year),
            "genres": list(row["genres"]),
            "avg": round(float(self.avg[i]), 2),
            "count": int(self.counts[i]),
            "tags": self.tags[i][:6],
        }
        if preds is not None:
            out["match"] = int(self.match_percent(preds[i]))
        return out

    def save(self, path):
        joblib.dump(self, path)

    @staticmethod
    def load(path):
        return joblib.load(path)


def _stars(r):
    value = f"{r:g}"
    return f"{value} star" if value == "1" else f"{value} stars"
