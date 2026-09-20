"""
match_feedback: the Best Match list rotating instead of repeating, "not interested", and problems
that already have a workspace never being offered.
"""

import pytest
from fastapi import HTTPException
from pydantic import ValidationError

import match_feedback as mf
import people_matcher as pm
import problem_storage
from api import (
    ProblemFeedbackRequest,
    SelectVolunteerRequest,
    VolunteerRequest,
    organization_problem_feedback_endpoint,
    organization_problem_matches_endpoint,
    select_volunteer_endpoint,
    volunteer_for_problem_endpoint,
)
from problem_storage import ProblemBase, ProblemUpdate, create_problem, update_problem
from test_people_matcher import person

ORG = "U"
ME, COLLEAGUE = "user-me", "user-colleague"


@pytest.fixture(autouse=True)
def isolated(tmp_path, monkeypatch):
    monkeypatch.setattr(problem_storage, "DATABASE_PATH", str(tmp_path / "feedback.sqlite3"))
    problem_storage.initialize_storage()
    monkeypatch.setenv("MATCHING_AI", "off")


def verified(title, domain, subdomain, citizen="Rahul"):
    problem = create_problem(ProblemBase(problem_text=title, title=title, citizen_name=citizen))
    update_problem(problem.id, ProblemUpdate(status="verified", classification={"domain": domain, "subdomain": subdomain}))
    return problem


@pytest.fixture
def world(monkeypatch):
    """One university whose people are strong on flooding, decent on drainage, weaker on water quality."""
    people = [
        person("Flood Mentor", ORG, kind="mentor", domains=[("Water Resources", "Flood Management", 5), ("Sanitation", "Drainage and Waterlogging", 4)],
               load=1, capacity=4),
        person("Water Student", ORG, kind="student", domains=[("Water Resources", "Water Quality", 3)]),
    ]
    monkeypatch.setattr(pm, "load_people", lambda org_type=None: people)
    flood = verified("Flooding on the river road", "Water Resources", "Flood Management")
    drain = verified("Blocked drains", "Sanitation", "Drainage and Waterlogging")
    quality = verified("Brown well water", "Water Resources", "Water Quality")
    return {"flood": flood.id, "drain": drain.id, "quality": quality.id}


def top_ids(user=ME, top_k=3):
    result = organization_problem_matches_endpoint("university", ORG, top_k=top_k, ai="wait", user_id=user)
    return [m["problem"]["id"] for m in result["matches"]]


def test_without_feedback_the_best_problem_leads(world):
    assert top_ids()[0] == world["flood"]


def test_a_problem_that_has_been_seen_gives_way_to_a_fresh_one_of_similar_fit(world, monkeypatch):
    monkeypatch.setattr(mf, "SEEN_DEBOUNCE_SECONDS", 0)
    before = top_ids()
    for _ in range(3):
        mf.record_seen(ME, "university", ORG, [world["flood"]])
    after = top_ids()
    assert before[0] == world["flood"]
    assert after[0] != world["flood"], "having read the top problem three times, a fresh one should take its place"
    assert world["flood"] in after, "seen problems are demoted, not removed"


def test_repeat_views_within_a_moment_count_once(world):
    assert mf.record_seen(ME, "university", ORG, [world["flood"]]) == 1
    assert mf.record_seen(ME, "university", ORG, [world["flood"]]) == 0, "a reload or double mount is not a second read"
    assert mf.load(ME, ORG)[world["flood"]]["views"] == 1


def test_seen_weight_never_drops_below_the_floor():
    assert mf.priority(1.0, {"views": 500}) == pytest.approx(mf.SEEN_FLOOR)
    assert mf.priority(1.0, {"views": 0}) == 1.0


def test_not_interested_sends_a_problem_down_and_a_new_one_up(world):
    assert top_ids(top_k=1) == [world["flood"]]
    organization_problem_feedback_endpoint("university", ORG, ProblemFeedbackRequest(user_id=ME, action="dismiss", problem_ids=[world["flood"]]))
    assert top_ids(top_k=1) != [world["flood"]]


def test_a_dismissed_problem_leaves_the_cards_and_is_listed_below_them(world):
    """Not interested sinks it beneath every problem still on offer, but never discards it."""
    organization_problem_feedback_endpoint("university", ORG, ProblemFeedbackRequest(user_id=ME, action="dismiss", problem_ids=[world["flood"]]))
    result = organization_problem_matches_endpoint("university", ORG, top_k=10, ai="wait", user_id=ME)
    assert world["flood"] not in [m["problem"]["id"] for m in result["matches"]], "no longer competing for a card"
    assert [d["id"] for d in result["dismissed"]] == [world["flood"]]
    assert result["dismissed"][0]["title"], "listed by name so it can be recognised and brought back"


def test_the_best_match_never_outranks_a_problem_it_was_dismissed_for(world):
    """A dismissed problem goes below every undismissed one, however much better its raw score."""
    assert mf.sort_key(0.99, {"views": 0, "dismissed": True}) < mf.sort_key(0.01, {"views": 0, "dismissed": False})


