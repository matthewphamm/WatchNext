# WatchNext 🎬

A movie recommendation web app that suggests what to watch next based on your ratings and viewing history. Built with Python and Scikit-learn.

> **Live demo:** _coming soon_ · **Author:** Matthew Pham

---

## Overview

WatchNext learns your taste from the movies you rate and watch, then recommends titles you're likely to enjoy. It combines two classic recommendation approaches:

- **Collaborative filtering** finds users with similar rating patterns and recommends what they liked.
- **Content-based filtering** recommends movies similar to ones you rated highly, using genres, tags, cast and plot keywords.

A hybrid score blends both, so new users get useful suggestions right away and recommendations get more personal as they rate more movies.

## Features

- ⭐ **Rate movies** on a 1–5 scale to build a taste profile
- 🎯 **Personalized recommendations** from a hybrid collaborative + content-based model
- 🔍 **"More like this"** for any movie, using item-to-item similarity
- 🕒 **Viewing-pattern signals:** watch history, recency and genre preferences shape results
- 🧊 **Cold-start handling:** new users pick a few favorite genres or movies to get started
- 💬 **Explainable results**, e.g. "Because you liked *Inception*"

## How It Works

### 1. Data
Trained on the [MovieLens](https://grouplens.org/datasets/movielens/) dataset (user ratings, movie metadata and tags), plus ratings collected in the app.

### 2. Content-based model
- Movie metadata (genres, tags, overview) is combined into a text profile per movie
- Vectorized with `TfidfVectorizer`
- Similarity computed with `cosine_similarity` / `NearestNeighbors(metric="cosine")`

### 3. Collaborative filtering model
- Builds a sparse user–item rating matrix (`scipy.sparse`)
- Factorizes it with `TruncatedSVD` to learn latent user and movie features
- Predicts ratings for unseen movies from the reconstructed matrix

### 4. Hybrid ranking
```
score = α · collaborative_score + (1 − α) · content_score
```
`α` rises as a user rates more movies, shifting weight from content similarity to collaborative signals. Movies the user has already watched are filtered out, and recent activity is weighted more heavily.

### 5. Evaluation
- Train/test split by user with `train_test_split`
- Metrics: **RMSE** for rating prediction, **Precision@K / Recall@K** for top-K recommendations
- Hyperparameters (SVD components, α) tuned with cross-validation

## Tech Stack

| Layer          | Tools                                   |
| -------------- | --------------------------------------- |
| ML / Data      | Python, Scikit-learn, Pandas, NumPy, SciPy |
| Backend / API  | Flask or FastAPI                        |
| Frontend       | HTML/CSS/JavaScript (or React)          |
| Database       | SQLite / PostgreSQL                     |
| Movie metadata | TMDB API (posters, overviews)           |
| Deployment     | Render / Vercel / Docker                |

## Project Structure

```
WatchNext/
├── data/                 # Raw and processed datasets
├── notebooks/            # EDA and model experiments
├── src/
│   ├── data_loader.py    # Load and clean ratings/metadata
│   ├── content_model.py  # TF-IDF + cosine similarity
│   ├── collab_model.py   # TruncatedSVD collaborative filtering
│   ├── hybrid.py         # Score blending and ranking
│   └── evaluate.py       # RMSE, Precision@K, Recall@K
├── app/                  # Web app (API routes, templates, static files)
├── models/               # Saved trained models (joblib)
├── tests/
├── requirements.txt
└── README.md
```

## Getting Started

### Prerequisites
- Python 3.10+
- A free [TMDB API key](https://www.themoviedb.org/settings/api) (optional, for posters)

### Installation
```bash
git clone https://github.com/<your-username>/WatchNext.git
cd WatchNext
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Train the models
```bash
python -m src.train
```

### Run the app
```bash
python -m app
```
Then open `http://localhost:5000`.

## Results

| Metric        | Content-based | Collaborative | Hybrid |
| ------------- | ------------- | ------------- | ------ |
| RMSE          | _TBD_         | _TBD_         | _TBD_  |
| Precision@10  | _TBD_         | _TBD_         | _TBD_  |
| Recall@10     | _TBD_         | _TBD_         | _TBD_  |

_Fill in after evaluation._

## Roadmap

- [ ] User accounts and saved watchlists
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
- [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.

## License

MIT
