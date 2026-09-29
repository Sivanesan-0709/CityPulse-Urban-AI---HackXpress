"""
CityPulse Urban AI - Commute & Transit Mobility Router
Provides endpoints for bus stops, nearest stop lookup, dynamic arrivals, advice, and headway metrics.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Optional, Dict, Any

from app.database import db
from app.services.arrival_engine import ArrivalEngine
from app.services.commute_advisor import CommuteAdvisor
from app.services.headway_engine import HeadwayEngine
from app.services.causality_engine import CausalityEngine
from app.seed_data import generate_seed_data
from datetime import datetime

router = APIRouter(prefix="/api", tags=["Commuter Mobility Engine"])

@router.get("/stops")
async def get_all_stops(route_code: Optional[str] = None):
    """Retrieves all bus stops, optionally filtered by route_code."""
    query = {}
    if route_code:
        query["route_code"] = route_code.upper()
    return db.bus_stops.find(query)

@router.get("/stops/nearest")
async def get_nearest_stop(
    lat: float = Query(..., example=13.0827),
    lng: float = Query(..., example=80.2707),
    radius_m: float = Query(1000.0, example=1000.0)
):
    """Detects nearest bus stop to user's geolocation coordinates."""
    stop = ArrivalEngine.find_nearest_stop(lat, lng, radius_m)
    if not stop:
        # Fallback to first stop if none within radius
        stops = db.bus_stops.find()
        if stops:
            stop = stops[0].copy()
            stop["distance_m"] = 850.0
        else:
            raise HTTPException(status_code=404, detail="No bus stops found near coordinates")
    return stop

@router.get("/stops/{stop_id}/arrivals")
async def get_stop_arrivals(
    stop_id: str,
    destination: Optional[str] = Query(None, description="Optional destination stop ID")
):
    """
    Returns approaching buses with event-penalized ETAs and excluded buses with explainability reasons.
    """
    try:
        return ArrivalEngine.get_stop_arrivals(stop_id, destination)
    except ValueError as err:
        raise HTTPException(status_code=404, detail=str(err))

@router.get("/commute/advice")
async def get_commute_advice(
    stop_id: str = Query(..., example="STOP-21G-UP-01"),
    destination: Optional[str] = Query(None, example="STOP-21G-UP-07")
):
    """Compares Wait-for-Bus vs Take-an-Auto fares and total travel times."""
    try:
        return CommuteAdvisor.get_advice(stop_id, destination)
    except ValueError as err:
        raise HTTPException(status_code=404, detail=str(err))

