from fastapi import APIRouter
from typing import List, Dict, Any
from app.database import db

router = APIRouter(prefix="/api/alerts", tags=["Alert Center"])

@router.get("")
async def get_active_alerts():
    """Returns real-time emergency dispatch queue and priority alerts"""
    critical_events = db.events.find({"is_critical": True})
    incidents = db.incidents.find()
    
    alerts = []
    
    # 1. Critical Hit-and-Run Incidents
    for inc in incidents:
        if inc.get("type") == "HIT_AND_RUN":
            alerts.append({
                "id": f"ALT-{inc['id']}",
                "title": f"🚨 EMERGENCY: Hit-and-Run Captured by {inc.get('detecting_bus_id')}",
                "category": "INCIDENT",
                "priority": "CRITICAL",
                "location": inc.get("location"),
                "road_name": inc.get("road_name"),
                "timestamp": inc.get("timestamp"),
                "details": f"Vehicle: {inc.get('vehicle_type')} | ANPR Plate: {inc.get('plate_number')} (Conf: {inc.get('plate_confidence')}%)",
                "action_required": "Auto-Dispatched to Greater Chennai Traffic Police (GCTP) Control Room",
                "status": inc.get("status")
            })

    # 2. Critical Road Hazards & Waterlogging
    for ev in critical_events[:10]:
        alerts.append({
            "id": f"ALT-{ev['id']}",
            "title": f"⚠️ Hazard: {ev['type']} ({ev['subtype']})",
            "category": ev["category"],
            "priority": "HIGH" if ev.get("severity") != "CRITICAL" else "CRITICAL",
            "location": ev.get("road_name"),
            "road_name": ev.get("road_name"),
            "timestamp": ev.get("last_detected"),
            "details": f"Verified by {ev.get('observation_count')} buses ({', '.join(ev.get('observing_buses', []))}). AI Conf: {ev.get('confidence')}%.",
            "action_required": "Immediate municipal barricading & repair dispatch recommended",
            "status": ev.get("repair_status", "ACTIVE")
        })

    return {
        "total_active_alerts": len(alerts),
        "critical_count": len([a for a in alerts if a["priority"] == "CRITICAL"]),
        "alerts": alerts
    }
