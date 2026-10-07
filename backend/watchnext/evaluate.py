"""Evaluate the baseline, collaborative, content and hybrid predictors on a held-out split.

For every user with at least 10 ratings, 20% of their ratings are held out. The model is
fit on the rest, then each user's held-out ratings are predicted by folding in their
training ratings, exactly like a visitor to the site.

- RMSE on held-out ratings (lower is better).
- Precision@10 / Recall@10: of the 10 unseen movies ranked highest for the user, how many
  are held-out movies they rated 4 or more.
"""
import argparse

import numpy as np

from .data import load_movielens
from .recommender import Recommender

METHODS = ("baseline", "collaborative", "content", "hybrid")


def split(ratings, test_frac=0.2, min_ratings=10, seed=0):
    rng = np.random.default_rng(seed)
    eligible = ratings.groupby("userId")["rating"].transform("size") >= min_ratings
    test_mask = eligible & (rng.random(len(ratings)) < test_frac)
    return ratings[~test_mask], ratings[test_mask]


def evaluate(k=10, seed=0):
    movies, ratings, tags = load_movielens()
    train, test = split(ratings, seed=seed)
    model = Recommender().fit(movies, train, tags)

    sq_err = {m: [] for m in METHODS}
    precision = {m: [] for m in METHODS}
    recall = {m: [] for m in METHODS}
    train_by_user = {u: dict(zip(g.movieId, g.rating)) for u, g in train.groupby("userId")}

    for user, held in test.groupby("userId"):
        seen = train_by_user.get(user, {})
        base, collab, content, alpha = model.predict_components(seen)
        preds = {
            "baseline": base,
            "collaborative": collab,
            "content": content,
            "hybrid": alpha * collab + (1 - alpha) * content,
        }
        held = held[held.movieId.isin(model.index)]
        idx = held.movieId.map(model.index).to_numpy()
        truth = held.rating.to_numpy()
        relevant = set(held.movieId[held.rating >= 4])
        for name, p in preds.items():
            p = np.clip(p, 0.5, 5.0)
            sq_err[name].extend((p[idx] - truth) ** 2)
            if relevant:
                top = model.recommend(seen, n=k, min_count=5, preds=p)
                hits = len(relevant & set(model.ids[top]))
                precision[name].append(hits / k)
                recall[name].append(hits / len(relevant))

    print(f"Train {len(train):,} ratings / test {len(test):,} ratings, "
          f"{test.userId.nunique()} users\n")
    print(f"{'method':<15}{'RMSE':>8}{f'P@{k}':>9}{f'R@{k}':>9}")
    results = {}
    for name in METHODS:
        rmse = float(np.sqrt(np.mean(sq_err[name])))
        p, r = float(np.mean(precision[name])), float(np.mean(recall[name]))
        results[name] = {"rmse": rmse, "precision": p, "recall": r}
        print(f"{name:<15}{rmse:>8.3f}{p:>9.3f}{r:>9.3f}")
    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--k", type=int, default=10)
    parser.add_argument("--seed", type=int, default=0)
    args = parser.parse_args()
    evaluate(k=args.k, seed=args.seed)