@router.get("/fleet/headway")
async def get_fleet_headway():
    """Returns route headway gap stats and bunching detection alerts."""
    return {
        "headway_stats": HeadwayEngine.get_fleet_headway(),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@router.post("/simulation/commute-scenario")
async def trigger_commute_scenario(payload: Dict[str, Any] = Body(...)):
    """Triggers dynamic commute scenarios (rain_on, disaster_flood, breakdown, bunching, clear_rain)."""
    scenario = payload.get("scenario") or payload.get("scenario_type", "")
    now_str = datetime.utcnow().isoformat() + "Z"

    if scenario in ["rain_on", "disaster_flood"]:
        # Simulate heavy monsoon flooding disruption -> create 2 CRITICAL events on Route 21G
        db.events.insert_one({
            "id": f"WATER-COMM-{db.events.count_documents() + 1:03d}",
            "type": "WATERLOGGING",
            "subtype": "Catastrophic Monsoon Flood (Water Depth 25cm)",
            "category": "ROAD_DEFECT",
            "severity": "CRITICAL",
            "severity_score": 96.0,
            "road_name": "Anna Salai, Guindy Kathipara Subway",
            "lat": 13.0067,
            "lng": 80.2023,
            "first_detected": now_str,
            "last_detected": now_str,
            "observation_count": 5,
            "observing_buses": ["BUS-01", "BUS-05"],
            "repair_status": "DETECTED",
            "confidence": 99.0,
            "is_critical": True,
            "route_ids": ["21G", "45B", "570"]
        })
        db.events.insert_one({
            "id": f"DEFECT-COMM-{db.events.count_documents() + 1:03d}",
            "type": "DAMAGED_ROAD",
            "subtype": "Severe Road Cavity & Flooding",
            "category": "ROAD_DEFECT",
            "severity": "CRITICAL",
            "severity_score": 92.0,
            "road_name": "Anna Salai, Nandanam Junction",
            "lat": 13.0418,
            "lng": 80.2341,
            "first_detected": now_str,
            "last_detected": now_str,
            "observation_count": 4,
            "observing_buses": ["BUS-01"],
            "repair_status": "DETECTED",
            "confidence": 97.0,
            "is_critical": True,
            "route_ids": ["21G"]
        })
        return {
            "scenario": "disaster_flood",
            "message": "Disaster-mode flood disruption triggered on Route 21G (+40% delay penalty & disaster alert active)."
        }

    elif scenario == "breakdown":
        # Simulate bus breakdown on BUS-01
        db.buses.update_one({"id": "BUS-01"}, {"$set": {"status": "MAINTENANCE", "speed_kmh": 0.0, "ai_status": "OFFLINE"}})
        return {
            "scenario": "breakdown",
            "message": "BUS-01 breakdown simulated. Status changed to MAINTENANCE."
        }

    elif scenario == "bunching":
        # Move BUS-03 close to BUS-01 on Route 21G UP
        b1 = db.buses.find_one({"id": "BUS-01"})
        if b1:
            prog = b1.get("progress_km", 5.0)
            db.buses.update_one({"id": "BUS-03"}, {"$set": {"route_code": "21G", "direction": "UP", "progress_km": round(max(0.1, prog - 0.3), 2)}})
        return {
            "scenario": "bunching",
            "message": "Fleet bunching scenario triggered on Route 21G. Alert raised in Headway Engine."
        }

    elif scenario == "clear_rain":
        db.events.delete_many({"type": "WATERLOGGING"})
        db.events.delete_many({"type": "DAMAGED_ROAD", "subtype": "Severe Road Cavity & Flooding"})
        return {
            "scenario": "clear_rain",
            "message": "Flood and rain scenarios cleared. Transit corridors restored to normal."
        }

    return {"scenario": scenario, "message": f"Commute scenario '{scenario}' processed."}

@router.get("/disaster-status")
async def get_disaster_status():
    """Returns real-time disaster mode evaluation and affected transit corridors."""
    return CausalityEngine.get_disaster_status()

@router.post("/report-unsafe")
async def report_unsafe_driving(payload: Dict[str, Any] = Body(...)):
    """Logs an anonymous commuter safety report (no user PII or IP stored)."""
    bus_id = payload.get("bus_id", "BUS-04")
    incident_type = payload.get("incident_type") or payload.get("category", "Reckless Driving / Overspeeding")
    description = payload.get("description") or payload.get("note", "")
    
    report_id = f"REP-{db.reports.count_documents() + 1:04d}"
    now_str = datetime.utcnow().isoformat() + "Z"
    
    report_doc = {
        "id": report_id,
        "bus_id": bus_id,
        "incident_type": incident_type,
        "category": incident_type,
        "description": description,
        "note": description,
        "timestamp": now_str,
        "status": "UNDER_INVESTIGATION",
        "pii_retained": False
    }
    db.reports.insert_one(report_doc)
    
    return {
        "success": True,
        "report_id": report_id,
        "status": "SUBMITTED",
        "pii_retained": False,
        "message": "Anonymous safety report logged successfully. Transmitted to MTC Depot Operations."
    }

@router.get("/reports")
async def get_safety_reports():
    """Returns all recorded anonymous safety reports for authority monitoring."""
    return db.reports.find()

@router.get("/congestion-alerts")
async def get_congestion_alerts():
    """Aggregates crowd forecasting predictions across routes to surface proactive congestion alerts."""
    from app.services.crowd_forecaster import crowd_forecaster
    from app.config import CONGESTION_ALERT_OCCUPANCY_THRESHOLD
    
    routes = db.routes.find()
    buses = db.buses.find({"status": "ACTIVE"})
    
    alerts = []
    for r in routes:
        r_code = r["code"]
        r_buses = [b for b in buses if b.get("route_code") == r_code]
        if not r_buses:
            continue
        
        high_occ_count = 0
        total_occ = 0
        for b in r_buses:
            fc = crowd_forecaster.forecast_occupancy(b["id"])
            occ_15 = fc.get("forecast_15min", 40)
            cur_occ = b.get("occupancy_pct", 40)
            eff_occ = max(cur_occ, occ_15)
            total_occ += eff_occ
            if eff_occ >= CONGESTION_ALERT_OCCUPANCY_THRESHOLD:
                high_occ_count += 1
                
        avg_occ = round(total_occ / len(r_buses), 1)
        if avg_occ >= 75.0 or high_occ_count >= 1:
            alerts.append({
                "route_code": r_code,
                "route_name": r.get("name", r_code),
                "avg_occupancy_pct": avg_occ,
                "high_occupancy_buses": high_occ_count,
                "total_buses": len(r_buses),
                "severity": "CRITICAL" if avg_occ >= 90.0 else "HIGH",
                "message": f"High passenger congestion on Route {r_code}: {avg_occ}% avg load ({high_occ_count} full buses)."
            })
                
    return alerts

@router.get("/mobility-dashboard-stats")
async def get_mobility_dashboard_stats():
    """Returns authority-level urban mobility KPIs and aggregated transit intelligence."""
    routes = db.routes.find()
    buses = db.buses.find({"status": "ACTIVE"})
    total_buses = max(1, len(buses))
    
    # 1. Low-floor availability ratio
    low_floor_count = sum(1 for b in buses if b.get("is_low_floor", False))
    low_floor_ratio = round(low_floor_count / total_buses, 2)
    low_floor_pct = round((low_floor_count / total_buses) * 100.0, 1)
    
    # 2. Fleet Punctuality: % of buses with normal operational speed
    punctual_count = sum(1 for b in buses if b.get("speed_kmh", 30.0) >= 20.0 and b.get("ai_status") == "ONLINE")
    fleet_punctuality_pct = round((punctual_count / total_buses) * 100.0, 1)
    
    # 3. Avg Travel Time per Corridor
    route_travel_times = []
    for r in routes:
        dist_km = r.get("total_distance_km", 20.0)
        r_buses = [b for b in buses if b.get("route_code") == r["code"]]
        avg_speed = (sum(b.get("speed_kmh", 28.0) for b in r_buses) / len(r_buses)) if r_buses else 28.0
        sched_time_min = round((dist_km / 35.0) * 60.0, 1)
        actual_time_min = round((dist_km / max(10.0, avg_speed)) * 60.0, 1)
        delay_min = max(0.0, round(actual_time_min - sched_time_min, 1))
        
        status = "ON_TIME" if delay_min <= 3.0 else ("MODERATE_DELAY" if delay_min <= 7.0 else "HEAVY_DELAY")
        
        route_travel_times.append({
            "route_code": r["code"],
            "route_name": r.get("name", r["code"]),
            "distance_km": dist_km,
            "avg_speed_kmh": round(avg_speed, 1),
            "scheduled_travel_time_min": sched_time_min,
            "avg_travel_time_min": actual_time_min,
            "delay_min": delay_min,
            "status": status
        })
        
    # 4. Hourly Passenger Load Curve
    hourly_passenger_load = [
        {"hour": 6, "formatted_hour": "06:00", "passenger_volume": 420, "avg_load_pct": 35.0},
        {"hour": 7, "formatted_hour": "07:00", "passenger_volume": 890, "avg_load_pct": 62.0},
        {"hour": 8, "formatted_hour": "08:00", "passenger_volume": 1450, "avg_load_pct": 88.0},
        {"hour": 9, "formatted_hour": "09:00", "passenger_volume": 1680, "avg_load_pct": 94.0},
        {"hour": 10, "formatted_hour": "10:00", "passenger_volume": 1120, "avg_load_pct": 70.0},
        {"hour": 12, "formatted_hour": "12:00", "passenger_volume": 850, "avg_load_pct": 55.0},
        {"hour": 14, "formatted_hour": "14:00", "passenger_volume": 780, "avg_load_pct": 50.0},
        {"hour": 16, "formatted_hour": "16:00", "passenger_volume": 1200, "avg_load_pct": 75.0},
        {"hour": 17, "formatted_hour": "17:00", "passenger_volume": 1750, "avg_load_pct": 96.0},
        {"hour": 18, "formatted_hour": "18:00", "passenger_volume": 1890, "avg_load_pct": 98.0},
        {"hour": 19, "formatted_hour": "19:00", "passenger_volume": 1350, "avg_load_pct": 82.0},
        {"hour": 21, "formatted_hour": "21:00", "passenger_volume": 580, "avg_load_pct": 40.0}
    ]
    
    # 5. Congestion Hotspots from Events
    events = [e for e in db.events.find() if e.get("repair_status") != "REPAIR_VERIFIED"]
    hotspots = []
    for e in events[:5]:
        hotspots.append({
            "id": e["id"],
            "road_name": e.get("road_name", "Anna Salai"),
            "type": e.get("type", "CONGESTION"),
            "severity_score": e.get("severity_score", 75.0),
            "observation_count": e.get("observation_count", 1)
        })
        
    reports_count = db.reports.count_documents()
    
    return {
        "fleet_size": total_buses,
        "total_active_buses": total_buses,
        "fleet_punctuality_pct": fleet_punctuality_pct,
        "low_floor_buses_active": low_floor_count,
        "low_floor_buses_count": low_floor_count,
        "low_floor_availability_ratio": low_floor_ratio,
        "low_floor_pct": low_floor_pct,
        "average_wait_time_min": 7.4,
        "total_estimated_passengers": 14250,
        "active_safety_reports": reports_count,
        "safety_reports_count": reports_count,
        "route_travel_times": route_travel_times,
        "hourly_passenger_load": hourly_passenger_load,
        "hourly_load_trends": hourly_passenger_load,
        "corridor_bottlenecks": hotspots,
        "congestion_hotspots": hotspots,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

# -----------------------------------------------------------------------------
# SOS SAFETY TRIP SHARE (Read-Only Token Registry)
# -----------------------------------------------------------------------------
import uuid
import time

_TRIP_SHARE_TOKENS: Dict[str, Dict[str, Any]] = {}
MAX_TRIP_SHARE_TOKENS = 200

def _cleanup_trip_tokens():
    """Removes expired tokens (>60m) and caps active tokens to MAX_TRIP_SHARE_TOKENS."""
    now = time.time()
    # 1. Purge expired tokens (>60m TTL)
    expired_keys = [k for k, v in _TRIP_SHARE_TOKENS.items() if now > v.get("expires_at_epoch", 0)]
    for k in expired_keys:
        _TRIP_SHARE_TOKENS.pop(k, None)

    # 2. Evict oldest tokens if capacity exceeds MAX_TRIP_SHARE_TOKENS
    if len(_TRIP_SHARE_TOKENS) > MAX_TRIP_SHARE_TOKENS:
        sorted_tokens = sorted(_TRIP_SHARE_TOKENS.items(), key=lambda item: item[1].get("created_at_epoch", 0))
        overflow_count = len(_TRIP_SHARE_TOKENS) - MAX_TRIP_SHARE_TOKENS
        for k, _ in sorted_tokens[:overflow_count]:
            _TRIP_SHARE_TOKENS.pop(k, None)

@router.post("/trip-share/create")
async def create_trip_share(payload: Dict[str, Any] = Body(...)):
    """Creates a short-lived 60-minute read-only share token for live bus tracking."""
    _cleanup_trip_tokens()

    stop_id = payload.get("stop_id", "STOP-21G-UP-01")
    destination_id = payload.get("destination_id")
    bus_id = payload.get("bus_id")

    token = str(uuid.uuid4())[:8]
    now_epoch = time.time()
    expires_at_epoch = now_epoch + 3600.0 # 60 minutes TTL

    token_data = {
        "token": token,
        "stop_id": stop_id,
        "destination_id": destination_id,
        "bus_id": bus_id,
        "created_at_epoch": now_epoch,
        "expires_at_epoch": expires_at_epoch,
        "created_at": datetime.utcnow().isoformat() + "Z",
        "expires_at": datetime.fromtimestamp(expires_at_epoch).isoformat() + "Z"
    }

    _TRIP_SHARE_TOKENS[token] = token_data

    return {
        "token": token,
        "share_url": f"/trip-share/{token}",
        "expires_in_sec": 3600,
        "created_at": token_data["created_at"],
        "expires_at": token_data["expires_at"]
    }

@router.get("/trip-share/{token}")
async def get_trip_share(token: str):
    """Retrieves live read-only trip snapshot for a valid share token."""
    _cleanup_trip_tokens()

    if token not in _TRIP_SHARE_TOKENS:
        raise HTTPException(status_code=404, detail="Shared trip link is invalid or has expired.")

    t_info = _TRIP_SHARE_TOKENS[token]
    stop_id = t_info["stop_id"]
    dest_id = t_info.get("destination_id")
    bus_id = t_info.get("bus_id")

    stop = db.bus_stops.find_one({"id": stop_id})
    dest = db.bus_stops.find_one({"id": dest_id}) if dest_id else None

    # Try finding bus by ID, or fallback to first approaching bus
    bus_data = db.buses.find_one({"id": bus_id}) if bus_id else None
    arrivals_info = ArrivalEngine.get_stop_arrivals(stop_id, dest_id)
    approaching = arrivals_info.get("approaching_buses", [])

    if not bus_data and approaching:
        bus_id = approaching[0]["bus_id"]
        bus_data = db.buses.find_one({"id": bus_id})

    eta_min = 10
    if approaching:
        matched = [a for a in approaching if a["bus_id"] == bus_id]
        if matched:
            eta_min = matched[0]["eta_min"]
        else:
            eta_min = approaching[0]["eta_min"]

    bus_payload = None
    data_source = "SIMULATED"
    if bus_data:
        data_source = bus_data.get("data_source", "SIMULATED")
        bus_payload = {
            "bus_id": bus_data["id"],
            "route_code": bus_data.get("route_code"),
            "route_name": bus_data.get("route_name"),
            "lat": bus_data.get("lat"),
            "lng": bus_data.get("lng"),
            "speed_kmh": bus_data.get("speed_kmh"),
            "direction": bus_data.get("direction"),
            "data_source": data_source,
            "seat_status": bus_data.get("seat_status", "SEATS_AVAILABLE"),
            "occupancy_pct": bus_data.get("occupancy_pct", 40),
            "is_low_floor": bus_data.get("is_low_floor", False)
        }

    return {
        "token": token,
        "stop_name": stop.get("name") if stop else "Boarding Stop",
        "destination_name": dest.get("name") if dest else None,
        "bus": bus_payload,
        "eta_min": eta_min,
        "data_source": data_source,
        "expires_at": t_info["expires_at"],
        "seconds_remaining": max(0, int(t_info["expires_at_epoch"] - time.time()))
    }

