import numpy as np

import problem_storage
from problem_storage import (
    ProblemBase,
    create_problem,
    delete_problem,
    semantic_search,
)


def test_semantic_search_returns_stored_problem_embeddings(tmp_path, monkeypatch):
    monkeypatch.setattr(problem_storage, "DATABASE_PATH", str(tmp_path / "problems.sqlite3"))
    monkeypatch.setattr(problem_storage, "DATABASE_URL", None)
    monkeypatch.setattr(
        problem_storage,
        "get_embedding",
        lambda text: np.asarray(
            [1.0, 0.0]
            if any(word in text for word in ("streetlight", "lighting", "road"))
            else [0.0, 1.0],
            dtype=np.float32,
        ),
    )
    problem_storage.initialize_storage()

    created = create_problem(
        ProblemBase(
            problem_text="A broken streetlight makes the road unsafe.",
            citizen_name="Storage Test Citizen",
        )
    )

    results = semantic_search("Road lighting failure", limit=5)

    assert [result.problem.id for result in results] == [created.id]
    assert results[0].similarity == 1.0

    delete_problem(created.id)
