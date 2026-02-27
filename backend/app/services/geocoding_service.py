
from __future__ import annotations

import logging
from typing import Any, Dict

import httpx

from app.config import settings


logger = logging.getLogger(__name__)

GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"


async def geocode(query: str) -> Dict[str, Any]:
    """
    Resolve a place/address description to lat/lng using Google Geocoding API.

    Returns a dict:
    {
        "success": bool,
        "lat": float | None,
        "lng": float | None,
        "formatted_address": str | None,
        "error": str | None,
    }
    """
    if not query.strip():
        return {
            "success": False,
            "lat": None,
            "lng": None,
            "formatted_address": None,
            "error": "Empty query.",
        }

    if not settings.google_maps_api_key:
        logger.error("GOOGLE_MAPS_API_KEY is not configured.")
        return {
            "success": False,
            "lat": None,
            "lng": None,
            "formatted_address": None,
            "error": "Geocoding service is not configured.",
        }

    # Bias search to the default city configured in settings.
    full_query = f"{query}, {settings.default_city}".strip()

    params = {
        "address": full_query,
        "key": settings.google_maps_api_key,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(GOOGLE_GEOCODE_URL, params=params)
    except httpx.RequestError as exc:
        logger.error("Error calling Google Geocoding API: %s", exc)
        return {
            "success": False,
            "lat": None,
            "lng": None,
            "formatted_address": None,
            "error": "Network error while contacting geocoding service.",
        }

    if response.status_code != 200:
        logger.error(
            "Google Geocoding API returned non-200 status: %s %s",
            response.status_code,
            response.text,
        )
        return {
            "success": False,
            "lat": None,
            "lng": None,
            "formatted_address": None,
            "error": "Geocoding service returned an error.",
        }

    data = response.json()
    status = data.get("status")

    if status != "OK":
        logger.warning(
            "Geocoding failed with status %s for query '%s': %s",
            status,
            full_query,
            data.get("error_message"),
        )
        return {
            "success": False,
            "lat": None,
            "lng": None,
            "formatted_address": None,
            "error": data.get("error_message") or f"Geocoding failed with status {status}.",
        }

    results = data.get("results") or []
    if not results:
        logger.info("No geocoding results for query '%s'.", full_query)
        return {
            "success": False,
            "lat": None,
            "lng": None,
            "formatted_address": None,
            "error": "No results found for that address.",
        }

    top = results[0]
    geometry = top.get("geometry", {})
    location = geometry.get("location") or {}

    lat = location.get("lat")
    lng = location.get("lng")
    formatted_address = top.get("formatted_address")

    if lat is None or lng is None or not formatted_address:
        logger.error("Malformed geocoding response: %s", top)
        return {
            "success": False,
            "lat": None,
            "lng": None,
            "formatted_address": None,
            "error": "Geocoding response was incomplete.",
        }

    return {
        "success": True,
        "lat": float(lat),
        "lng": float(lng),
        "formatted_address": formatted_address,
        "error": None,
    }


