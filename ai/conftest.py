"""Test-wide safety net: the suite must never touch a real database or a real storage bucket.

Every test module isolates itself by pointing problem_storage.DATABASE_PATH at a fresh SQLite file
under tmp_path. That alone stopped being enough once problem_storage gained a PostgreSQL backend:
_connection() consults PROBLEM_DB_URL first, so with that variable present in the environment (via
ai/.env, which several modules load on import) the monkeypatched path was ignored and every test
wrote into the shared database instead.

Forcing it off here, for every test, keeps that impossible regardless of how the developer's
environment happens to be configured. A test that genuinely wants PostgreSQL has to opt in by
setting problem_storage.PROBLEM_DB_URL itself.
"""

import pytest

import object_store
import problem_storage


@pytest.fixture(autouse=True)
def never_use_the_real_database(monkeypatch):
    monkeypatch.setattr(problem_storage, "PROBLEM_DB_URL", None)


@pytest.fixture(autouse=True)
def never_use_the_real_bucket(monkeypatch):
    """The same hazard as the database, for uploaded files.

    Attachment tests isolate themselves by pointing api.UPLOAD_DIR at tmp_path, which stopped being
    enough once uploads could go to object storage: _store_attachment checks the bucket first, so a
    developer with R2 configured in ai/.env had the suite writing real objects into the shared
    bucket and then asserting about an empty local directory.
    """
    monkeypatch.setattr(object_store, "R2_ENDPOINT", None)
    monkeypatch.setattr(object_store, "_client", None)
