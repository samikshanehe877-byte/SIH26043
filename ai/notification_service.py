"""
notification_service.py

Fan-out notifications (email + SMS) for a triaged problem submission.

Notifies, depending on what contact info is available:
    - the citizen (submission received + AI summary), if they gave contact info
    - the matched mentor, that a new problem was routed to them
    - the matched university (institutional contact), if it has one on file
    - the matched industry/CSR partner, if one was selected

Two channels, each with a real backend and a safe no-op fallback:
    - Email: SMTP (stdlib smtplib) -- works with a Gmail app password or
      any other SMTP provider.
    - SMS: pluggable provider selected via the SMS_PROVIDER env var --
      "twilio" (global) or "http" (a generic REST gateway shape that fits
      India-focused APIs like MSG91 / Fast2SMS -- adapt the payload in
      send_sms() to your specific provider's docs).

DRY-RUN BY DEFAULT: if a channel's credentials aren't configured in .env,
that channel logs what it *would* have sent and returns ok=True,
dry_run=True instead of raising. This mirrors ai_pipeline.py's _safe_call
pattern -- a missing API key here should never break your demo the way a
missing GEMINI_API_KEY would.

No provider was chosen yet (this project defaults to dry-run for both
channels until you fill in .env), so nothing here requires a paid account
to demo. See NOTIFICATIONS.md for how to wire up a real provider.

Connects to:
    - app.py (Notifications tab, manual send button)
    - api.py (POST /notify, for the separate frontend)
"""

import os
import logging
import smtplib
from email.mime.text import MIMEText
from typing import Optional, List, Dict, Any

from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------- email ---

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_FROM = os.getenv("EMAIL_FROM", SMTP_USER)

EMAIL_CONFIGURED = bool(SMTP_HOST and SMTP_USER and SMTP_PASSWORD)

# ------------------------------------------------------------------ sms ---

SMS_PROVIDER = os.getenv("SMS_PROVIDER", "mock").lower()  # "twilio" | "http" | "mock"

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER")

# Generic HTTP SMS gateway -- every India SMS API (MSG91, Fast2SMS, etc.)
# has a slightly different payload shape, so this sends a common
# {api_key, sender_id, to, message} JSON body. Adjust to match whichever
# provider you actually sign up with (check their API docs).
SMS_HTTP_URL = os.getenv("SMS_HTTP_URL")
SMS_HTTP_API_KEY = os.getenv("SMS_HTTP_API_KEY")
SMS_HTTP_SENDER_ID = os.getenv("SMS_HTTP_SENDER_ID")

SMS_CONFIGURED = (
    (SMS_PROVIDER == "twilio" and all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER]))
    or (SMS_PROVIDER == "http" and all([SMS_HTTP_URL, SMS_HTTP_API_KEY]))
)


def _status(channel: str, to: str, ok: bool, detail: str, dry_run: bool = False) -> Dict[str, Any]:
    return {"channel": channel, "to": to, "ok": ok, "dry_run": dry_run, "detail": detail}


def send_email(to_address: str, subject: str, body: str) -> Dict[str, Any]:
    """
    Sends a plaintext email via SMTP. Falls back to a logged dry-run if
    SMTP_HOST/SMTP_USER/SMTP_PASSWORD aren't set in .env. Never raises --
    always returns a status dict so callers (and the UI) can display it.
    """
    if not to_address:
        return _status("email", to_address, False, "No recipient address given.")

    if not EMAIL_CONFIGURED:
        logger.info("[DRY RUN] Email to %s | Subject: %s | Body: %s", to_address, subject, body)
        return _status(
            "email", to_address, True,
            "SMTP not configured in .env -- logged only (dry run).", dry_run=True,
        )

    try:
        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = EMAIL_FROM
        msg["To"] = to_address

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(EMAIL_FROM, [to_address], msg.as_string())

        return _status("email", to_address, True, "Sent.")
    except Exception as e:
        logger.exception("Email send failed for %s: %s", to_address, e)
        return _status("email", to_address, False, f"Send failed: {e}")


def send_sms(to_number: str, message: str) -> Dict[str, Any]:
    """
    Sends an SMS via the provider configured in SMS_PROVIDER:
      - "twilio": requires the `twilio` package (pip install twilio) plus
        TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER.
      - "http": generic REST gateway (MSG91 / Fast2SMS style), requires
        SMS_HTTP_URL + SMS_HTTP_API_KEY. Check your provider's docs --
        you will likely need to tweak the payload shape below.
      - anything else, or missing credentials (default "mock"): logs what
        would have been sent and returns ok=True, dry_run=True.
    Never raises.
    """
    if not to_number:
        return _status("sms", to_number, False, "No recipient number given.")

    if SMS_PROVIDER == "twilio" and SMS_CONFIGURED:
        try:
            from twilio.rest import Client  # optional dependency, imported lazily
            client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
            client.messages.create(body=message, from_=TWILIO_FROM_NUMBER, to=to_number)
            return _status("sms", to_number, True, "Sent via Twilio.")
        except ImportError:
            logger.warning("SMS_PROVIDER=twilio but the `twilio` package isn't installed.")
            return _status("sms", to_number, False, "twilio package not installed (pip install twilio).")
        except Exception as e:
            logger.exception("Twilio SMS send failed for %s: %s", to_number, e)
            return _status("sms", to_number, False, f"Send failed: {e}")

    if SMS_PROVIDER == "http" and SMS_CONFIGURED:
        try:
            import requests
            payload = {
                "api_key": SMS_HTTP_API_KEY,
                "sender_id": SMS_HTTP_SENDER_ID,
                "to": to_number,
                "message": message,
            }
            resp = requests.post(SMS_HTTP_URL, json=payload, timeout=10)
            resp.raise_for_status()
            return _status("sms", to_number, True, f"Sent via HTTP gateway (HTTP {resp.status_code}).")
        except Exception as e:
            logger.exception("HTTP SMS send failed for %s: %s", to_number, e)
            return _status("sms", to_number, False, f"Send failed: {e}")

    logger.info("[DRY RUN] SMS to %s: %s", to_number, message)
    return _status(
        "sms", to_number, True,
        "SMS provider not configured in .env -- logged only (dry run).", dry_run=True,
    )


