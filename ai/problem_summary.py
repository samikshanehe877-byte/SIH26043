"""
problem_summary.py
Generates a structured AI summary of a submitted problem using Gemini.
Falls back gracefully if Gemini is unavailable.
"""

import json
import logging

from gemini_utils import generate_text

logger = logging.getLogger(__name__)

FALLBACK_RESULT = {
    "title": "Summary unavailable",
    "summary": "Automated summary could not be generated at this time.",
    "key_issues": [],
    "affected_groups": [],
    "suggested_intervention": "unknown",
    "source": "fallback",
}

PROMPT_TEMPLATE = """You are analyzing a societal problem statement submitted to a crowdsourcing platform.

Problem statement:
\"\"\"{problem_text}\"\"\"

Return ONLY a JSON object (no markdown, no preamble) with exactly these fields:
{{
  "title": "short descriptive title (max 12 words)",
  "summary": "1-2 sentence plain-language summary",
  "key_issues": ["list", "of", "concrete issues explicitly stated or clearly implied"],
  "affected_groups": ["list", "of", "groups explicitly stated or clearly implied - do NOT invent groups not supported by the text"],
  "suggested_intervention": "one sentence, conservative, grounded only in the stated problem"
}}

Rules:
- Do not invent facts, statistics, or affected groups not supported by the text.
- If a field cannot be determined, use an empty list or the string "unknown".
"""


def generate_problem_summary(problem_text: str) -> dict:
    if not problem_text or not problem_text.strip():
        return dict(FALLBACK_RESULT)

    try:
        text = generate_text(PROMPT_TEMPLATE.format(problem_text=problem_text))
        parsed = json.loads(text)
        parsed.setdefault("key_issues", [])
        parsed.setdefault("affected_groups", [])
        parsed.setdefault("suggested_intervention", "unknown")
        parsed["source"] = "gemini"
        return parsed
    except Exception as e:
        logger.warning("Gemini summary generation failed, using fallback: %s", e)
        return dict(FALLBACK_RESULT)