def test_dismissing_every_match_still_frees_the_order_and_reports_what_was_set_aside(world):
    """The bug this guards: with a uniform discount, dismissing everything left the same cards on top.

    Every candidate gets the same factor, so their order among themselves never changes. Ranking
    dismissed problems as a group below the rest means each dismissal hands its slot to a problem
    that has not been dismissed, and only a fully exhausted pool falls back to showing dismissed ones.
    """
    everything = list(world.values())
    organization_problem_feedback_endpoint(
        "university", ORG, ProblemFeedbackRequest(user_id=ME, action="dismiss", problem_ids=everything)
    )
    result = organization_problem_matches_endpoint("university", ORG, top_k=3, ai="wait", user_id=ME)
    assert all(m["feedback"]["dismissed"] for m in result["matches"]), "nothing else is left to offer"
    assert sorted(d["id"] for d in result["dismissed"]) == sorted(everything), "the dashboard can restore all of them"

    organization_problem_feedback_endpoint(
        "university", ORG, ProblemFeedbackRequest(user_id=ME, action="restore", problem_ids=everything)
    )
    restored = organization_problem_matches_endpoint("university", ORG, top_k=3, ai="wait", user_id=ME)
    assert restored["dismissed"] == []
    assert top_ids(top_k=1) == [world["flood"]], "restoring everything brings back the plain ranking"


def test_the_dismissed_list_is_empty_for_a_signed_out_caller(world):
    organization_problem_feedback_endpoint(
        "university", ORG, ProblemFeedbackRequest(user_id=ME, action="dismiss", problem_ids=[world["flood"]])
    )
    result = organization_problem_matches_endpoint("university", ORG, top_k=3, ai="wait", user_id=None)
    assert result["dismissed"] == [], "one person's choices are not another caller's"


def test_each_dismissal_promotes_the_next_best_problem_into_the_cards(world):
    """The point of recomputing on every click: a freed slot goes to a real new problem, not a reshuffle."""
    seen_at_top = []
    for _ in range(3):
        top = top_ids(top_k=2)
        seen_at_top.append(top[0])
        organization_problem_feedback_endpoint(
            "university", ORG, ProblemFeedbackRequest(user_id=ME, action="dismiss", problem_ids=[top[0]])
        )
    assert len(set(seen_at_top)) == 3, "a different problem led the list after each dismissal"
    assert set(seen_at_top) == set(world.values()), "every problem got its turn at the top"


def test_restoring_puts_it_back(world):
    dismiss = ProblemFeedbackRequest(user_id=ME, action="dismiss", problem_ids=[world["flood"]])
    organization_problem_feedback_endpoint("university", ORG, dismiss)
    organization_problem_feedback_endpoint("university", ORG, ProblemFeedbackRequest(user_id=ME, action="restore", problem_ids=[world["flood"]]))
    assert top_ids(top_k=1) == [world["flood"]]


def test_reordering_never_changes_the_scores_a_card_shows(world):
    """Feedback moves a problem; it never restates how good a match it is, on a card or in the list below."""
    plain = {m["problem"]["id"]: m["match"]["score"] for m in organization_problem_matches_endpoint("university", ORG, top_k=10, ai="wait", user_id=None)["matches"]}
    organization_problem_feedback_endpoint("university", ORG, ProblemFeedbackRequest(user_id=ME, action="dismiss", problem_ids=[world["flood"]]))
    after = organization_problem_matches_endpoint("university", ORG, top_k=10, ai="wait", user_id=ME)
    scored = {m["problem"]["id"]: m["match"]["score"] for m in after["matches"]}
    scored.update({d["id"]: d["score"] for d in after["dismissed"]})
    assert scored == plain, "the dismissed problem keeps its real score, it is only ranked lower"


def test_one_persons_not_interested_does_not_hide_it_from_a_colleague(world):
    organization_problem_feedback_endpoint("university", ORG, ProblemFeedbackRequest(user_id=ME, action="dismiss", problem_ids=[world["flood"]]))
    assert top_ids(user=COLLEAGUE, top_k=1) == [world["flood"]]
    assert top_ids(user=None, top_k=1) == [world["flood"]]


def test_feedback_is_per_organization(world):
    organization_problem_feedback_endpoint("university", ORG, ProblemFeedbackRequest(user_id=ME, action="dismiss", problem_ids=[world["flood"]]))
    assert mf.load(ME, "some-other-org") == {}


def test_a_problem_with_a_workspace_is_never_offered(world):
    """The citizen accepting a volunteer opens the workspace and moves the problem out of 'verified'."""
    assert world["flood"] in top_ids(top_k=10)

    volunteer_for_problem_endpoint(world["flood"], VolunteerRequest(solver_type="university", solver_name="Some University"))
    select_volunteer_endpoint(world["flood"], SelectVolunteerRequest(solver_type="university", solver_name="Some University", citizen_name="Rahul"))

    assert problem_storage.get_problem(world["flood"]).status == "assigned"
    assert world["flood"] not in top_ids(top_k=10)
    assert world["flood"] not in top_ids(user=COLLEAGUE, top_k=10)


def test_feedback_for_an_unknown_problem_is_rejected(world):
    with pytest.raises(HTTPException) as caught:
        organization_problem_feedback_endpoint("university", ORG, ProblemFeedbackRequest(user_id=ME, action="seen", problem_ids=["nope"]))
    assert caught.value.status_code == 404
    assert mf.load(ME, ORG) == {}


def test_feedback_requests_are_validated():
    with pytest.raises(ValidationError):
        ProblemFeedbackRequest(user_id=ME, action="delete", problem_ids=["a"])
    with pytest.raises(ValidationError):
        ProblemFeedbackRequest(user_id=ME, action="seen", problem_ids=[])
    with pytest.raises(ValidationError):
        ProblemFeedbackRequest(user_id="", action="seen", problem_ids=["a"])
    with pytest.raises(ValidationError):
        ProblemFeedbackRequest(user_id=ME, action="seen", problem_ids=[str(i) for i in range(mf.MAX_IDS_PER_CALL + 1)])


def test_feedback_rejects_an_unknown_organization_type(world):
    with pytest.raises(HTTPException) as caught:
        organization_problem_feedback_endpoint("government", ORG, ProblemFeedbackRequest(user_id=ME, action="seen", problem_ids=[world["flood"]]))
    assert caught.value.status_code == 400