def _recipient_contact(record: Optional[Dict[str, Any]]) -> Dict[str, Optional[str]]:
    if not record:
        return {"email": None, "phone": None}
    return {
        "email": record.get("contact_email"),
        "phone": record.get("contact_phone"),
    }


def notify_fanout(
    result: Dict[str, Any],
    citizen_contact: Optional[Dict[str, str]] = None,
    selected_university: Optional[Dict[str, Any]] = None,
    selected_mentor: Optional[Dict[str, Any]] = None,
    selected_industry_partner: Optional[Dict[str, Any]] = None,
) -> List[Dict[str, Any]]:
    """
    Sends every notification relevant to one triaged submission and returns
    a flat list of per-recipient status dicts (see `_status`) -- for display
    in app.py's Notifications tab, or as the JSON body of api.py's
    POST /notify response.

    Args:
        result: the dict returned by ai_pipeline.analyze_problem().
        citizen_contact: {"email": ..., "phone": ...}, both optional --
            whatever contact info the frontend/app collected from the citizen.
        selected_university / selected_mentor / selected_industry_partner:
            the specific record the operator picked (e.g. from
            result["universities"], the mentor list, or
            result["industry_partners"]). Each is expected to optionally
            carry "contact_email" / "contact_phone" fields (see the demo
            values added to data/*.json -- replace with real contacts
            before production use). Pass None to skip that recipient.

    Never raises. Returns [] if no contacts were given/found anywhere.
    """
    statuses: List[Dict[str, Any]] = []

    summary = result.get("summary") or {}
    title = summary.get("title") or "your submitted problem"
    classification = result.get("classification") or {}
    domain = classification.get("domain", "General")

    # 1. Citizen: acknowledgement of submission + AI summary
    if citizen_contact:
        citizen_subject = f"Your submission has been received: {title}"
        citizen_body = (
            f"Thank you for reporting this issue.\n\n"
            f"Category: {domain}\n"
            f"Summary: {summary.get('summary', 'Pending review.')}\n\n"
            f"Your submission is being routed to the relevant university/mentor "
            f"and, where applicable, an industry/CSR partner. You will be "
            f"updated as it progresses."
        )
        citizen_sms = f"Your report '{title}' was received and is being routed for review. - SIH26043 Platform"

        if citizen_contact.get("email"):
            statuses.append(send_email(citizen_contact["email"], citizen_subject, citizen_body))
        if citizen_contact.get("phone"):
            statuses.append(send_sms(citizen_contact["phone"], citizen_sms))

    # 2. Mentor: new problem assigned
    if selected_mentor:
        contact = _recipient_contact(selected_mentor)
        mentor_subject = f"New problem assigned: {title}"
        mentor_body = (
            f"A new citizen-submitted problem has been routed to you.\n\n"
            f"Domain: {domain}\n"
            f"Summary: {summary.get('summary', '')}\n"
            f"Suggested intervention: {summary.get('suggested_intervention', '')}\n\n"
            f"Please review it on the platform dashboard."
        )
        mentor_sms = f"New problem assigned to you: '{title}' ({domain}). Check the platform for details."

        if contact["email"]:
            statuses.append(send_email(contact["email"], mentor_subject, mentor_body))
        if contact["phone"]:
            statuses.append(send_sms(contact["phone"], mentor_sms))

    # 3. University institutional contact (separate from any one mentor)
    if selected_university:
        contact = _recipient_contact(selected_university)
        if contact["email"] or contact["phone"]:
            uni_subject = f"New problem routed to {selected_university.get('name', 'your institution')}"
            uni_body = (
                f"A new citizen-submitted problem in the {domain} domain has "
                f"been routed to your institution.\n\nSummary: {summary.get('summary', '')}"
            )
            if contact["email"]:
                statuses.append(send_email(contact["email"], uni_subject, uni_body))
            if contact["phone"]:
                statuses.append(send_sms(contact["phone"], f"New problem routed to your institution: '{title}'."))

    # 4. Industry / CSR partner
    if selected_industry_partner:
        contact = _recipient_contact(selected_industry_partner)
        if contact["email"] or contact["phone"]:
            partner_subject = f"Potential collaboration opportunity: {title}"
            partner_body = (
                f"A citizen-submitted problem in the {domain} domain may match "
                f"your organization's support areas.\n\nSummary: {summary.get('summary', '')}\n"
                f"Suggested intervention: {summary.get('suggested_intervention', '')}"
            )
            if contact["email"]:
                statuses.append(send_email(contact["email"], partner_subject, partner_body))
            if contact["phone"]:
                statuses.append(send_sms(contact["phone"], f"Potential collaboration match: '{title}'."))

    return statuses
