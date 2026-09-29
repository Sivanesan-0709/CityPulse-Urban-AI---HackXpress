from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from app.services.deduplication_service import DeduplicationService
from app.database import db

router = APIRouter(prefix="/api/bandwidth", tags=["Bandwidth & Deduplication"])

@router.get("")
async def get_bandwidth_analytics():
    return DeduplicationService.get_bandwidth_analytics()

@router.get("/route-cache/{route_code}")
async def get_route_cache(route_code: str):
    cache = db.route_event_cache.find_one({"route_code": route_code.upper()})
    if not cache:
        raise HTTPException(status_code=404, detail="Route cache not found")
    
    # Enrich with event names
    active_ids = cache.get("active_event_ids", [])
    events = [db.events.find_one({"id": eid}) for eid in active_ids]
    valid_events = [e for e in events if e is not None]
    
    return {
        "route_code": route_code.upper(),
        "cached_event_count": len(valid_events),
        "active_event_ids": active_ids,
        "cached_events": valid_events
    }

@router.post("/simulate-detection")
async def simulate_detection(payload: Dict[str, Any] = Body(...)):
    bus_id = payload.get("bus_id", "BUS-05")
    route_code = payload.get("route_code", "21G")
    event_id = payload.get("event_id", "PTH-001")
    lat = payload.get("lat", 13.0067)
    lng = payload.get("lng", 80.2023)
    
    return DeduplicationService.simulate_detection(bus_id, route_code, event_id, lat, lng)
