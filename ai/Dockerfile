# The AI/problem service. Built CPU-only on purpose: the default torch wheel pulls in CUDA
# libraries worth several gigabytes that never get used on a CPU host, so it is installed from
# PyTorch's CPU index before the rest of requirements.txt.
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    # Keep the model cache inside the image rather than in a home directory that may not be writable.
    HF_HOME=/opt/models \
    SENTENCE_TRANSFORMERS_HOME=/opt/models

WORKDIR /app

# libpq for psycopg, curl for the container healthcheck.
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir -r requirements.txt

# Bake the embedding model into the image. Without this the first problem submission pays a ~90MB
# download, and a host with restricted egress would fail duplicate detection entirely.
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

COPY . .

# The SQLite database and uploaded evidence must live on a mounted disk. Without one, every deploy
# starts from an empty database and previously uploaded files 404.
ENV PROBLEM_DB_PATH=/data/problems.sqlite3 \
    UPLOAD_DIR=/data/uploads
RUN mkdir -p /data/uploads && useradd -m -u 10001 appuser && chown -R appuser:appuser /app /data
USER appuser

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s \
    CMD curl -fsS http://localhost:${PORT:-8000}/health || exit 1

# Hosts inject $PORT; default to 8000 for a plain `docker run`.
CMD ["sh", "-c", "uvicorn api:app --host 0.0.0.0 --port ${PORT:-8000}"]
