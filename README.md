# WatchNext 🎬

A movie recommendation web app that suggests what to watch next based on your ratings. Built with Python, Scikit-learn, FastAPI and React.

> **Live demo:** _coming soon_ · **Author:** Matthew Pham

---

## Overview

WatchNext learns your taste from the movies you rate, then recommends titles you're likely to enjoy. It combines two classic recommendation approaches:

- **Collaborative filtering** finds patterns in how ~600 MovieLens users rated movies and recommends what people with your taste liked.
- **Content-based filtering** recommends movies similar to ones you rated highly, using genres, viewer tags and release decade.

A hybrid score blends both, so new users get useful suggestions right away and recommendations get more personal as they rate more movies.

## Features

- ⭐ **Rate movies** on a 0.5–5 star scale to build a taste profile
- 🎯 **Personalized recommendations** from a hybrid collaborative + content-based model, with a match score per movie
- 🔍 **"More like this"** for any movie, blending content and collaborative item similarity
- 🧊 **Cold-start handling:** new visitors rate a few well-known movies (filterable by genre) to get started
- 💬 **Explainable results**, e.g. "You rated *Inception* 4.5 stars" or "People with your taste rated it highly"
- 🔖 **Search, watchlist and "Not for me"** to filter, save and hide movies

## How It Works

### 1. Data
Trained on [MovieLens ml-latest-small](https://grouplens.org/datasets/movielens/): 100,836 ratings and 3,683 tags from 610 users across 9,742 movies.

### 2. Baseline
Every prediction starts from `global mean + item bias`, with the item bias shrunk toward zero for rarely rated movies so a single 5-star rating doesn't dominate. A per-visitor bias is added the same way.

### 3. Collaborative filtering model
- Builds a sparse user × movie matrix of residuals (rating − baseline − user bias) with `scipy.sparse`
- Factorizes it with `TruncatedSVD` (50 components) to learn latent movie factors
- **Folds in** a new visitor by projecting their residuals onto the movie factors, so recommendations update instantly without retraining

### 4. Content-based model
- Each movie becomes a document of genre, tag and decade tokens, vectorized with `TfidfVectorizer`
- A candidate's predicted rating is the cosine-similarity-weighted residual of the 20 most similar movies the visitor rated

### 5. Hybrid ranking
```
predicted = α · collaborative + (1 − α) · content,   α = min(0.8, n / (n + 10))
match %   = predicted / 5
```
`n` is the number of movies the visitor has rated, so content similarity carries new visitors and collaborative signals take over as they rate more. Rated and dismissed movies are filtered out.

### 6. Evaluation
`python -m watchnext.evaluate` holds out 20% of the ratings of every user with at least 10 ratings, fits on the rest, then predicts each user's held-out ratings by folding in their training ratings, exactly like a site visitor.
- **RMSE** on held-out ratings
- **Precision@10 / Recall@10**: of the 10 unseen movies ranked highest for a user, how many are held-out movies they rated 4 or more

## Tech Stack

| Layer          | Tools                                       |
| -------------- | ------------------------------------------- |
| ML / Data      | Python, Scikit-learn, Pandas, NumPy, SciPy  |
| Backend / API  | FastAPI, Uvicorn                            |
| Frontend       | React, Vite, WatchNext design system        |
| Testing        | pytest                                      |

## Project Structure

```
WatchNext/
├── backend/
│   ├── scripts/download_data.py  # Fetch MovieLens into backend/data/
│   ├── watchnext/
│   │   ├── data.py               # Load and clean ratings, movies, tags
│   │   ├── recommender.py        # Baseline, TruncatedSVD, TF-IDF and hybrid model
│   │   ├── train.py              # Fit and save models/recommender.joblib
│   │   ├── evaluate.py           # RMSE, Precision@K, Recall@K
│   │   └── api.py                # FastAPI endpoints
│   ├── tests/
│   └── requirements.txt
├── web/
│   ├── src/design-system/        # Tokens and components from Claude Design
│   ├── src/screens/              # Home, Detail, Rate, Search/Watchlist
│   ├── src/api.js                # API client
│   └── src/App.jsx
└── README.md
```

The API is stateless: ratings, the watchlist and dismissed movies are kept in the browser and sent with each request.

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend
```bash
git clone https://github.com/matthewphamm/WatchNext.git
cd WatchNext/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/download_data.py
python -m watchnext.train
uvicorn watchnext.api:app --port 8000
```
Training takes under a second. The API also trains on first start if no saved model exists.

### Frontend
In a second terminal:
```bash
cd web
npm install
npm run dev
```
Then open `http://localhost:5173`. Vite forwards `/api` requests to the backend on port 8000.

### Tests and evaluation
```bash
cd backend
python -m pytest
python -m watchnext.evaluate
```

## Results

From `python -m watchnext.evaluate` (80/20 split, seed 0, 608 users, 20,302 held-out ratings):

| Method        | RMSE  | Precision@10 | Recall@10 |
| ------------- | ----- | ------------ | --------- |
| Baseline      | 0.866 | 0.088        | 0.073     |
| Collaborative | 0.859 | 0.093        | 0.074     |
| Content-based | 0.840 | 0.067        | 0.055     |
| **Hybrid**    | 0.848 | **0.096**    | **0.075** |

The hybrid gives the best top-10 lists. Content-based alone predicts individual ratings most accurately, and a content-heavier blend reaches RMSE 0.837, but its top-10 precision drops to 0.084. Since the site's job is ranking what to watch next, the blend favors precision.

## Roadmap

- [ ] Poster and backdrop art from the TMDB API
- [ ] User accounts so ratings and watchlists sync across devices
- [ ] Implicit feedback (clicks, watch time) alongside explicit ratings
- [ ] Recommendation diversity and serendipity tuning
- [ ] Streaming-availability info per region
- [ ] Scheduled model retraining as new ratings arrive

## What I Learned

- Building and comparing collaborative, content-based and hybrid recommenders
- Working with sparse matrices and dimensionality reduction (SVD)
- Handling the cold-start problem for new users and new movies
- Evaluating ranking quality, not just prediction error
- Serving an ML model behind a web API

## Acknowledgments

- [MovieLens](https://grouplens.org/datasets/movielens/) by GroupLens Research

## License

MIT
