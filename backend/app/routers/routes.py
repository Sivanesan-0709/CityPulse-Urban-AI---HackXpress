from fastapi import APIRouter, HTTPException
from app.database import db

router = APIRouter(prefix="/api/routes", tags=["Routes"])

@router.get("")
async def get_all_routes():
    return db.routes.find()

@router.get("/{route_code}")
async def get_route_by_code(route_code: str):
    route = db.routes.find_one({"code": route_code.upper()})
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    return route
