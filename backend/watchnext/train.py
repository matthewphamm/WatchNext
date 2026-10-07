"""Fit the recommender on MovieLens and save it to models/recommender.joblib."""
import time
from pathlib import Path

from .data import load_movielens
from .recommender import Recommender

MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "recommender.joblib"


def train(model_path=MODEL_PATH):
    movies, ratings, tags = load_movielens()
    start = time.perf_counter()
    model = Recommender().fit(movies, ratings, tags)
    model_path.parent.mkdir(exist_ok=True)
    model.save(model_path)
    print(f"Trained on {len(ratings):,} ratings of {len(movies):,} movies "
          f"in {time.perf_counter() - start:.1f}s -> {model_path}")
    return model


if __name__ == "__main__":
    train()
