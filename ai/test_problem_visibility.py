"""
Browsing lists only show verified problems (and the later accepted / in-progress / completed stages).
Unverified problems are listed only in the reporting citizen's own list and the government review queue.
"""

import pytest

import problem_storage
from api import create_problem_endpoint, list_problem_endpoint
from problem_storage import ProblemBase, ProblemUpdate, update_problem

ALL_STATUSES = ["submitted", "under_review", "returned_for_correction", "rejected", "verified", "assigned", "in_progress", "completed"]


@pytest.fixture(autouse=True)
def problems(tmp_path, monkeypatch):
    monkeypatch.setattr(problem_storage, "DATABASE_PATH", str(tmp_path / "visibility.sqlite3"))
    problem_storage.initialize_storage()
    for status in ALL_STATUSES:
        created = create_problem_endpoint(ProblemBase(problem_text=status, title=status, citizen_name="Rahul Sharma"))
        update_problem(created.id, ProblemUpdate(status=status))


def statuses(problems):
    return sorted(p.status for p in problems)


def test_browsing_list_hides_unverified_problems():
    assert statuses(list_problem_endpoint()) == sorted(["verified", "assigned", "in_progress", "completed"])


def test_asking_for_an_unverified_status_while_browsing_returns_nothing():
    for status in ("submitted", "under_review", "returned_for_correction", "rejected"):
        assert list_problem_endpoint(status=status) == []
    assert statuses(list_problem_endpoint(status="verified")) == ["verified"]


def test_citizen_sees_all_their_own_problems():
    assert statuses(list_problem_endpoint(citizen_name="Rahul Sharma")) == sorted(ALL_STATUSES)
    assert list_problem_endpoint(citizen_name="Someone Else") == []


def test_government_review_queue_can_include_unverified():
    assert statuses(list_problem_endpoint(include_unverified=True)) == sorted(ALL_STATUSES)
    assert statuses(list_problem_endpoint(status="under_review", include_unverified=True)) == ["under_review"]
