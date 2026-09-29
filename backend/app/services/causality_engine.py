"""
CityPulse Urban AI - Urban Event Causality & Evolution Engine
SIH 2026 Problem Statement ID: 26124 - Differentiator 3
"""

from typing import List, Dict, Any
from app.database import db

class CausalityEngine:
    @staticmethod
    def get_all_chains() -> List[Dict[str, Any]]:
        return db.causality_chains.find()

    @staticmethod
    def get_chain_by_id(chain_id: str) -> Dict[str, Any]:
        return db.causality_chains.find_one({"id": chain_id})

    @staticmethod
    def get_pth001_evolution() -> Dict[str, Any]:
        chain = db.causality_chains.find_one({"id": "CAUS-003"})
        if chain:
            return chain
        return {
            "event_id": "PTH-001",
            "title": "PTH-001 Severity Evolution Timeline",
            "timeline": [
                {"day": "Day 1", "stage": "Initial Surface Crack", "severity_pct": 32, "notes": "BUS-01 detection"},
                {"day": "Day 5", "stage": "Cavity Depression Expansion", "severity_pct": 51, "notes": "BUS-05 detection"},
                {"day": "Day 10", "stage": "Severe 9cm Pothole", "severity_pct": 84, "notes": "BUS-08 / BUS-12 multi-bus verification"},
                {"day": "Day 12", "stage": "Assigned for Repair", "severity_pct": 84, "notes": "Work order WO-891 dispatched"},
                {"day": "Day 14", "stage": "Contractor Marked Repaired", "severity_pct": 0, "notes": "Status: REPAIR COMPLETED"},
                {"day": "Day 15", "stage": "BUS-15 Autonomous Re-scan", "severity_pct": 0, "notes": "AI Confidence 96% -> REPAIR VERIFIED"}
            ]
        }

    @staticmethod
    def simulate_weather_cascade(rainfall_mmh: float = 45.0) -> Dict[str, Any]:
        """Calculates dynamic cascading urban impact from rain to waterlogging, traffic density, and route delay"""
        density_increase = int(min(65, rainfall_mmh * 0.95))
        speed_decrease = int(min(55, rainfall_mmh * 0.72))
        delay_minutes = int(min(30, rainfall_mmh * 0.35))
        
        return {
            "root_cause": f"Heavy Precipitation ({rainfall_mmh} mm/h)",
            "road_condition": "Multi-point Waterlogging (Anna Salai & Guindy)",
            "traffic_density_increase_pct": f"+{density_increase}%",
            "bus_average_speed_impact": f"-{speed_decrease}%",
            "cumulative_route_delay": f"+{delay_minutes} minutes",
            "affected_routes": ["21G", "21A", "5C", "45B", "570"],
            "recommended_action": "Reroute 21G via Mount-Poonamallee Road; Dispatch drainage de-watering pumps to Guindy Kathipara."
        }

    @staticmethod
    def get_disaster_status() -> Dict[str, Any]:
        """
        Evaluates active events across route corridors.
        If 2+ active events on a route exceed DISASTER_MODE_SEVERITY_THRESHOLD (or severe waterlogging/flooding),
        flags route with disaster_mode=True.
        """
        from app.config import DISASTER_MODE_SEVERITY_THRESHOLD
        
        events = [e for e in db.events.find() if e.get("repair_status") != "REPAIR_VERIFIED"]
        routes = db.routes.find()
        
        route_map = {r["code"]: r for r in routes}
        route_severe_events: Dict[str, List[Dict[str, Any]]] = {r["code"]: [] for r in routes}
        
        for ev in events:
            score = ev.get("severity_score", 0.0)
            is_crit = ev.get("severity") in ["HIGH", "CRITICAL"] or ev.get("is_critical", False)
            ev_type = ev.get("type")
            
            if score >= DISASTER_MODE_SEVERITY_THRESHOLD or is_crit or ev_type == "WATERLOGGING":
                for r_code in ev.get("route_ids", []):
                    if r_code in route_severe_events:
                        route_severe_events[r_code].append(ev)
                        
        affected_routes = []
        for r_code, ev_list in route_severe_events.items():
            if len(ev_list) >= 2 or any(e.get("type") == "WATERLOGGING" and e.get("severity") == "CRITICAL" for e in ev_list):
                r_obj = route_map.get(r_code, {})
                reasons = list({f"{e.get('type', 'Hazard').replace('_', ' ').title()} near {e.get('road_name', 'Corridor')}" for e in ev_list})
                primary_reason = " & ".join(reasons[:2])
                
                # Determine alternate route
                alt_route = "19B" if r_code == "21G" else ("21G" if r_code != "21G" else "45B")
                
                affected_routes.append({
                    "route_code": r_code,
                    "route_name": r_obj.get("name", r_code),
                    "disaster_mode": True,
                    "active_events_count": len(ev_list),
                    "reason": f"{primary_reason} — Route {r_code} delayed/disrupted",
                    "severity": "CRITICAL",
                    "suggested_detour": f"Use alternate corridor {alt_route}",
                    "recommended_action": f"Avoid Route {r_code}; use alternate corridor {alt_route} or wait for emergency clearance."
                })
                
        disaster_active = len(affected_routes) > 0
        notice = "Severe flood disruption active on transit corridor(s). Disaster rerouting protocol engaged." if disaster_active else "All urban transit corridors operating under normal parameters."
        
        return {
            "disaster_active": disaster_active,
            "disaster_mode": disaster_active,
            "affected_routes": affected_routes,
            "system_notice": notice,
            "threshold_used": DISASTER_MODE_SEVERITY_THRESHOLD
        }

