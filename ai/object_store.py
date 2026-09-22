"""
object_store.py

Where uploaded evidence and workspace attachments actually live.

Local disk is fine for one machine, but the problem records moved to a shared database while the
files did not: a record written on one laptop hands every other machine a link to a file that only
ever existed on the first one, which is exactly how six evidence attachments became permanently
unviewable. Setting R2_ENDPOINT puts the bytes somewhere every deployment can reach.

Disk remains the default and the fallback, so tests and offline work need no configuration and no
network. The stored URL is `/uploads/<id>.<ext>` either way, so existing records keep working and
nothing in the frontend has to change -- only where the API looks when it is asked for that path.

The bucket is deliberately private. These are citizens' evidence files, often photographs of their
homes and neighbourhoods; the API streams them to signed-in users rather than handing out public
URLs that would work for anyone who ever saw one.
"""

import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)

R2_ENDPOINT = os.getenv("R2_ENDPOINT")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET = os.getenv("R2_BUCKET")

_client = None


def enabled() -> bool:
    """True when object storage is configured; False means files are read and written on disk."""
    return bool(R2_ENDPOINT and R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY and R2_BUCKET)


def _get_client():
    """The shared S3 client, built once. Returns None if boto3 is missing or the config is partial."""
    global _client
    if _client is None and enabled():
        try:
            import boto3
            _client = boto3.client(
                "s3",
                endpoint_url=R2_ENDPOINT,
                aws_access_key_id=R2_ACCESS_KEY_ID,
                aws_secret_access_key=R2_SECRET_ACCESS_KEY,
                region_name="auto",
            )
        except Exception as error:  # noqa: BLE001 - a missing SDK must not take the API down
            logger.error("Object storage unavailable, falling back to local disk: %s", error)
            _client = None
    return _client


def put(key: str, content: bytes, content_type: str) -> bool:
    """Store one object. Returns False if it could not be written, so the caller can fall back."""
    client = _get_client()
    if client is None:
        return False
    try:
        client.put_object(Bucket=R2_BUCKET, Key=key, Body=content, ContentType=content_type or "application/octet-stream")
        return True
    except Exception as error:  # noqa: BLE001
        logger.error("Could not store %s in object storage: %s", key, error)
        return False


def get(key: str) -> Optional[bytes]:
    """The object's bytes, or None when it is absent or unreadable."""
    client = _get_client()
    if client is None:
        return None
    try:
        return client.get_object(Bucket=R2_BUCKET, Key=key)["Body"].read()
    except Exception:  # noqa: BLE001 - a missing object is an ordinary outcome, not an error
        return None


def delete(key: str) -> None:
    """Remove one object. A failure is logged rather than raised: the record is already gone, and
    an orphaned object costs storage while a raised error would fail a delete that did succeed."""
    client = _get_client()
    if client is None:
        return
    try:
        client.delete_object(Bucket=R2_BUCKET, Key=key)
    except Exception as error:  # noqa: BLE001
        logger.warning("Could not remove %s from object storage: %s", key, error)


def exists(key: str) -> bool:
    client = _get_client()
    if client is None:
        return False
    try:
        client.head_object(Bucket=R2_BUCKET, Key=key)
        return True
    except Exception:  # noqa: BLE001
        return False
