"""
Evidence on milestone submissions: photos, videos, PDFs, Office documents and links.
Uses TestClient because multipart file upload is an HTTP-layer concern.
"""

import os

import pytest
from fastapi.testclient import TestClient

import api
import points_storage
import problem_storage
from api import MAX_MILESTONE_ATTACHMENTS, app
from problem_storage import (
    CollaborationRequestRecord,
    ProblemBase,
    ProblemUpdate,
    add_volunteer,
    create_collaboration_request,
    create_problem,
    select_volunteer,
    transition_collaboration_request,
    update_problem,
)

UNIVERSITY = "ABC Institute of Technology"
INDUSTRY = "Tech Solutions Pvt Ltd"
OUTSIDER = "Some Other University"
OFFICER_ID = "officer-1"
OFFICER_NAME = "Dr. Anita Sharma"

DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


@pytest.fixture(autouse=True)
def isolated_db(tmp_path, monkeypatch):
    monkeypatch.setattr(problem_storage, "DATABASE_PATH", str(tmp_path / "evidence.sqlite3"))
    # Keep test uploads out of the real data/uploads folder, and let tests see what got written.
    uploads = tmp_path / "uploads"
    uploads.mkdir()
    monkeypatch.setattr(api, "UPLOAD_DIR", str(uploads))
    problem_storage.initialize_storage()


@pytest.fixture
def uploads_dir():
    return api.UPLOAD_DIR


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def project():
    """University leads; industry joined as an accepted collaborator."""
    problem = create_problem(ProblemBase(problem_text="Potholes", title="Pothole alerts", citizen_name="Rahul Sharma"))
    update_problem(problem.id, ProblemUpdate(status="verified"))
    add_volunteer(problem.id, "university", UNIVERSITY, "We can help")
    select_volunteer(problem.id, "university", UNIVERSITY)
    request = create_collaboration_request(CollaborationRequestRecord(
        requested_by="university", university_name=UNIVERSITY, industry_name=INDUSTRY,
        problem_id=problem.id, challenge_title="Pothole alerts",
    ))
    transition_collaboration_request(request.id, "industry", INDUSTRY, "accept")
    return problem


def submit(client, problem_id, files=None, links=None, **overrides):
    data = {
        "party_type": "university", "party_name": UNIVERSITY, "user_id": "u1", "user_name": "Janhavi Tupe",
        "milestone_type": "prototype_completed", "note": "Demo ready", **overrides,
    }
    if links is not None:
        data["links"] = links  # a list -> repeated form field
    return client.post(f"/projects/{problem_id}/milestones/with-attachments", data=data, files=files or [])


def stored_files(uploads_dir):
    return sorted(os.listdir(uploads_dir))


def test_submission_accepts_images_videos_pdfs_documents_and_links(client, project, uploads_dir):
    files = [
        ("files", ("photo.jpg", b"\xff\xd8\xff fake jpeg", "image/jpeg")),
        ("files", ("clip.mp4", b"fake mp4 bytes", "video/mp4")),
        ("files", ("report.pdf", b"%PDF-1.4 fake", "application/pdf")),
        ("files", ("plan.docx", b"fake docx", DOCX)),
    ]
    response = submit(client, project.id, files=files, links=["https://example.com/demo", "www.example.org/repo"])
    assert response.status_code == 201, response.text
    body = response.json()

    assert body["status"] == "submitted"
    assert [a["name"] for a in body["submitted_attachments"]] == ["photo.jpg", "clip.mp4", "report.pdf", "plan.docx"]
    assert all(a["url"].startswith("/uploads/") for a in body["submitted_attachments"])
    assert body["submitted_links"] == ["https://example.com/demo", "https://www.example.org/repo"]
    assert len(stored_files(uploads_dir)) == 4  # every file really landed on disk

    # Persisted, not just returned once: the project's own history and the officer queue both carry it.
    history = client.get(
        f"/projects/{project.id}/milestones", params={"party_type": "university", "party_name": UNIVERSITY},
    ).json()
    assert history["milestones"][0]["submitted_links"] == body["submitted_links"]
    queue = client.get("/milestones", params={"status": "submitted"}).json()
    assert [a["name"] for a in queue[0]["submitted_attachments"]] == ["photo.jpg", "clip.mp4", "report.pdf", "plan.docx"]


def test_submission_with_links_only_or_nothing_at_all_still_works(client, project):
    assert submit(client, project.id, links=["https://example.com/x"]).status_code == 201
    assert submit(client, project.id, milestone_type="project_accepted").status_code == 201


def test_disallowed_file_type_is_rejected_and_nothing_is_left_behind(client, project, uploads_dir):
    files = [
        ("files", ("ok.pdf", b"%PDF-1.4 fake", "application/pdf")),
        ("files", ("virus.exe", b"MZ fake exe", "application/x-msdownload")),
    ]
    response = submit(client, project.id, files=files)
    assert response.status_code == 415
    assert "virus.exe" in response.json()["detail"]
    assert stored_files(uploads_dir) == []  # the good file saved before the bad one was rolled back
    assert points_storage.list_milestones(project.id) == []


