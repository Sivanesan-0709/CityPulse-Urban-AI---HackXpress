from fastapi import APIRouter, HTTPException, Query
from app.services.causality_engine import CausalityEngine

router = APIRouter(prefix="/api/causality", tags=["Causality & Event Evolution"])

@router.get("")
async def get_all_causality_chains():
    return CausalityEngine.get_all_chains()

@router.get("/pth001-evolution")
async def get_pth001_evolution():
    return CausalityEngine.get_pth001_evolution()

@router.get("/simulate-weather")
async def simulate_weather_impact(rainfall_mmh: float = Query(45.0, ge=0.0, le=150.0)):
    return CausalityEngine.simulate_weather_cascade(rainfall_mmh)
