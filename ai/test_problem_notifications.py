import problem_storage
from api import CitizenProblemAction, create_problem_endpoint, resubmit_problem_endpoint
from problem_storage import ProblemBase, list_notifications, update_problem


def make_problem() -> ProblemBase:
    return ProblemBase(
        problem_text="A broken streetlight makes the road unsafe.",
        title="Broken streetlight",
        citizen_name="Notification Test Citizen",
    )


def test_problem_submission_creates_notification(tmp_path, monkeypatch):
    monkeypatch.setattr(problem_storage, "DATABASE_PATH", str(tmp_path / "notifications.sqlite3"))
    problem_storage.initialize_storage()

    created = create_problem_endpoint(make_problem())

    notifications = list_notifications(created.citizen_name)
    assert len(notifications) == 1
    assert notifications[0].title == "Problem submitted"
    assert notifications[0].problem_id == created.id


def test_problem_resubmission_creates_notification(tmp_path, monkeypatch):
    monkeypatch.setattr(problem_storage, "DATABASE_PATH", str(tmp_path / "notifications.sqlite3"))
    problem_storage.initialize_storage()

    created = create_problem_endpoint(make_problem())
    update_problem(created.id, problem_storage.ProblemUpdate(status="returned_for_correction"))

    resubmitted = resubmit_problem_endpoint(
        created.id,
        CitizenProblemAction(citizen_name=created.citizen_name, note="Added a clearer photo."),
    )

    notifications = list_notifications(created.citizen_name)
    assert resubmitted.status == "under_review"
    assert {notification.title for notification in notifications} == {
        "Problem resubmitted",
        "Problem submitted",
    }