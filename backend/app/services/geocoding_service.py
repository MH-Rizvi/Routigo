
from __future__ import annotations

import logging
from typing import Any, Dict

import httpx

from app.config import settings


logger = logging.getLogger(__name__)

GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"

DEFAULT_CITY_LAT: float | None = None
DEFAULT_CITY_LNG: float | None = None

async def _get_default_city_coords() -> tuple[float | None, float | None]:
    global DEFAULT_CITY_LAT, DEFAULT_CITY_LNG
    if DEFAULT_CITY_LAT is not None and DEFAULT_CITY_LNG is not None:
        return DEFAULT_CITY_LAT, DEFAULT_CITY_LNG
    
    if not settings.google_maps_api_key or not settings.default_city:
        return None, None
        
    params = {
        "address": settings.default_city,
        "key": settings.google_maps_api_key,
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(GOOGLE_GEOCODE_URL, params=params)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("status") == "OK" and data.get("results"):
                    loc = data["results"][0].get("geometry", {}).get("location", {})
                    if "lat" in loc and "lng" in loc:
                        DEFAULT_CITY_LAT = float(loc["lat"])
                        DEFAULT_CITY_LNG = float(loc["lng"])
                        logger.info("Initialized DEFAULT_CITY_LAT=%s, DEFAULT_CITY_LNG=%s", DEFAULT_CITY_LAT, DEFAULT_CITY_LNG)
    except Exception as exc:
        logger.error("Error geocoding DEFAULT_CITY: %s", exc)
        
    return DEFAULT_CITY_LAT, DEFAULT_CITY_LNG


async def geocode(query: str) -> Dict[str, Any]:
    """
    Resolve a place/address description to lat/lng using Google Geocoding API.

    Returns a dict:
    {
        "success": bool,
        "lat": float | None,
        "lng": float | None,
        "formatted_address": str | None,
        "confidence": str,  # "high" or "low"
        "error": str | None,
    }
    """
    if not query.strip():
        return {
            "success": False,
            "lat": None,
            "lng": None,
            "formatted_address": None,
            "confidence": "low",
            "error": "Empty query.",
        }

    if not settings.google_maps_api_key:
        logger.error("GOOGLE_MAPS_API_KEY is not configured.")
        return {
            "success": False,
            "lat": None,
            "lng": None,
            "formatted_address": None,
            "confidence": "low",
            "error": "Geocoding service is not configured.",
        }

    # 1. Init default city coords lazily
    lat_center, lng_center = await _get_default_city_coords()

    # Helper function to fire the HTTP request and parse Google's format
    async def _fetch_geocode(search_query: str) -> Dict[str, Any] | None:
        params = {
            "address": search_query,
            "key": settings.google_maps_api_key,
            "region": "us",
        }
        if lat_center is not None and lng_center is not None:
            params["location"] = f"{lat_center},{lng_center}"
            params["radius"] = "50000"
            
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(GOOGLE_GEOCODE_URL, params=params)
                if resp.status_code != 200:
                    return None
                return resp.json()
        except:
            return None

    # Extract city and state from DEFAULT_CITY
    default_parts = [p.strip() for p in settings.default_city.split(",")] if settings.default_city else []
    default_city_name = default_parts[0] if default_parts else ""
    default_state = default_parts[-1] if len(default_parts) > 1 else ""

    # 2. Prepare search query
    search_query = query.strip()
    if "," not in search_query:
        search_query = f"{search_query}, {settings.default_city}"

    # First attempt
    data = await _fetch_geocode(search_query)
    results = data.get("results", []) if data and data.get("status") == "OK" else []
    
    top_result = results[0] if results else None
    confidence = "high"

    # 3 & 4. Confidence check and Retry
    if top_result:
        fmt_addr = top_result.get("formatted_address", "")
        
        is_missing_state = default_state and default_state not in fmt_addr
        is_missing_city = default_city_name and default_city_name.lower() not in fmt_addr.lower()
        
        if is_missing_state or is_missing_city:
            confidence = "low"
            # Retry with ", {DEFAULT_CITY}" appended
            retry_query = f"{query.strip()}, {settings.default_city}"
            if search_query != retry_query:
                missing = "city" if is_missing_city else "state"
                logger.info("Result '%s' missing %s from DEFAULT_CITY. Retrying with '%s'", fmt_addr, missing, retry_query)
                data2 = await _fetch_geocode(retry_query)
                results2 = data2.get("results", []) if data2 and data2.get("status") == "OK" else []
                if results2:
                    top_result = results2[0]

    if not top_result:
        return {
            "success": False,
            "lat": None,
            "lng": None,
            "formatted_address": None,
            "confidence": "low",
            "error": "No results found.",
        }

    geometry = top_result.get("geometry", {})
    location = geometry.get("location") or {}

    lat = location.get("lat")
    lng = location.get("lng")
    formatted_address = top_result.get("formatted_address")

    if lat is None or lng is None or not formatted_address:
        return {
            "success": False,
            "lat": None,
            "lng": None,
            "formatted_address": None,
            "confidence": "low",
            "error": "Geocoding response was incomplete.",
        }

    return {
        "success": True,
        "lat": float(lat),
        "lng": float(lng),
        "formatted_address": formatted_address,
        "confidence": confidence,
        "error": None,
    }
