# SIH26043 — AI Module

A digital platform module to crowdsource societal challenges and route them
to relevant universities and industry/CSR partners for collaborative
problem solving.

## What's in this zip

This zip contains the **rebuilt/fixed AI-facing files** for the project:

```
SIH26043_AI_module/
├── data/
│   ├── universities.json       (demo dataset — see note below)
│   └── industry_partners.json  (demo dataset — see note below)
├── gemini_utils.py              (NEW — shared Gemini Interactions API helper)
├── classifier.py                 (rewritten to use gemini_utils, fixes missing input= bug)
├── priority_ai.py                (rewritten to use gemini_utils, fixes missing input= bug)
├── problem_summary.py           (rewritten to use gemini_utils)
├── image_analyzer.py            (rewritten to use gemini_utils)
├── university_matcher.py        (hybrid structured + semantic matching)
├── industry_matcher.py          (hybrid structured + semantic matching)
├── location_utils.py            (non-AI location validation/formatting)
├── ai_pipeline.py                (orchestrator, with per-stage debug error capture)
├── app.py                        (Streamlit UI with debug mode toggle + Notifications tab)
├── api.py                        (NEW — FastAPI wrapper for a separate frontend)
├── frontend_adapter.py           (NEW — reshapes output to match the frontend's TS types)
├── department_matcher.py         (NEW — ranks a university's own departments for a problem)
├── notification_service.py      (NEW — email/SMS fan-out, dry-run by default)
├── test_ai_pipeline.py           (pytest sanity tests)
├── test_notifications.py        (NEW — dry-run tests for notifications + department matching)
├── NOTIFICATIONS.md              (NEW — setup guide for real email/SMS)
├── requirements.txt
├── .env.example
└── README.md (this file)
```

**NOT included** — copy these from your existing working project as-is,
they were not touched: `priority.py`, `duplicate_detector.py`,
`validate_taxonomy.py`, `test_classifier.py`, `data/taxonomy.json`,
`.gitignore`, `venv/`.

## Why these files were rewritten

During integration we hit three real bugs:

1. `classifier.py` and `priority_ai.py` were missing the `input=prompt`
   argument in `client.interactions.create(...)` after a manual model-name
   edit — the Gemini call was firing with no actual prompt.
2. Gemini sometimes wraps JSON responses in ` ```json ... ``` ` fences,
   which broke `model_validate_json()` / `json.loads()` calls that expected
   raw JSON.
3. `problem_summary.py` and `image_analyzer.py` were using the deprecated
   `client.models.generate_content(...)` method, which 404s — Google has
   moved fully to the Interactions API (`client.interactions.create(...)`).

`gemini_utils.py` centralizes the correct call pattern (with fence-stripping
built in) so this class of bug can't recur — every Gemini-calling file now
routes through `generate_text()` or `generate_from_image()`.

## Installation

