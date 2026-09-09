import json
from pydantic import BaseModel

from gemini_utils import generate_text


class ClassificationResult(BaseModel):
    domain: str
    subdomain: str
    confidence: float
    reason: str


with open("data/taxonomy.json", "r", encoding="utf-8") as file:
    taxonomy = json.load(file)


def classify_problem(problem_text: str) -> ClassificationResult:

    taxonomy_text = json.dumps(taxonomy, indent=2, ensure_ascii=False)

    prompt = f"""
You are an AI system for a government platform that collects
societal problems submitted by citizens.

Classify the citizen's problem into exactly one domain
and one subdomain from the provided taxonomy.

Do not create new categories.

Also provide:
- confidence: a number between 0 and 1
- reason: a short explanation

Return ONLY a JSON object with keys: domain, subdomain, confidence, reason.
No markdown, no preamble.

TAXONOMY:
{taxonomy_text}

CITIZEN PROBLEM:
{problem_text}
"""

    text = generate_text(prompt)
    result = ClassificationResult.model_validate_json(text)

    if result.domain not in taxonomy:
        raise ValueError(f"Invalid domain returned by AI: {result.domain}")

    if result.subdomain not in taxonomy[result.domain]["subdomains"]:
        raise ValueError(f"Invalid subdomain returned by AI: {result.subdomain}")

    if not 0 <= result.confidence <= 1:
        raise ValueError(f"Invalid confidence: {result.confidence}")

    return result


def classify_with_review(problem_text: str):
    result = classify_problem(problem_text)
    status = "AUTO_ACCEPTED" if result.confidence >= 0.80 else "NEEDS_HUMAN_REVIEW"
    return result, status


if __name__ == "__main__":
    problem = """
    Our village has a government school but there are not enough
    teachers. Students often sit without classes because teachers
    are unavailable.
    """
    result, status = classify_with_review(problem)
    print("\nCLASSIFICATION RESULT")
    print("-----------------------------")
    print(f"Domain:      {result.domain}")
    print(f"Subdomain:   {result.subdomain}")
    print(f"Confidence:  {result.confidence}")
    print(f"Reason:      {result.reason}")
    print(f"Status:      {status}")
