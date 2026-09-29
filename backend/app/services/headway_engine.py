"""
CityPulse Urban AI - Fleet Headway & Bunching Engine
Detects bus bunching and large headway gaps, raising alert dispatch records.
"""

from typing import List, Dict, Any
from datetime import datetime
from app.database import db
from app.config import HEADWAY_BUNCHING_THRESHOLD_KM

class HeadwayEngine:
    @staticmethod
    def get_fleet_headway() -> List[Dict[str, Any]]:
        """
        Calculates spacing metrics for each route & direction.
        Detects bus bunching (<0.8km gap) and generates alert records.
        """
        routes = db.routes.find()
        headway_stats = []
        now_str = datetime.utcnow().isoformat() + "Z"

        for route in routes:
            r_code = route["code"]
            for direction in ["UP", "DOWN"]:
                buses = db.buses.find({"route_code": r_code, "direction": direction})
                buses.sort(key=lambda b: b.get("progress_km", 0.0))

                b_count = len(buses)
                if b_count < 2:
                    headway_stats.append({
                        "route_code": r_code,
                        "direction": direction,
                        "buses_count": b_count,
                        "avg_gap_km": 0.0,
                        "min_gap_km": 0.0,
                        "bunching_detected": False,
                        "bunching_buses": []
                    })
                    continue

                gaps = []
                bunching_buses = []

                for i in range(len(buses) - 1):
                    gap = round(abs(buses[i+1].get("progress_km", 0.0) - buses[i].get("progress_km", 0.0)), 2)
                    gaps.append(gap)
                    if gap < HEADWAY_BUNCHING_THRESHOLD_KM:
                        bunching_buses.extend([buses[i]["id"], buses[i+1]["id"]])

                bunching_buses = list(set(bunching_buses))
                is_bunching = len(bunching_buses) > 0
                avg_gap = round(sum(gaps) / len(gaps), 2) if gaps else 0.0
                min_gap = min(gaps) if gaps else 0.0

                # Trigger automatic alert if bunching is detected and not already alerted
                if is_bunching:
                    alert_id = f"ALT-BUNCH-{r_code}-{direction}"
                    existing = db.alerts.find_one({"id": alert_id})
                    if not existing:
                        db.alerts.insert_one({
                            "id": alert_id,
                            "title": f"Bus Bunching Alert on Route {r_code} ({direction})",
                            "category": "FLEET_OPERATIONS",
                            "priority": "HIGH",
                            "location": f"Route {r_code} Corridor",
                            "road_name": f"{route['name']} ({direction})",
                            "timestamp": now_str,
                            "details": f"Buses {', '.join(bunching_buses)} are bunched (< {min_gap} km gap). Recommend holding trailing bus.",
                            "status": "ACTIVE"
                        })

                headway_stats.append({
                    "route_code": r_code,
                    "direction": direction,
                    "buses_count": b_count,
                    "avg_gap_km": avg_gap,
                    "min_gap_km": min_gap,
                    "bunching_detected": is_bunching,
                    "bunching_buses": bunching_buses
                })

        return headway_stats
