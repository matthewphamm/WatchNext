"""Download the MovieLens ml-latest-small dataset into backend/data/."""
import io
import ssl
import urllib.request
import zipfile
from pathlib import Path

import certifi

URL = "https://files.grouplens.org/datasets/movielens/ml-latest-small.zip"
DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def main():
    DATA_DIR.mkdir(exist_ok=True)
    print(f"Downloading {URL}")
    # python.org builds on macOS ship without root certificates, so use certifi's bundle.
    ctx = ssl.create_default_context(cafile=certifi.where())
    with urllib.request.urlopen(URL, context=ctx) as resp:
        payload = resp.read()
    with zipfile.ZipFile(io.BytesIO(payload)) as zf:
        zf.extractall(DATA_DIR)
    print(f"Extracted to {DATA_DIR / 'ml-latest-small'}")


if __name__ == "__main__":
    main()
