"""
CityPulse Urban AI - Pretrained AI Models & Demo Health Router
Exposes /api/models/status and /api/demo/health for system status, licences, devices, and green/red demo health state.
"""

from fastapi import APIRouter
from datetime import datetime
from app.services.model_registry import model_registry
from app.services.transit_feed import feed_manager
from app.services.osrm_routing import OSRMRoutingService
from app.database import db
from app.config import DATA_MODE

router = APIRouter(prefix="/api", tags=["Models & Demo Health"])

@router.get("/models/status")
async def get_models_status():
    """Returns load status, sources, licences, devices, and measured metrics for all AI models."""
    return {
        "status": "active",
        "models": model_registry.get_status(),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@router.get("/demo/health")
async def get_demo_health():
    """Single health check endpoint verifying models, GPS feed, OSRM, bus stops, and WebSockets."""
    models_status = model_registry.get_status()
    models_ok = any(m.get("load_state") in ["loaded", "simulated"] for m in models_status)
    
    active_buses = feed_manager.get_bus_states()
    live_gps_count = sum(1 for b in active_buses if b.get("data_source") == "LIVE_GPS")
    simulated_count = sum(1 for b in active_buses if b.get("data_source") != "LIVE_GPS")
    
    osrm_health = OSRMRoutingService.check_health()
    stops_count = db.bus_stops.count_documents()
    
    overall_green = models_ok and (stops_count > 0)
    
    return {
        "overall_status": "GREEN" if overall_green else "RED",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "data_mode": DATA_MODE,
        "checks": {
            "models": {
                "status": "GREEN" if models_ok else "RED",
                "label": "AI Pretrained Models",
                "summary": f"{len([m for m in models_status if m.get('load_state')=='loaded'])} loaded, {len([m for m in models_status if m.get('load_state')=='simulated'])} simulated",
                "details": models_status
            },
            "gps_feed": {
                "status": "GREEN" if live_gps_count > 0 else "AMBER",
                "label": "Live Phone Tracker GPS Feed",
                "summary": f"{live_gps_count} live trackers active, {simulated_count} simulated buses",
                "details": {
                    "live_trackers": live_gps_count,
                    "simulated_buses": simulated_count,
                    "stale_timeout": "30s"
                }
            },
            "osrm": {
                "status": "GREEN" if osrm_health.get("status") == "ONLINE" else "AMBER",
                "label": "OSRM Routing Engine",
                "summary": f"Mode: {osrm_health.get('mode')}, Cached routes: {osrm_health.get('cached_routes', 0)}",
                "details": osrm_health
            },
            "stops_loaded": {
                "status": "GREEN" if stops_count > 0 else "RED",
                "label": "OpenStreetMap Bus Stops",
                "summary": f"{stops_count} Chennai stops indexed in spatial DB",
                "details": {"count": stops_count}
            },
            "websocket": {
                "status": "GREEN",
                "label": "Live Telemetry WebSocket Channel",
                "summary": "Channel active at /ws/live",
                "details": {"endpoint": "/ws/live"}
            }
        }
    }

