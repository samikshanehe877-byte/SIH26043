from pydantic import BaseModel
from priority import calculate_priority
from gemini_utils import generate_text


class PriorityFactors(BaseModel):
    severity: int
    people_affected: int
    urgency: int
    essential_service: int
    vulnerable_groups: int
    duration: int


def analyze_priority(problem_text: str) -> PriorityFactors:

    prompt = f"""
You are an AI system for a government platform that analyzes
societal problems submitted by citizens.

Read the citizen's problem and rate these six factors from 0 to 10:

1. severity - How serious or harmful is the problem?
2. people_affected - How many people are likely to be affected?
3. urgency - How urgently does the problem need attention?
4. essential_service - Does the problem affect an essential service such as
   healthcare, drinking water, sanitation, electricity, education,
   or emergency services?
5. vulnerable_groups - Does the problem particularly affect children, elderly
   people, pregnant women, persons with disabilities, or other vulnerable groups?
6. duration - How long has the problem existed or how persistent is it?

Use only information provided in the problem. Do not invent specific facts.

Return ONLY a JSON object with keys: severity, people_affected, urgency,
essential_service, vulnerable_groups, duration -- all integers 0-10.
No markdown, no preamble.

CITIZEN PROBLEM:
{problem_text}
"""

    text = generate_text(prompt)
    result = PriorityFactors.model_validate_json(text)

    for field_name, value in result.model_dump().items():
        if not 0 <= value <= 10:
            raise ValueError(f"Invalid {field_name}: {value}. Must be 0-10.")

    return result


if __name__ == "__main__":
    problem = """
    Our village hospital has no doctor.
    Pregnant women and emergency patients have to travel
    40 km to the nearest hospital.
    This problem has existed for several months.
    """
    factors = analyze_priority(problem)
    result = calculate_priority(
        severity=factors.severity,
        people_affected=factors.people_affected,
        urgency=factors.urgency,
        essential_service=factors.essential_service,
        vulnerable_groups=factors.vulnerable_groups,
        duration=factors.duration,
    )
    print("\nAI PRIORITY RESULT")
    print("-----------------------------")
    print(f"Severity:             {result.severity}/10")
    print(f"People affected:      {result.people_affected}/10")
    print(f"Urgency:              {result.urgency}/10")
    print(f"Essential service:    {result.essential_service}/10")
    print(f"Vulnerable groups:    {result.vulnerable_groups}/10")
    print(f"Duration:             {result.duration}/10")
    print(f"Score:                {result.score}/100")
    print(f"Priority:             {result.priority}")
