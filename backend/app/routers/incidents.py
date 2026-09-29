from fastapi import APIRouter
from app.database import db

router = APIRouter(prefix="/api/incidents", tags=["Incidents & ANPR"])

@router.get("")
async def get_all_incidents():
    return db.incidents.find()
