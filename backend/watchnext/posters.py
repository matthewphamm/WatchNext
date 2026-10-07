"""Poster and backdrop art from The Movie Database (TMDB).

MovieLens's links.csv gives each movie's TMDB id. Art is looked up lazily, only for the
movies an API response is about to return, and cached on disk so each movie is fetched
from TMDB at most once.

Set TMDB_API_KEY (v3 API key) or TMDB_READ_ACCESS_TOKEN (v4 token) in backend/.env.
Without either, every image is None and the frontend shows its placeholder.
"""
import json
import os
import threading
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import httpx

from .paths import POSTER_CACHE_PATH

API_URL = "https://api.themoviedb.org/3/movie/{}"
IMAGE_URL = "https://image.tmdb.org/t/p/{}{}"
NO_ART = {"poster": "", "backdrop": ""}  # cached when TMDB has nothing, so we don't ask again


class PosterService:
    def __init__(self, api_key=None, access_token=None, cache_path=POSTER_CACHE_PATH,
                 transport=None, workers=8, timeout=5.0):
        self.api_key = api_key if api_key is not None else os.environ.get("TMDB_API_KEY")
        self.access_token = (access_token if access_token is not None
                             else os.environ.get("TMDB_READ_ACCESS_TOKEN"))
        self.cache_path = Path(cache_path) if cache_path else None
        self.workers = workers
        self._lock = threading.Lock()
        self._cache = self._load_cache()
        headers = {"Authorization": f"Bearer {self.access_token}"} if self.access_token else {}
        self._client = httpx.Client(headers=headers, timeout=timeout, transport=transport)

    @property
    def enabled(self):
        return bool(self.api_key or self.access_token)

    def art(self, tmdb_ids, poster_size="w342", backdrop_size="w1280"):
        """Map each TMDB id to {"poster": url, "backdrop": url}; a URL is None when unavailable."""
        ids = {int(i) for i in tmdb_ids if i is not None}
        if self.enabled:
            missing = [i for i in ids if str(i) not in self._cache]
            if missing:
                with ThreadPoolExecutor(self.workers) as pool:
                    results = list(pool.map(self._fetch, missing))
                with self._lock:
                    for tmdb_id, paths in zip(missing, results):
                        if paths is not None:  # None means the request failed; retry next time
                            self._cache[str(tmdb_id)] = paths
                    self._save_cache()
        out = {}
        for i in ids:
            paths = self._cache.get(str(i), NO_ART)
            out[i] = {
                "poster": IMAGE_URL.format(poster_size, paths["poster"]) if paths["poster"] else None,
                "backdrop": IMAGE_URL.format(backdrop_size, paths["backdrop"]) if paths["backdrop"] else None,
            }
        return out

    def _fetch(self, tmdb_id):
        """Return {"poster": path, "backdrop": path} ("" if TMDB has none), or None if the request failed."""
        params = {"api_key": self.api_key} if self.api_key and not self.access_token else None
        try:
            res = self._client.get(API_URL.format(tmdb_id), params=params)
        except httpx.HTTPError:
            return None
        if res.status_code == 404:
            return dict(NO_ART)
        if res.status_code != 200:
            return None
        body = res.json()
        return {"poster": body.get("poster_path") or "", "backdrop": body.get("backdrop_path") or ""}

    def _load_cache(self):
        if self.cache_path and self.cache_path.exists():
            try:
                cache = json.loads(self.cache_path.read_text())
            except (OSError, ValueError):
                return {}
            # Entries from before backdrops were cached are plain poster strings; refetch them.
            return {k: v for k, v in cache.items() if isinstance(v, dict)}
        return {}

    def _save_cache(self):
        if not self.cache_path:
            return
        self.cache_path.parent.mkdir(parents=True, exist_ok=True)
        tmp = self.cache_path.with_suffix(".tmp")
        tmp.write_text(json.dumps(self._cache))
        tmp.replace(self.cache_path)
