"""
image_analyzer.py
Image-evidence analysis via Gemini multimodal, with safe fallback.
"""

import base64
import json
import logging
import mimetypes
import os

from gemini_utils import generate_from_image

logger = logging.getLogger(__name__)

UNAVAILABLE_RESULT = {
    "detected_issue": "Image analysis unavailable",
    "confidence": 0.0,
    "observations": [],
    "supports_problem": False,
    "source": "fallback",
}

PROMPT_TEMPLATE = """You are reviewing a photo submitted as evidence for a civic/societal problem report.

{context}

Describe only what is visibly evident in the image. Return ONLY a JSON object:
{{
  "detected_issue": "short description of the visible issue, or 'no clear issue visible'",
  "confidence": 0.0-1.0,
  "observations": ["list of concrete visible observations"],
  "supports_problem": true/false
}}

Rules:
- Do not guess facts that are not visible in the image.
- If the image is unclear or unrelated, say so honestly with low confidence.
"""


def analyze_image(image_path: str, problem_text: str = None) -> dict:
    if not image_path or not os.path.exists(image_path):
        logger.warning("Image path missing or invalid: %s", image_path)
        return dict(UNAVAILABLE_RESULT)

    try:
        mime_type, _ = mimetypes.guess_type(image_path)
        mime_type = mime_type or "image/jpeg"

        with open(image_path, "rb") as f:
            image_b64 = base64.b64encode(f.read()).decode("utf-8")

        context = f'Reported problem text: "{problem_text}"' if problem_text else "No accompanying problem text provided."
        prompt = PROMPT_TEMPLATE.format(context=context)

        text = generate_from_image(prompt, image_b64, mime_type)
        parsed = json.loads(text)

        parsed.setdefault("observations", [])
        parsed.setdefault("confidence", 0.0)
        parsed.setdefault("supports_problem", False)
        parsed["source"] = "gemini"
        return parsed

    except Exception as e:
        logger.warning("Image analysis failed, returning fallback: %s", e)
        return dict(UNAVAILABLE_RESULT)
