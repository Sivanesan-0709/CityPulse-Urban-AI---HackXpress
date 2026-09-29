from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.database import db

router = APIRouter(prefix="/api/events", tags=["Urban Events"])

@router.get("")
async def get_all_events(
    category: Optional[str] = None,
    type: Optional[str] = None,
    severity: Optional[str] = None,
    repair_status: Optional[str] = None,
    critical_only: Optional[bool] = None
):
    query = {}
    if category:
        query["category"] = category.upper()
    if type:
        query["type"] = type.upper()
    if severity:
        query["severity"] = severity.upper()
    if repair_status:
        query["repair_status"] = repair_status.upper()
    if critical_only is not None:
        query["is_critical"] = critical_only

    return db.events.find(query)

@router.get("/{event_id}")
async def get_event_by_id(event_id: str):
    event = db.events.find_one({"id": event_id.upper()})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.get("/{event_id}/observations")
async def get_event_observations(event_id: str):
    observations = db.event_observations.find({"event_id": event_id.upper()})
    return {
        "event_id": event_id.upper(),
        "count": len(observations),
        "observations": observations
    }
