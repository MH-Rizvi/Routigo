
from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List

from langchain.tools import tool  # pyright: ignore[reportMissingImports]

from app.database import SessionLocal  # pyright: ignore[reportMissingImports]
from app import models
from app.services import geocoding_service, vector_service
from app.services import trips_service


logger = logging.getLogger(__name__)


@tool("geocode_stop")
def geocode_stop_tool(query: str) -> Dict[str, Any]:
    """
    Resolves a place name, street name, or address description to a geocoded stop.

    Input: free-text description of a stop.
    Output: { success, lat, lng, formatted_address, error }.
    """
    # geocoding_service.geocode is async; bridge it into this sync tool
    # using the existing event loop if present.
    async def _run() -> Dict[str, Any]:
        return await geocoding_service.geocode(query)

    loop = asyncio.get_event_loop()
    return loop.run_until_complete(_run())


@tool("search_saved_stops")
def search_saved_stops_tool(query: str) -> List[Dict[str, Any]]:
    """
    Searches previously saved stops using semantic similarity.

    Input: description of the stop (string).
    Output: list of similar saved stops with similarity scores.
    """
    return vector_service.search_stops(query, top_k=3)


@tool("search_saved_trips")
def search_saved_trips_tool(query: str) -> List[Dict[str, Any]]:
    """
    Searches saved trips using semantic similarity.

    Input: description of the trip (string).
    Output: list of similar saved trips with similarity scores.
    """
    return vector_service.search_trips(query, top_k=3)


@tool("get_trip_by_id")
def get_trip_by_id_tool(trip_id_str: str) -> Dict[str, Any]:
    """
    Fetches the full details of a saved trip including all stops in order.

    Input: trip ID as a string that can be parsed to an integer.
    Output: full trip object with ordered stops, or an error message.
    """
    try:
        trip_id = int(trip_id_str)
    except ValueError:
        return {"error": "trip_id must be an integer string."}

    async def _run() -> Dict[str, Any]:
        db = SessionLocal()
        try:
            trip = await trips_service.get_trip(db, trip_id)
            if not trip:
                return {"error": f"Trip with id {trip_id} not found."}

            # Serialize trip and stops to simple dicts
            stops = [
                {
                    "id": stop.id,
                    "position": stop.position,
                    "label": stop.label,
                    "resolved": stop.resolved,
                    "lat": stop.lat,
                    "lng": stop.lng,
                    "note": stop.note,
                }
                for stop in trip.stops
            ]
            return {
                "id": trip.id,
                "name": trip.name,
                "notes": trip.notes,
                "stops": stops,
            }
        finally:
            db.close()

    loop = asyncio.get_event_loop()
    return loop.run_until_complete(_run())


@tool("get_recent_history")
def get_recent_history_tool(days_str: str = "7") -> List[Dict[str, Any]]:
    """
    Returns recent trip launch history for context.

    Input: number of days to look back, as a string (default "7").
    Output: list of recent launches with trip names and dates.
    """
    try:
        days = int(days_str)
    except ValueError:
        days = 7

    cutoff = datetime.utcnow() - timedelta(days=days)

    db = SessionLocal()
    try:
        histories: List[models.TripHistory] = (
            db.query(models.TripHistory)
            .filter(models.TripHistory.launched_at >= cutoff)
            .order_by(models.TripHistory.launched_at.desc())
            .all()
        )
        return [
            {
                "id": h.id,
                "trip_id": h.trip_id,
                "trip_name": h.trip_name,
                "launched_at": h.launched_at.isoformat() if h.launched_at else None,
            }
            for h in histories
        ]
    finally:
        db.close()


