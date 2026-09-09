"""
test_notifications.py

Sanity tests for notification_service.py. These run entirely in dry-run
mode (no .env credentials needed, no network calls) -- they check that
the fan-out logic reaches the right recipients and that missing config
degrades gracefully instead of raising.
"""

from notification_service import send_email, send_sms, notify_fanout


def test_send_email_dry_run_without_smtp_config():
    result = send_email("citizen@example.com", "Subject", "Body")
    assert result["ok"] is True
    assert result["dry_run"] is True
    assert result["channel"] == "email"


def test_send_sms_dry_run_without_provider_config():
    result = send_sms("+911234567890", "Test message")
    assert result["ok"] is True
    assert result["dry_run"] is True
    assert result["channel"] == "sms"


def test_send_email_missing_recipient_fails_cleanly():
    result = send_email("", "Subject", "Body")
    assert result["ok"] is False


def test_notify_fanout_with_no_contacts_returns_empty():
    result = {"summary": {"title": "Pothole", "summary": "..."}, "classification": {"domain": "Infrastructure"}}
    statuses = notify_fanout(result)
    assert statuses == []


def test_notify_fanout_reaches_citizen_mentor_and_university():
    result = {
        "summary": {"title": "Pothole", "summary": "Road damaged.", "suggested_intervention": "Repave."},
        "classification": {"domain": "Infrastructure"},
    }
    citizen_contact = {"email": "citizen@example.com", "phone": "+911234567890"}
    mentor = {"name": "Dr. Test", "contact_email": "mentor@example.edu", "contact_phone": "+911111111111"}
    university = {"name": "Test University", "contact_email": "uni@example.edu", "contact_phone": None}

    statuses = notify_fanout(
        result, citizen_contact=citizen_contact,
        selected_university=university, selected_mentor=mentor,
    )

    # citizen: email + sms, mentor: email + sms, university: email only = 5
    assert len(statuses) == 5
    recipients = {s["to"] for s in statuses}
    assert "citizen@example.com" in recipients
    assert "mentor@example.edu" in recipients
    assert "uni@example.edu" in recipients


def test_department_matcher_ranks_relevant_department_first():
    from department_matcher import list_departments_for_university, match_departments

    departments = list_departments_for_university("uni_001")
    assert len(departments) >= 1

    result = match_departments(
        problem_text="The road near the village has collapsed and needs civil repair.",
        domain="civil engineering", subdomain="infrastructure",
        university_id="uni_001",
    )
    assert result["primary"] is not None
    assert result["primary"]["name"] == "Civil Engineering"


def test_department_matcher_handles_unknown_university():
    from department_matcher import match_departments

    result = match_departments(
        problem_text="Anything", domain="Infrastructure", subdomain="",
        university_id="uni_does_not_exist",
    )
    assert result == {"primary": None, "supporting": []}
