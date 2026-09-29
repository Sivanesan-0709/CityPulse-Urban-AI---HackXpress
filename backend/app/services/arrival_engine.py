"""
CityPulse Urban AI - Commuter Arrival & Dynamic ETA Engine
Calculates event-penalized ETAs for approaching buses, direction filtering, and explainable exclusions.
"""

import math
from typing import List, Dict, Any, Optional
from app.database import db
from app.services.osrm_routing import calculate_haversine_distance

class ArrivalEngine:
    @staticmethod
    def get_stop_arrivals(stop_id: str, destination_stop_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Computes real-time ETAs for all buses approaching target stop.
        Filters out opposite-direction or past buses with explicit explainability reasons.
        """
        stop = db.bus_stops.find_one({"id": stop_id})
        if not stop:
            raise ValueError(f"Bus stop '{stop_id}' not found")

        route_code = stop["route_code"]
        stop_direction = stop["direction"]
        stop_dist_km = stop["distance_from_start_km"]

        # Check destination stop validity if provided
        destination_stop = None
        if destination_stop_id:
            destination_stop = db.bus_stops.find_one({"id": destination_stop_id})

        # Fetch all buses operating on this route
        buses = db.buses.find({"route_code": route_code})
        approaching_buses = []
        excluded_buses = []

        # Active event penalties on this route
        active_events = db.events.find({"route_ids": route_code})
        has_waterlogging = any(e.get("type") == "WATERLOGGING" for e in active_events)
        has_congestion = any(e.get("type") == "CONGESTION" for e in active_events)
        has_critical_pothole = any(e.get("type") == "POTHOLE" and e.get("severity") == "CRITICAL" for e in active_events)

        for bus in buses:
            bus_dir = bus.get("direction", "UP")
            progress_km = bus.get("progress_km", 0.0)
            data_source = bus.get("data_source", "SIMULATED")

            # 1. Direction Filter
            if bus_dir != stop_direction:
                excluded_buses.append({
                    "bus_id": bus["id"],
                    "route_code": route_code,
                    "direction": bus_dir,
                    "reason": "OPPOSITE_DIRECTION",
                    "progress_km": progress_km,
                    "stop_distance_km": stop_dist_km,
                    "data_source": data_source,
                    "explanation": f"Bus is travelling {bus_dir}, but your stop is for {stop_direction} bound service."
                })
                continue

            # 2. Already Passed Filter
            if progress_km > stop_dist_km + 0.1: # 100m buffer
                excluded_buses.append({
                    "bus_id": bus["id"],
                    "route_code": route_code,
                    "direction": bus_dir,
                    "reason": "ALREADY_PASSED",
                    "progress_km": progress_km,
                    "stop_distance_km": stop_dist_km,
                    "data_source": data_source,
                    "explanation": f"Bus has already passed your stop by {round(progress_km - stop_dist_km, 1)} km."
                })
                continue

            # 3. Destination Filter (If destination specified, ensure route reaches it after boarding stop)
            if destination_stop:
                if destination_stop.get("route_code") != route_code or destination_stop.get("direction") != stop_direction:
                    excluded_buses.append({
                        "bus_id": bus["id"],
                        "route_code": route_code,
                        "direction": bus_dir,
                        "reason": "DOES_NOT_SERVE_DESTINATION",
                        "progress_km": progress_km,
                        "stop_distance_km": stop_dist_km,
                        "data_source": data_source,
                        "explanation": f"Bus {route_code} does not serve destination '{destination_stop.get('name')}'."
                    })
                    continue
                if destination_stop.get("distance_from_start_km", 0.0) <= stop_dist_km:
                    excluded_buses.append({
                        "bus_id": bus["id"],
                        "route_code": route_code,
                        "direction": bus_dir,
                        "reason": "DESTINATION_BEFORE_BOARDING",
                        "progress_km": progress_km,
                        "stop_distance_km": stop_dist_km,
                        "data_source": data_source,
                        "explanation": "Destination stop is located prior to your boarding stop."
                    })
                    continue

            # 4. ETA & Speed Calculation with Causality Penalties
            rem_dist_km = max(0.1, round(stop_dist_km - progress_km, 2))
            base_speed = max(12.0, bus.get("speed_kmh", 30.0))
            speed_penalty_pct = 0.0
            delay_reasons = []

            if has_waterlogging:
                speed_penalty_pct += 40.0
                delay_reasons.append("Monsoon Waterlogging")
            if has_congestion:
                speed_penalty_pct += 25.0
                delay_reasons.append("Traffic Congestion")
            if has_critical_pothole:
                speed_penalty_pct += 15.0
                delay_reasons.append("Severe Road Defect")

            effective_speed = max(10.0, base_speed * (1.0 - (speed_penalty_pct / 100.0)))
            eta_hours = rem_dist_km / effective_speed
            eta_min = max(1, int(round(eta_hours * 60.0)))

            conf_low = max(1, eta_min - 1)
            conf_high = eta_min + (2 if speed_penalty_pct > 0 else 1)
            confidence_range = f"{conf_low}–{conf_high} min"

            delay_reason_str = ", ".join(delay_reasons) if delay_reasons else None

            route_obj = db.routes.find_one({"code": route_code})
            route_name = route_obj.get("name", route_code) if route_obj else route_code

            approaching_buses.append({
                "bus_id": bus["id"],
                "route_code": route_code,
                "route_name": route_name,
                "direction": bus_dir,
                "eta_min": eta_min,
                "confidence_range": confidence_range,
                "seat_status": bus.get("seat_status", "SEATS_AVAILABLE"),
                "occupancy_pct": bus.get("occupancy_pct", 40),
                "delay_reason": delay_reason_str,
                "speed_kmh": round(effective_speed, 1),
                "distance_remaining_km": rem_dist_km,
                "data_source": data_source,
                "is_low_floor": bus.get("is_low_floor", False),
                "extended_dwell_time": bus.get("extended_dwell_time", False),
                "driver_verified": bus.get("driver_verified", True)
            })

        # Sort approaching buses by ETA ascending
        approaching_buses.sort(key=lambda x: x["eta_min"])

        return {
            "stop": stop,
            "destination_stop": destination_stop,
            "approaching_buses": approaching_buses,
            "excluded_buses": excluded_buses,
            "approaching_count": len(approaching_buses),
            "excluded_count": len(excluded_buses)
        }

    @staticmethod
    def find_nearest_stop(lat: float, lng: float, radius_m: float = 1000.0) -> Optional[Dict[str, Any]]:
        """Finds the closest bus stop to specified coordinates within radius."""
        stops = db.bus_stops.find()
        if not stops:
            return None

        best_stop = None
        min_dist_m = float("inf")

        for s in stops:
            dist_km = calculate_haversine_distance(lat, lng, s["lat"], s["lng"])
            dist_m = dist_km * 1000.0
            if dist_m <= radius_m and dist_m < min_dist_m:
                min_dist_m = dist_m
                best_stop = s.copy()
                best_stop["distance_m"] = round(dist_m, 1)

        return best_stop
