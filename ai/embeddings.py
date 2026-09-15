import logging
import os
from functools import lru_cache

import numpy as np
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
EMBEDDING_DIMENSION = int(os.getenv("EMBEDDING_DIMENSION", "384"))


@lru_cache(maxsize=1)
def get_model():
    return SentenceTransformer(EMBEDDING_MODEL_NAME)


def get_embedding(text: str) -> np.ndarray:
    normalized = " ".join(text.split())
    if not normalized:
        raise ValueError("Embedding text cannot be empty")

    vector = np.asarray(
        get_model().encode(
            normalized,
            normalize_embeddings=True,
            show_progress_bar=False,
        ),
        dtype=np.float32,
    ).reshape(-1)
    if vector.shape[0] != EMBEDDING_DIMENSION:
        raise ValueError(
            f"Embedding model returned dimension {vector.shape[0]}; "
            f"expected {EMBEDDING_DIMENSION}"
        )
    return vector
