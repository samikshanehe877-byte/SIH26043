"""
gemini_utils.py

Single shared helper for all Gemini Interactions API calls in this project.
Centralizing this avoids the bugs we kept hitting (missing `input=`,
un-stripped markdown fences, stale model names scattered across files).

Connects to: classifier.py, priority_ai.py, problem_summary.py, image_analyzer.py
"""

import os
import logging
from dotenv import load_dotenv
from google import genai

load_dotenv()
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DEFAULT_TEXT_MODEL = os.getenv("GEMINI_TEXT_MODEL", "gemini-3.5-flash-lite")
DEFAULT_VISION_MODEL = os.getenv("GEMINI_VISION_MODEL", "gemini-3.5-flash-lite")

_client = None


def get_client():
    """Returns a shared Gemini client, or None if no API key is configured."""
    global _client
    if _client is None and GEMINI_API_KEY:
        try:
            _client = genai.Client(api_key=GEMINI_API_KEY)
        except Exception as e:
            logger.warning("Gemini client init failed: %s", e)
            _client = None
    return _client


def strip_json_fence(text: str) -> str:
    """Removes ```json ... ``` or ``` ... ``` wrapping Gemini sometimes adds."""
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
        text = text.strip()
    return text


def generate_text(prompt: str, model: str = None) -> str:
    """
    Runs a single text-in/text-out Gemini call via the Interactions API
    and returns the cleaned (fence-stripped) output text.

    Raises on failure -- callers should wrap in their own try/except
    (or rely on ai_pipeline.py's _safe_call) if they want graceful fallback.
    """
    client = get_client()
    if client is None:
        raise RuntimeError("Gemini client not configured (missing GEMINI_API_KEY).")

    interaction = client.interactions.create(
        model=model or DEFAULT_TEXT_MODEL,
        input=prompt,
    )
    return strip_json_fence(interaction.output_text)


def generate_from_image(prompt: str, image_b64: str, mime_type: str, model: str = None) -> str:
    """
    Multimodal Gemini call: text prompt + base64 image.
    Returns cleaned output text.
    """
    client = get_client()
    if client is None:
        raise RuntimeError("Gemini client not configured (missing GEMINI_API_KEY).")

    interaction = client.interactions.create(
        model=model or DEFAULT_VISION_MODEL,
        input=[
            {"type": "text", "text": prompt},
            {"type": "image", "data": image_b64, "mime_type": mime_type},
        ],
    )
    return strip_json_fence(interaction.output_text)
