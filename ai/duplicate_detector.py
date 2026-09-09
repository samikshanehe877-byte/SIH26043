from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


# Load embedding model once
model = SentenceTransformer("all-MiniLM-L6-v2")


def get_embedding(text):
    return model.encode([text])[0]


def check_duplicate(similarity):
    if similarity >= 0.95:
        return "POSSIBLE DUPLICATE"

    elif similarity >= 0.70:
        return "REVIEW FOR DUPLICATE"

    else:
        return "NOT A DUPLICATE"


def find_duplicates(new_problem, existing_problems):

    existing_embeddings = [
        get_embedding(problem)
        for problem in existing_problems
    ]

    new_embedding = get_embedding(new_problem)

    results = []

    for problem, existing_embedding in zip(
        existing_problems,
        existing_embeddings
    ):

        score = cosine_similarity(
            [new_embedding],
            [existing_embedding]
        )[0][0]

        score = float(score)

        # Only keep meaningful matches
        if score >= 0.70:

            results.append({
                "similarity": score,
                "problem": problem,
                "decision": check_duplicate(score)
            })

    # Highest similarity first
    results.sort(
        key=lambda x: x["similarity"],
        reverse=True
    )

    return results