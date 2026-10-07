"""Load and clean the MovieLens dataset."""
import re
from pathlib import Path

import pandas as pd

DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "ml-latest-small"

_YEAR = re.compile(r"\s*\((\d{4})\)\s*$")
# MovieLens files "The Matrix" as "Matrix, The", sometimes followed by an alternate title in parentheses.
_ARTICLE = re.compile(r"^(.*?), (The|A|An)( \(.*\))?$")


def clean_title(raw):
    """Split a MovieLens title like "Matrix, The (1999)" into ("The Matrix", 1999)."""
    match = _YEAR.search(raw)
    year = int(match.group(1)) if match else None
    title = _YEAR.sub("", raw).strip()
    article = _ARTICLE.match(title)
    if article:
        base, art, rest = article.groups()
        title = f"{art} {base}{rest or ''}"
    return title, year


def load_movielens(data_dir=DATA_DIR):
    """Return (movies, ratings, tags) DataFrames.

    movies:  movieId, title, year, genres (list of str), tmdbId (nullable)
    ratings: userId, movieId, rating
    tags:    movieId, tag (lowercased, stripped)
    """
    data_dir = Path(data_dir)
    if not (data_dir / "movies.csv").exists():
        raise FileNotFoundError(
            f"MovieLens data not found in {data_dir}. Run: python scripts/download_data.py"
        )

    movies = pd.read_csv(data_dir / "movies.csv")
    cleaned = movies["title"].map(clean_title)
    movies["title"] = cleaned.map(lambda t: t[0])
    movies["year"] = cleaned.map(lambda t: t[1]).astype("Int64")
    movies["genres"] = movies["genres"].map(
        lambda g: [] if g == "(no genres listed)" else g.split("|")
    )

    links = pd.read_csv(data_dir / "links.csv", usecols=["movieId", "tmdbId"])
    movies = movies.merge(links, on="movieId", how="left")
    movies["tmdbId"] = movies["tmdbId"].astype("Int64")

    ratings = pd.read_csv(data_dir / "ratings.csv", usecols=["userId", "movieId", "rating"])

    tags = pd.read_csv(data_dir / "tags.csv", usecols=["movieId", "tag"])
    tags["tag"] = tags["tag"].astype(str).str.strip().str.lower()
    tags = tags[tags["tag"] != ""]

    return movies[["movieId", "title", "year", "genres", "tmdbId"]], ratings, tags
