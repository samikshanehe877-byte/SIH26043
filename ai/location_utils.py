"""
location_utils.py

Simple, non-AI location handling utilities. Location is NEVER predicted --
it is only validated/formatted from values supplied by frontend/backend.

Public functions:
    validate_location(latitude, longitude) -> bool
    location_summary(latitude, longitude, district=None, block=None, village=None) -> dict
"""

from typing import Optional


def validate_location(latitude: Optional[float], longitude: Optional[float]) -> bool:
    if latitude is None or longitude is None:
        return False
    try:
        lat = float(latitude)
        lon = float(longitude)
    except (TypeError, ValueError):
        return False
    return -90.0 <= lat <= 90.0 and -180.0 <= lon <= 180.0


def location_summary(
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    district: Optional[str] = None,
    block: Optional[str] = None,
    village: Optional[str] = None,
) -> dict:
    coords_valid = validate_location(latitude, longitude)
    has_data = coords_valid or any([district, block, village])

    return {
        "latitude": latitude if coords_valid else None,
        "longitude": longitude if coords_valid else None,
        "district": district,
        "block": block,
        "village": village,
        "coordinates_valid": coords_valid,
        "has_location_data": has_data,
    }
