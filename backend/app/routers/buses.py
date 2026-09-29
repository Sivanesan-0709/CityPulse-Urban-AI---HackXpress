from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.database import db

router = APIRouter(prefix="/api/buses", tags=["Buses"])

@router.get("")
async def get_all_buses(route: Optional[str] = None):
    query = {}
    if route:
        query["route_code"] = route
    return db.buses.find(query)

@router.get("/{bus_id}")
async def get_bus_by_id(bus_id: str):
    bus = db.buses.find_one({"id": bus_id})
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")
    return bus
