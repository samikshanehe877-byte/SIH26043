from pydantic import BaseModel


class PriorityResult(BaseModel):
    severity: int
    people_affected: int
    urgency: int
    essential_service: int
    vulnerable_groups: int
    duration: int
    score: float
    priority: str


def calculate_priority(
    severity: int,
    people_affected: int,
    urgency: int,
    essential_service: int,
    vulnerable_groups: int,
    duration: int
) -> PriorityResult:

    score = (
        severity * 3.0 +
        people_affected * 2.5 +
        urgency * 2.0 +
        essential_service * 1.0 +
        vulnerable_groups * 1.0 +
        duration * 0.5
    )

    if score < 25:
        priority = "LOW"
    elif score < 50:
        priority = "MEDIUM"
    elif score < 75:
        priority = "HIGH"
    else:
        priority = "CRITICAL"

    return PriorityResult(
        severity=severity,
        people_affected=people_affected,
        urgency=urgency,
        essential_service=essential_service,
        vulnerable_groups=vulnerable_groups,
        duration=duration,
        score=score,
        priority=priority
    )


if __name__ == "__main__":

    result = calculate_priority(
        severity=9,
        people_affected=8,
        urgency=10,
        essential_service=10,
        vulnerable_groups=9,
        duration=7
    )

    print("\nPRIORITY RESULT")
    print("-----------------------------")
    print(f"Severity:             {result.severity}/10")
    print(f"People affected:      {result.people_affected}/10")
    print(f"Urgency:              {result.urgency}/10")
    print(f"Essential service:    {result.essential_service}/10")
    print(f"Vulnerable groups:    {result.vulnerable_groups}/10")
    print(f"Duration:             {result.duration}/10")
    print(f"Score:                {result.score}/100")
    print(f"Priority:             {result.priority}")