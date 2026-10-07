import pandas as pd
import pytest

from watchnext.recommender import Recommender

# Two taste clusters: sci-fi (1-3) and romance (4-6). Fans rate their cluster high and the other low.
MOVIES = pd.DataFrame({
    "movieId": [1, 2, 3, 4, 5, 6],
    "title": ["Space One", "Space Two", "Space Three", "Love One", "Love Two", "Love Three"],
    "year": pd.array([2001, 2005, 2010, 2002, 2006, 2011], dtype="Int64"),
    "genres": [["Sci-Fi"], ["Sci-Fi"], ["Sci-Fi", "Thriller"], ["Romance"], ["Romance"], ["Romance", "Drama"]],
    "tmdbId": pd.array([101, 102, 103, 104, 105, None], dtype="Int64"),
})
TAGS = pd.DataFrame({"movieId": [1, 2, 3, 4, 5], "tag": ["aliens", "aliens", "space", "wedding", "wedding"]})


def _ratings():
    rows = []
    for user in range(20):
        scifi_fan = user % 2 == 0
        for mid in range(1, 7):
            if (user + mid) % 5 == 0:
                continue  # leave gaps so the matrix is sparse
            liked = (mid <= 3) == scifi_fan
            rows.append((user, mid, 4.5 if liked else 1.5))
    return pd.DataFrame(rows, columns=["userId", "movieId", "rating"])


@pytest.fixture(scope="session")
def model():
    return Recommender(n_components=3).fit(MOVIES, _ratings(), TAGS)
