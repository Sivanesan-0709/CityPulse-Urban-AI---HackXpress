import sys
from pathlib import Path

# Ensure backend directory is in sys.path
_BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(_BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(_BACKEND_DIR))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from datetime import datetime

from app.config import (
    PROJECT_NAME,
    PROJECT_ID,
    VERSION,
    CORS_ORIGINS,
    FRONTEND_DIR,
    DEFAULT_CITY,
    DEFAULT_LAT,
    DEFAULT_LNG,
    DATA_MODE,
)
from app.database import db
from app.routers import (
    buses,
    routes,
    events,
    repairs,
    bandwidth,
    causality,
    incidents,
    traffic,
    road_conditions,
    alerts,
    simulation,
    commute,
    feed,
    models_router,
)
import asyncio
from app.services.transit_feed import feed_manager

app = FastAPI(
    title=PROJECT_NAME,
    description="Mobile Urban Intelligence Platform using Public Transport Fleet (SIH 2026)",
    version=VERSION,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register All Modular Routers
app.include_router(buses.router)
app.include_router(routes.router)
app.include_router(events.router)
app.include_router(repairs.router)
app.include_router(bandwidth.router)
app.include_router(causality.router)
app.include_router(incidents.router)
app.include_router(traffic.router)
app.include_router(road_conditions.router)
app.include_router(alerts.router)
app.include_router(simulation.router)
app.include_router(commute.router)
app.include_router(feed.router)
app.include_router(models_router.router)

async def _bg_simulation_loop():
    """Background loop advancing simulated buses and checking stale feeds every ~2 seconds."""
    while True:
        try:
            feed_manager.tick()
        except Exception as e:
            print(f"Simulation loop tick warning: {e}")
        await asyncio.sleep(2.0)

# Health & Info Endpoint
@app.get("/api/health")
async def health_check():
    from app.config import DATA_MODE
    return {
        "status": "healthy",
        "project": PROJECT_NAME,
        "problem_id": PROJECT_ID,
        "version": VERSION,
        "city": DEFAULT_CITY,
        "coordinates": {"lat": DEFAULT_LAT, "lng": DEFAULT_LNG},
        "fleet_buses": db.buses.count_documents(),
        "bus_stops": db.bus_stops.count_documents(),
        "active_events": db.events.count_documents(),
        "data_mode": DATA_MODE,
        "timestamp": datetime.now().isoformat() + "Z",
    }

# Dynamic Summary Endpoint for Dashboard Overview
@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    total_events = db.events.count_documents()
    critical_events = db.events.count_documents({"is_critical": True})
    active_defects = db.events.count_documents({"category": "ROAD_DEFECT", "repair_status": "DETECTED"})
    active_water = db.events.count_documents({"type": "WATERLOGGING"})
    congestion_zones = db.events.count_documents({"type": "CONGESTION"})
    repairs_pending = db.repairs.count_documents({"status": "DETECTED"}) + db.repairs.count_documents({"status": "ASSIGNED"})
    repairs_verified = db.repairs.count_documents({"status": "REPAIR_VERIFIED"})
    
    # Calculate live bandwidth savings
    total_obs = db.event_observations.count_documents()
    trad_mb = round(total_obs * 4.8, 1)
    unique_ev = total_events
    dups = max(0, total_obs - unique_ev)
    opt_mb = round((unique_ev * 4.8) + (dups * 0.0012), 1)
    saved_mb = round(trad_mb - opt_mb, 1)
    saved_pct = round((saved_mb / trad_mb) * 100, 1) if trad_mb > 0 else 0.0
    
    return {
        "active_buses": db.buses.count_documents(),
        "fleet_coverage_km": 348.5,
        "total_events_detected": total_events,
        "critical_events": critical_events,
        "active_road_defects": active_defects,
        "active_waterlogging": active_water,
        "congestion_zones": congestion_zones,
        "repairs_pending": repairs_pending,
        "repairs_verified": repairs_verified,
        "bandwidth_saved_pct": saved_pct,
        "total_bandwidth_saved_mb": saved_mb,
        "data_mode": DATA_MODE,
        "last_sync": datetime.now().isoformat() + "Z",
    }


# Startup Event to ensure Seed Data is generated on fresh container deployment & start simulation task
@app.on_event("startup")
async def startup_event():
    try:
        from app.seed_data import generate_seed_data
        if db.events.count_documents() == 0 or db.buses.count_documents() == 0 or db.bus_stops.count_documents() == 0:
            print("Fresh deployment detected: Auto-generating Chennai Urban AI seed data...")
            generate_seed_data()
        asyncio.create_task(_bg_simulation_loop())
    except Exception as e:
        print(f"Error during startup data check: {e}")

# Mount frontend assets
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")

@app.get("/tracker")
@app.get("/tracker.html")
async def serve_tracker():
    tracker_file = FRONTEND_DIR / "tracker.html"
    if tracker_file.exists():
        return FileResponse(str(tracker_file))
    return JSONResponse({"message": "Driver Tracker HTML file not found."}, status_code=404)

@app.get("/trip-share/{token}")
@app.get("/trip-share.html")
async def serve_trip_share(token: Optional[str] = None):
    share_file = FRONTEND_DIR / "trip-share.html"
    if share_file.exists():
        return FileResponse(str(share_file))
    return JSONResponse({"message": "Trip Share HTML file not found."}, status_code=404)

@app.get("/")
@app.get("/index.html")
async def serve_index():
    index_file = FRONTEND_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return JSONResponse({"message": "CityPulse Urban AI Platform API Running. Frontend directory not found."}, status_code=200)


if __name__ == "__main__":
    import uvicorn
    from app.config import HOST, PORT
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=False)

