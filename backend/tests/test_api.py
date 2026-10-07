import pytest
from fastapi.testclient import TestClient

from watchnext.api import app
from watchnext.posters import PosterService


@pytest.fixture
def client(model):
    app.state.model = model
    app.state.posters = PosterService(api_key="", access_token="", cache_path=None)  # TMDB disabled
    with TestClient(app) as c:
        yield c
    del app.state.model, app.state.posters


def test_home_personalizes(client):
    res = client.post("/api/home", json={"ratings": {"1": 5}, "exclude": []})
    assert res.status_code == 200
    body = res.json()
    rows = body["rows"]["for_you"]
    assert rows[0]["eyebrow"] == "Because you loved Space One"
    ids = [m["id"] for row in rows for m in row["movies"]]
    assert 1 not in ids
    assert body["hero"]["id"] in (2, 3)
    assert 0 <= body["hero"]["match"] <= 100


def test_home_without_ratings(client):
    body = client.post("/api/home", json={}).json()
    assert body["rows"]["for_you"][0]["eyebrow"] == "Rate a few movies to personalize these"


def test_movie_detail_and_404(client):
    body = client.post("/api/movies/2", json={"ratings": {"1": 5}}).json()
    assert body["movie"]["title"] == "Space Two"
    assert body["reasons"][0]["kind"] == "similar"
    assert all(m["id"] != 2 for m in body["similar"])
    assert client.post("/api/movies/999", json={}).status_code == 404


def test_search_filters_and_sorts(client):
    body = client.post("/api/search", json={"q": "love", "sort": "newest"}).json()
    assert [m["title"] for m in body["movies"]] == ["Love Three", "Love Two", "Love One"]
    body = client.post("/api/search", json={"ids": [1, 4], "ratings": {"1": 4}, "hide_rated": True}).json()
    assert [m["id"] for m in body["movies"]] == [4]


def test_onboarding_filters_by_genre(client):
    movies = client.get("/api/onboarding", params={"genres": "Romance"}).json()
    assert {m["id"] for m in movies} == {4, 5, 6}


def test_movies_include_poster_field(client):
    body = client.post("/api/movies/1", json={}).json()
    assert body["movie"]["tmdbId"] == 101
    assert body["movie"]["poster"] is None and body["movie"]["backdrop"] is None  # no TMDB key in tests
    assert all("poster" in m for m in body["similar"])