```bash
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your key:

```
GEMINI_API_KEY=your_key_here
GEMINI_TEXT_MODEL=gemini-3.5-flash-lite
GEMINI_VISION_MODEL=gemini-3.5-flash-lite
```

`gemini-3.5-flash-lite` is used by default instead of `gemini-3.6-flash`
because the free tier gives it a higher requests-per-minute allowance
(15 RPM vs 5 RPM at time of writing). **Check your live quota in Google
AI Studio before your actual demo** — free-tier limits change and a
mid-demo 429 would be bad. Enabling billing on your Google Cloud project
removes the free-tier cap without necessarily incurring charges unless
you exceed the free quota.

## Running the App

```bash
streamlit run app.py
```

Toggle "🔧 Debug mode" in the sidebar to see per-stage pipeline errors
(from `result["_debug_errors"]`) directly in the UI instead of only in
the terminal — useful while iterating.

## Running Tests

```bash
pytest test_ai_pipeline.py -v
```

Tests check for sensible ranking behavior (e.g. a road-damage problem
should surface civil/infrastructure institutions above healthcare ones),
not exact cosine similarity scores.

## Replacing Demo Data

`data/universities.json` and `data/industry_partners.json` contain
**placeholder/demo data**. University *names* are real, publicly known
Jharkhand HEIs, but `expertise`, `research_areas`, and `capabilities`
fields are illustrative only and have **not been verified** against
official sources. Every record is tagged `"data_status": "demo"`.
Industry/CSR partners are entirely generic placeholders, not real
named companies.

Before production deployment:
1. Verify each institution's actual departments/research areas/capabilities.
2. Update `data_status` to `"verified"` once confirmed.
3. Replace generic demo industry partners with actual named partnerships.

The matcher code does not need to change — it reads whatever is in the
JSON files.

## Future Backend Integration

- All modules are independently importable and side-effect-free at import time.
- `ai_pipeline.analyze_problem()` is the single entry point, now wrapped
  behind a FastAPI endpoint in **`api.py`** (`POST /analyze`, `POST /notify`,
  `GET /health`) — run with `uvicorn api:app --reload --port 8000`. This is
  what a separate frontend (React/HTML/etc.) should call; `app.py` remains
  the operator-facing Streamlit demo.
- `existing_problems` for duplicate detection should be supplied by the
  backend (e.g. a DB query) rather than hardcoded.
- Location (`latitude`, `longitude`, `district`, `block`, `village`) is
  expected to come from the frontend/backend — this module never infers it.

## Frontend Compatibility Layer

The separate Next.js frontend (built by a teammate) expects a different
data shape than this module's raw output — different ID types, score
scales, category/status vocabularies, and a "department" concept this
module didn't originally have. `frontend_adapter.py` reshapes output to
match exactly, and `department_matcher.py` ranks a university's own
departments (derived from which departments have mentors on file in
`data/mentors.json`) for a given problem, so `assignedDepartmentId`/
`assignedDepartmentName` are real rather than placeholders. Call
`POST /analyze-for-frontend` (in `api.py`) to get pre-shaped output;
`GET /departments/{university_id}` lists a university's departments on
their own. See the "OPEN QUESTIONS" comment at the bottom of
`frontend_adapter.py` for what still needs your team's input (exact
category taxonomy, a single canonical status enum across the project).

## Notification Fan-Out (Email + SMS)

`notification_service.py` sends email/SMS to the citizen, assigned mentor,
university, and industry/CSR partner once a submission is triaged and
assigned. It's wired into `app.py`'s **Notifications** tab (manual "Send
notifications now" button) and into `api.py`'s `POST /notify`. No
provider was configured, so it runs in **dry-run mode by default** — every
send is logged and reported as if it succeeded, without needing an SMTP/SMS
account to demo. See **`NOTIFICATIONS.md`** for how to switch on real
sending (Gmail SMTP + Twilio or an India HTTP gateway like MSG91/Fast2SMS).

## Multilingual Input/Output (Beta)

Citizens can submit problems in Hindi, Nagpuri/Sadri, Santali, Mundari, Ho,
or Kurukh (Oraon), selected from a dropdown above the problem text box.
`translation_utils.py` calls Gemini to translate the input to English before
it enters the pipeline (classifier, matchers, etc. are all English-only),
and translates the citizen-facing summary back into their language for
display.

**Translation quality is NOT verified for the tribal languages** (Santali,
Mundari, Ho, Kurukh) — these are low-resource languages with comparatively
little training data available to any LLM. Nagpuri/Sadri and Hindi are
closer to mainstream Indo-Aryan languages and likely (but not guaranteed)
to translate better. The app shows the translated English text back to the
operator in a "🌐 Translation used for analysis" panel so this can be
sanity-checked per submission, but before real deployment every supported
language should be reviewed by a native speaker — both directions
(local → English and English → local).

## Files to Manually Verify Before the SIH Demo

1. `data/universities.json` — demo institutional data, disclose if asked.
2. `data/industry_partners.json` — entirely demo/generic partners.
3. `.env` — `GEMINI_API_KEY` set, not committed.
4. Live Gemini API quota in Google AI Studio — confirm it can survive a
   live demo (each "Run AI Analysis" click fires 3–4 Gemini calls, or
   5–6 if a non-English language is selected, due to translation).
5. `ai_pipeline.py`'s `.dict()` handling — confirm it matches your actual
   `priority.py` / `duplicate_detector.py` return types (Pydantic model vs
   plain dict) if those files differ from what was originally described.
6. `data/mentors.json` — demo faculty data, fictional names, disclose if asked.
7. Multilingual translations (see section above) — spot-check with a
   native speaker if you plan to demo a non-English submission live.
