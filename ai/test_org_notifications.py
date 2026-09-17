"""
Alerts for the university and industry portals: volunteer outcomes and
university <-> industry collaboration requests. Each portal must only see
its own alerts, never the citizen-government ones.
"""

import pytest
from fastapi import HTTPException

import problem_storage
from api import (
    CollaborationAction,
    CreateCollaborationRequest,
    SelectVolunteerRequest,
    VolunteerRequest,
    act_on_collaboration_request_endpoint,
    create_collaboration_request_endpoint,
    create_problem_endpoint,
    delete_problem_endpoint,
    get_notifications,
    select_volunteer_endpoint,
    volunteer_for_problem_endpoint,
)
from problem_storage import ProblemBase, ProblemUpdate, update_problem

UNIVERSITY = "ABC Institute of Technology"
INDUSTRY = "Tech Solutions Pvt Ltd"


@pytest.fixture(autouse=True)
def isolated_db(tmp_path, monkeypatch):
    monkeypatch.setattr(problem_storage, "DATABASE_PATH", str(tmp_path / "org.sqlite3"))
    problem_storage.initialize_storage()


def verified_problem(citizen="Rahul Sharma"):
    created = create_problem_endpoint(ProblemBase(problem_text="Potholes everywhere", title="Pothole alerts", citizen_name=citizen))
    update_problem(created.id, ProblemUpdate(status="verified"))
    return created


def titles(recipient, audience):
    return [n.title for n in get_notifications(recipient, audience=audience)]


def test_volunteer_outcomes_reach_university_and_industry_inboxes():
    problem = verified_problem()
    volunteer_for_problem_endpoint(problem.id, VolunteerRequest(solver_type="university", solver_name=UNIVERSITY))
    volunteer_for_problem_endpoint(problem.id, VolunteerRequest(solver_type="industry", solver_name=INDUSTRY))

    select_volunteer_endpoint(problem.id, SelectVolunteerRequest(solver_type="industry", solver_name=INDUSTRY))

    assert titles(INDUSTRY, "industry") == ["Volunteer request accepted", "Volunteer request submitted"]
    assert titles(UNIVERSITY, "university") == ["Volunteer request not selected", "Volunteer request submitted"]
    # Citizen-government alerts stay out of the organisation portals.
    assert "Problem submitted" not in titles("Rahul Sharma", "university")
    assert "Volunteer request accepted" not in titles(INDUSTRY, "citizen")


def test_same_name_in_two_roles_does_not_mix_inboxes():
    shared_name = "janhavi tupe"
    problem = verified_problem(citizen=shared_name)
    other = verified_problem()
    volunteer_for_problem_endpoint(other.id, VolunteerRequest(solver_type="university", solver_name=shared_name))

    assert titles(shared_name, "university") == ["Volunteer request submitted"]
    assert "Volunteer request submitted" not in titles(shared_name, "citizen")
    assert problem.id  # citizen's own "Problem submitted" alert stays in the citizen inbox
    assert "Problem submitted" in titles(shared_name, "citizen")


def test_blank_solver_name_is_rejected():
    problem = verified_problem()
    with pytest.raises(HTTPException) as error:
        volunteer_for_problem_endpoint(problem.id, VolunteerRequest(solver_type="industry", solver_name=" "))
    assert error.value.status_code == 400


def test_deleting_problem_alerts_pending_volunteers():
    problem = create_problem_endpoint(ProblemBase(problem_text="Broken well", title="Broken well", citizen_name="Rahul Sharma"))
    volunteer_for_problem_endpoint(problem.id, VolunteerRequest(solver_type="university", solver_name=UNIVERSITY))

    delete_problem_endpoint(problem.id, citizen_name="Rahul Sharma")

    assert titles(UNIVERSITY, "university")[0] == "Problem withdrawn by owner"


def request_support(problem_id=None):
    return create_collaboration_request_endpoint(CreateCollaborationRequest(
        requested_by="university",
        university_name=UNIVERSITY,
        industry_name=INDUSTRY,
        problem_id=problem_id,
        challenge_title="Pothole alerts",
        support_types=["Funding", "Hardware"],
        description="Need sensors",
    ))


def test_collaboration_request_clarify_reply_accept_flow():
    problem = verified_problem()
    record = request_support(problem.id)

    assert titles(INDUSTRY, "industry") == ["New collaboration request"]
    assert titles(UNIVERSITY, "university") == ["Collaboration request sent"]

    act_on_collaboration_request_endpoint(record.id, CollaborationAction(
        actor_type="industry", actor_name=INDUSTRY, action="clarify", note="How many sensors?"))
    assert titles(UNIVERSITY, "university")[0] == "Clarification requested"

    act_on_collaboration_request_endpoint(record.id, CollaborationAction(
        actor_type="university", actor_name=UNIVERSITY, action="reply", note="Ten"))
    assert titles(INDUSTRY, "industry")[0] == "Clarification provided"

    accepted = act_on_collaboration_request_endpoint(record.id, CollaborationAction(
        actor_type="industry", actor_name=INDUSTRY, action="accept"))
    assert accepted.status == "accepted"
    assert titles(UNIVERSITY, "university")[0] == "Collaboration request accepted"
    assert problem_storage.get_problem(problem.id).assigned_industry == INDUSTRY
    # None of this leaks to the citizen who posted the problem.
    assert not any("ollaboration" in t for t in titles("Rahul Sharma", "citizen"))


def test_collaboration_reject_requires_reason_and_alerts_requester():
    record = request_support()
    with pytest.raises(HTTPException) as error:
        act_on_collaboration_request_endpoint(record.id, CollaborationAction(
            actor_type="industry", actor_name=INDUSTRY, action="reject"))
    assert error.value.status_code == 400

    act_on_collaboration_request_endpoint(record.id, CollaborationAction(
        actor_type="industry", actor_name=INDUSTRY, action="reject", note="No budget this quarter"))
    assert titles(UNIVERSITY, "university")[0] == "Collaboration request declined"


def test_only_the_receiving_industry_can_respond():
    record = request_support()
    for actor_type, actor_name in (("university", UNIVERSITY), ("industry", "Some Other Company")):
        with pytest.raises(HTTPException) as error:
            act_on_collaboration_request_endpoint(record.id, CollaborationAction(
                actor_type=actor_type, actor_name=actor_name, action="accept"))
        assert error.value.status_code == 403


def test_duplicate_open_request_is_rejected():
    request_support()
    with pytest.raises(HTTPException) as error:
        request_support()
    assert error.value.status_code == 409
