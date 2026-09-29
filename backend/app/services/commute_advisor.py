"""
CityPulse Urban AI - Commute Advisor Engine
Compares public transit (bus) vs Auto (ride-hailing) on time and fare cost.
"""

import math
from typing import Dict, Any, Optional
from app.database import db
from app.config import (
    AUTO_BASE_FARE,
    AUTO_PER_KM_RATE,
    AUTO_AVG_SPEED_KMH,
    BUS_BASE_FARE,
    CARBON_EMISSION_FACTOR_AUTO_G_PER_KM,
    CARBON_EMISSION_FACTOR_BUS_G_PER_KM
)
from app.services.arrival_engine import ArrivalEngine
from app.services.osrm_routing import calculate_haversine_distance

class CommuteAdvisor:
    @staticmethod
    def get_advice(stop_id: str, destination_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Generates Wait-for-Bus vs Take-an-Auto recommendation and calculates CO2 carbon savings.
        """
        arrivals = ArrivalEngine.get_stop_arrivals(stop_id, destination_id)
        approaching = arrivals.get("approaching_buses", [])

        stop = arrivals["stop"]
        dest = arrivals.get("destination_stop")

        # Estimate trip distance in km
        if dest and dest.get("route_code") == stop.get("route_code"):
            trip_dist_km = max(1.0, abs(dest["distance_from_start_km"] - stop["distance_from_start_km"]))
        elif dest:
            trip_dist_km = max(1.0, calculate_haversine_distance(stop["lat"], stop["lng"], dest["lat"], dest["lng"]))
        else:
            trip_dist_km = 8.5 # Default average Chennai urban trip

        # Auto cost & time
        auto_travel_time_min = (trip_dist_km / AUTO_AVG_SPEED_KMH) * 60.0 + 2.0 # 2 min auto dispatch wait
        auto_fare = AUTO_BASE_FARE + (trip_dist_km * AUTO_PER_KM_RATE)
        bus_fare = BUS_BASE_FARE

        # Carbon savings calculation: auto_factor - bus_factor per km
        co2_delta_per_km = max(0.0, CARBON_EMISSION_FACTOR_AUTO_G_PER_KM - CARBON_EMISSION_FACTOR_BUS_G_PER_KM)

        if not approaching:
            return {
                "recommendation": "TAKE_AUTO",
                "bus_eta_min": 0,
                "auto_eta_min": int(round(auto_travel_time_min)),
                "time_saved_min": 20,
                "bus_fare_inr": bus_fare,
                "auto_fare_inr": round(auto_fare, 1),
                "cost_diff_inr": round(auto_fare - bus_fare, 1),
                "rationale": f"No approaching bus detected for your stop. Take an Auto to reach your destination in ~{int(round(auto_travel_time_min))} mins.",
                "co2_saved_g": 0.0
            }

        best_bus = approaching[0]
        bus_eta = best_bus["eta_min"]
        bus_speed = max(12.0, best_bus.get("speed_kmh", 28.0))
        bus_travel_time_min = (trip_dist_km / bus_speed) * 60.0
        total_bus_time_min = bus_eta + bus_travel_time_min

        time_saved_by_auto = max(0, int(round(total_bus_time_min - auto_travel_time_min)))
        cost_diff = round(auto_fare - bus_fare, 1)

        # Recommendation logic: Take Auto if Auto saves >= 10 mins or bus ETA > 15 mins
        if time_saved_by_auto >= 10 or bus_eta > 15:
            recommendation = "TAKE_AUTO"
            co2_saved_g = 0.0
            rationale = (
                f"Taking an Auto saves {time_saved_by_auto} mins (Auto ETA: {int(round(auto_travel_time_min))}m vs Bus: {int(round(total_bus_time_min))}m). "
                f"Costs ₹{cost_diff:.0f} more than ₹{bus_fare:.0f} bus fare."
            )
        else:
            recommendation = "WAIT"
            co2_saved_g = round(trip_dist_km * co2_delta_per_km, 1)
            rationale = (
                f"Wait for Bus {best_bus['route_code']} arriving in {bus_eta} min. "
                f"Saves ₹{cost_diff:.0f} over an Auto with only {time_saved_by_auto} min difference."
            )

        return {
            "recommendation": recommendation,
            "bus_eta_min": bus_eta,
            "auto_eta_min": int(round(auto_travel_time_min)),
            "time_saved_min": time_saved_by_auto,
            "bus_fare_inr": bus_fare,
            "auto_fare_inr": round(auto_fare, 1),
            "cost_diff_inr": cost_diff,
            "rationale": rationale,
            "co2_saved_g": co2_saved_g
        }
