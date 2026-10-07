"""Where the backend reads data and writes generated files."""
import os
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent

# On Vercel the deployed files are read-only and only /tmp is writable, so the trained
# model and poster cache live there (rebuilt per instance: training takes under a second).
WRITABLE_DIR = Path("/tmp/watchnext") if os.environ.get("VERCEL") else BACKEND_DIR

MODEL_PATH = WRITABLE_DIR / "models" / "recommender.joblib"
POSTER_CACHE_PATH = WRITABLE_DIR / "data" / "posters.json"
