from classifier import classify_problem


ambiguous_problems = [
    "Our village has no water and farmers are unable to grow crops.",

    "The road to our village is broken and ambulances cannot reach the hospital.",

    "People are getting sick because the water from the village handpump is contaminated.",

    "There is electricity in our village but power cuts happen almost every day.",

    "Children are dropping out of school because their families cannot afford transportation.",

    "The government hospital has medicines but there are no doctors available.",

    "During monsoon, dirty water collects on the streets and creates a bad smell.",

    "Farmers have water available but do not have proper irrigation facilities for their fields.",

    "People submitted applications for government certificates but nobody tells them the status.",

    "An elderly person cannot use the government website because the website is difficult to navigate."
]


for i, problem in enumerate(ambiguous_problems, start=1):

    print("\n" + "=" * 60)
    print(f"TEST {i}")
    print("=" * 60)

    print("Problem:")
    print(problem)

    try:
        result = classify_problem(problem)

        print("\nAI Classification:")
        print(f"Domain:     {result.domain}")
        print(f"Subdomain:  {result.subdomain}")
        print(f"Confidence: {result.confidence}")
        print(f"Reason:     {result.reason}")

    except Exception as error:
        print("\nERROR:")
        print(error)