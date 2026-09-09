# Notification Fan-Out (Email + SMS) — Setup Guide

## What was added

- `notification_service.py` — `send_email()`, `send_sms()`, and
  `notify_fanout()` (sends to citizen, mentor, university, and industry
  partner in one call).
- A "📨 Contact info" box in `app.py`'s submission form, and a new
  **Notifications** tab (last tab) with a "Send notifications now" button.
- `api.py` — `POST /notify` endpoint, for a separate frontend.
- Demo `contact_email` / `contact_phone` fields added to
  `data/universities.json`, `data/mentors.json`, `data/industry_partners.json`
  (all fake — `outreach.<id>@example.edu` style — **replace before real use**).

## Assumption made (no provider was specified)

No SMS/email provider was picked before this was built, so **everything
defaults to dry-run/mock mode**: nothing is actually sent, but every
send is logged and returns a status dict exactly as if it had gone out —
so you can demo the full flow (see the ✅/🟡/❌ icons in the Notifications
tab) without signing up for anything. Fill in `.env` when you're ready to
send for real; nothing else needs to change.

## To actually send email

Fill in `.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youraddress@gmail.com
SMTP_PASSWORD=your_16_char_app_password   # NOT your normal Gmail password
EMAIL_FROM=youraddress@gmail.com
```
Gmail needs an **App Password** (Google Account → Security → 2-Step
Verification → App Passwords), not your login password. Any other SMTP
provider (Outlook, a college mail server, SendGrid's SMTP relay, etc.)
works the same way — just change the host/port.

## To actually send SMS

Pick one and set `SMS_PROVIDER` accordingly in `.env`:

**Twilio** (global, well-documented, free trial credit):
```
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+1...
```
Also run `pip install twilio`.

**MSG91 / Fast2SMS / any India HTTP gateway**:
```
SMS_PROVIDER=http
SMS_HTTP_URL=https://provider.example/api/send
SMS_HTTP_API_KEY=...
SMS_HTTP_SENDER_ID=...
```
`send_sms()` in `notification_service.py` posts a generic
`{api_key, sender_id, to, message}` JSON body — every India SMS API's
exact field names differ, so check your chosen provider's docs and
adjust that one function if needed.

## Known gaps to fix before a real demo/deployment

1. Demo contact fields are fake — real emails/phone numbers need to
   replace them in the three JSON files, same as the existing
   `data_status: "demo"` warning for the rest of that data.
2. There's no retry/queue — a failed send is reported once, not retried.
   Fine for a hackathon demo; add a queue (Celery/RQ) before production.
3. `notify_fanout()` is only triggered by a manual button in `app.py` or
   an explicit `POST /notify` call — it does not run automatically inside
   `ai_pipeline.analyze_problem()`, since assignment (which university/
   mentor) is currently an interactive human choice, not automatic.
