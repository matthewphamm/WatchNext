import numpy as np

from watchnext.data import clean_title


def test_clean_title_moves_article_and_extracts_year():
    assert clean_title("Matrix, The (1999)") == ("The Matrix", 1999)
    assert clean_title("City of Lost Children, The (Cité des enfants perdus, La) (1995)") == (
        "The City of Lost Children (Cité des enfants perdus, La)", 1995)
    assert clean_title("Babylon 5") == ("Babylon 5", None)


def test_predictions_follow_taste(model):
    preds = model.predict({1: 5.0, 4: 1.0})
    idx = model.index
    assert preds[idx[2]] > preds[idx[5]]
    assert preds[idx[3]] > preds[idx[6]]
    assert np.all((preds >= 0.5) & (preds <= 5.0))


def test_recommend_skips_rated_and_excluded(model):
    recs = model.ids[model.recommend({1: 5.0}, n=10, exclude=[2], min_count=0)]
    assert 1 not in recs and 2 not in recs
    assert recs[0] == 3


def test_no_ratings_falls_back_to_baseline(model):
    base, collab, content, alpha = model.predict_components({})
    assert alpha == 0.0
    assert np.allclose(model.predict({}), np.clip(base, 0.5, 5.0))


def test_similar_prefers_same_cluster(model):
    similar = model.ids[model.similar(1, n=2, min_count=0)]
    assert set(similar) == {2, 3}


def test_explain_mentions_loved_movie(model):
    reasons = model.explain(2, {1: 5.0})
    assert reasons[0] == {"kind": "similar", "text": "You rated Space One 5 stars"}
    assert reasons[-1]["kind"] == "stats"


def test_match_percent():
    from watchnext.recommender import Recommender
    assert list(Recommender.match_percent([5.0, 2.5, 4.7])) == [100, 50, 94]