def test_oversized_file_is_rejected(client, project, uploads_dir):
    huge = b"x" * (10 * 1024 * 1024 + 1)
    response = submit(client, project.id, files=[("files", ("huge.png", huge, "image/png"))])
    assert response.status_code == 413
    assert stored_files(uploads_dir) == []


def test_too_many_files_is_rejected(client, project, uploads_dir):
    files = [("files", (f"f{i}.png", b"x", "image/png")) for i in range(MAX_MILESTONE_ATTACHMENTS + 1)]
    response = submit(client, project.id, files=files)
    assert response.status_code == 400
    assert stored_files(uploads_dir) == []


def test_an_invalid_link_is_rejected_before_any_file_is_written(client, project, uploads_dir):
    files = [("files", ("ok.pdf", b"%PDF-1.4 fake", "application/pdf"))]
    response = submit(client, project.id, files=files, links=["javascript:alert(1)"])
    assert response.status_code == 400
    assert stored_files(uploads_dir) == []
    assert points_storage.list_milestones(project.id) == []


def test_an_outsider_cannot_attach_evidence_and_no_file_is_written(client, project, uploads_dir):
    files = [("files", ("ok.pdf", b"%PDF-1.4 fake", "application/pdf"))]
    response = submit(client, project.id, files=files, party_name=OUTSIDER)
    assert response.status_code == 403
    assert stored_files(uploads_dir) == []


def test_a_citizen_cannot_submit_milestones_with_evidence(client, project, uploads_dir):
    files = [("files", ("ok.pdf", b"%PDF-1.4 fake", "application/pdf"))]
    response = submit(client, project.id, files=files, party_type="citizen", party_name="Rahul Sharma")
    assert response.status_code == 403
    assert stored_files(uploads_dir) == []


def test_resubmitting_a_verified_milestone_fails_and_discards_the_new_files(client, project, uploads_dir):
    first = submit(client, project.id, milestone_type="project_accepted").json()
    points_storage.verify_milestone(first["id"], "approve", None, OFFICER_ID, OFFICER_NAME)

    files = [("files", ("late.pdf", b"%PDF-1.4 fake", "application/pdf"))]
    response = submit(client, project.id, files=files, milestone_type="project_accepted")
    assert response.status_code == 409
    assert stored_files(uploads_dir) == []  # the upload made for a submission that never happened is removed


def test_resubmission_after_rejection_replaces_the_evidence(client, project):
    first = submit(client, project.id, links=["https://example.com/old"],
                   files=[("files", ("old.pdf", b"%PDF-1.4 old", "application/pdf"))]).json()
    points_storage.verify_milestone(first["id"], "reject", "Not enough detail", OFFICER_ID, OFFICER_NAME)

    second = submit(client, project.id, links=["https://example.com/new"],
                    files=[("files", ("new.pdf", b"%PDF-1.4 new", "application/pdf"))]).json()
    assert second["id"] == first["id"]
    assert second["status"] == "submitted"
    assert [a["name"] for a in second["submitted_attachments"]] == ["new.pdf"]
    assert second["submitted_links"] == ["https://example.com/new"]


def test_json_endpoint_accepts_links_and_validates_them(client, project):
    base = {
        "party_type": "university", "party_name": UNIVERSITY, "user_id": "u1", "user_name": "Janhavi Tupe",
        "milestone_type": "project_accepted",
    }
    ok = client.post(f"/projects/{project.id}/milestones", json={**base, "links": ["https://example.com/a"]})
    assert ok.status_code == 201
    assert ok.json()["submitted_links"] == ["https://example.com/a"]

    bad = client.post(f"/projects/{project.id}/milestones", json={**base, "milestone_type": "initial_planning", "links": ["ftp://x.com/y"]})
    assert bad.status_code == 400


def test_stored_file_matches_the_url_and_size_the_record_advertises(client, project, uploads_dir):
    # The /uploads static mount that serves these is bound to the real upload folder when api.py is
    # imported, so it can't see this test's temp folder; check the bytes on disk instead. Serving
    # itself is the same mount every workspace attachment already uses.
    body = submit(client, project.id, files=[("files", ("report.pdf", b"%PDF-1.4 real bytes", "application/pdf"))]).json()
    attachment = body["submitted_attachments"][0]
    with open(os.path.join(uploads_dir, os.path.basename(attachment["url"])), "rb") as stored:
        assert stored.read() == b"%PDF-1.4 real bytes"
    assert attachment["size"] == len(b"%PDF-1.4 real bytes")
    assert attachment["content_type"] == "application/pdf"
