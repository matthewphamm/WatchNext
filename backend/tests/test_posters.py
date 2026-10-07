import httpx

from watchnext.posters import PosterService


def fake_tmdb(calls):
    def handler(request):
        calls.append(request)
        tmdb_id = int(request.url.path.rsplit("/", 1)[1])
        if tmdb_id == 1:
            return httpx.Response(200, json={"poster_path": "/one.jpg", "backdrop_path": "/wide.jpg"})
        if tmdb_id == 2:
            return httpx.Response(200, json={"poster_path": None})
        if tmdb_id == 3:
            return httpx.Response(404)
        return httpx.Response(500)
    return httpx.MockTransport(handler)


def test_disabled_without_credentials():
    service = PosterService(api_key="", access_token="", cache_path=None)
    assert not service.enabled
    assert service.art([1, None]) == {1: {"poster": None, "backdrop": None}}


def test_builds_urls_and_caches(tmp_path):
    calls = []
    cache = tmp_path / "posters.json"
    service = PosterService(api_key="k", access_token="", cache_path=cache, transport=fake_tmdb(calls))
    art = service.art([1, 2, 3, 4])
    assert art[1] == {"poster": "https://image.tmdb.org/t/p/w342/one.jpg",
                      "backdrop": "https://image.tmdb.org/t/p/w1280/wide.jpg"}
    assert art[2] == art[3] == art[4] == {"poster": None, "backdrop": None}
    assert calls[0].url.params["api_key"] == "k"

    # Found and missing posters are cached; the failed request (500) is retried next time.
    calls.clear()
    again = PosterService(api_key="k", access_token="", cache_path=cache, transport=fake_tmdb(calls))
    assert again.art([1, 2, 3, 4], poster_size="w500")[1]["poster"] == "https://image.tmdb.org/t/p/w500/one.jpg"
    assert [int(c.url.path.rsplit("/", 1)[1]) for c in calls] == [4]


def test_access_token_uses_bearer_header():
    calls = []
    service = PosterService(api_key="", access_token="tok", cache_path=None, transport=fake_tmdb(calls))
    service.art([1])
    assert calls[0].headers["Authorization"] == "Bearer tok"
    assert "api_key" not in calls[0].url.params


def test_old_string_cache_entries_are_refetched(tmp_path):
    cache = tmp_path / "posters.json"
    cache.write_text('{"1": "/old.jpg"}')
    calls = []
    service = PosterService(api_key="k", access_token="", cache_path=cache, transport=fake_tmdb(calls))
    assert service.art([1])[1]["backdrop"] == "https://image.tmdb.org/t/p/w1280/wide.jpg"
    assert len(calls) == 1
