"""Fit the recommender on MovieLens and save it to models/recommender.joblib."""
import time

from .data import load_movielens
from .paths import MODEL_PATH
from .recommender import Recommender


def train(model_path=MODEL_PATH):
    movies, ratings, tags = load_movielens()
    start = time.perf_counter()
    model = Recommender().fit(movies, ratings, tags)
    model_path.parent.mkdir(parents=True, exist_ok=True)
    model.save(model_path)
    print(f"Trained on {len(ratings):,} ratings of {len(movies):,} movies "
          f"in {time.perf_counter() - start:.1f}s -> {model_path}")
    return model


if __name__ == "__main__":
    train()
