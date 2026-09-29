"""
CityPulse Urban AI - Transit Feed Ingestion & Map-Matching Service
Implements SimulatedFeed, PhoneGpsFeed (Live GPS Ingestion), and LiveFeedProvider.
Performs map-matching, heading direction inference, jitter rejection, and 30s stale-feed fallback.
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
import asyncio
import math

from app.database import db
from app.config import DATA_MODE, STALE_FEED_TIMEOUT_SEC
from app.services.osrm_routing import calculate_haversine_distance

class TransitFeedProvider(ABC):
    @abstractmethod
    def update_fleet(self) -> List[Dict[str, Any]]:
        pass

class SimulatedFeed(TransitFeedProvider):
    def update_fleet(self) -> List[Dict[str, Any]]:
        """Advances simulated buses along their route polylines."""
        buses = db.buses.find({"data_source": "SIMULATED"})
        updated_buses = []

        for bus in buses:
            route = db.routes.find_one({"code": bus["route_code"]})
            if not route or "waypoints" not in route:
                continue

            wps = route["waypoints"]
            total_dist = route.get("total_distance_km", 25.0)
            speed_kmh = bus.get("speed_kmh", 30.0)
            direction = bus.get("direction", "UP")
            curr_progress = bus.get("progress_km", 0.0)

            # Advance distance in ~2s tick: speed_kmh * (2 / 3600)
            step_km = (speed_kmh / 3600.0) * 2.0

            if direction == "UP":
                new_progress = curr_progress + step_km
                if new_progress >= total_dist:
                    new_progress = total_dist
                    direction = "DOWN" # Reverse at terminal
            else: # DOWN
                new_progress = curr_progress - step_km
                if new_progress <= 0:
                    new_progress = 0.0
                    direction = "UP" # Reverse at start terminal

            new_progress = round(new_progress, 2)

            # Map progress_km to lat/lng along waypoints
            frac = new_progress / total_dist if total_dist > 0 else 0.0
            if direction == "DOWN":
                frac = (total_dist - new_progress) / total_dist

            wp_idx = min(int(frac * (len(wps) - 1)), len(wps) - 1)
            target_wp = wps[wp_idx]

            # Next stop lookup
            stops = db.bus_stops.find({"route_code": bus["route_code"], "direction": direction})
            stops.sort(key=lambda s: s["sequence"])
            next_stops = [s for s in stops if s["distance_from_start_km"] > new_progress]
            next_stop_id = next_stops[0]["id"] if next_stops else (stops[-1]["id"] if stops else None)

            now_str = datetime.utcnow().isoformat() + "Z"
            update_data = {
                "lat": target_wp["lat"],
                "lng": target_wp["lng"],
                "progress_km": new_progress,
                "direction": direction,
                "next_stop_id": next_stop_id,
                "last_ping": now_str,
                "data_source": "SIMULATED",
                "heading": 180.0 if direction == "UP" else 0.0
            }

            db.buses.update_one({"id": bus["id"]}, {"$set": update_data})
            bus.update(update_data)
            updated_buses.append(bus)

        return updated_buses

class PhoneGpsFeed(TransitFeedProvider):
    @staticmethod
    def map_match_coordinate(lat: float, lng: float, waypoints: List[Dict[str, float]]) -> Tuple[float, float, float]:
        """
        Projects (lat, lng) onto the route polyline waypoints.
        Returns (matched_lat, matched_lng, progress_km).
        """
        if not waypoints:
            return lat, lng, 0.0

        min_dist = float("inf")
        best_lat, best_lng = lat, lng
        best_progress = 0.0
        cum_dist = 0.0

        for i in range(len(waypoints) - 1):
            wp1 = waypoints[i]
            wp2 = waypoints[i + 1]
            seg_dist = calculate_haversine_distance(wp1["lat"], wp1["lng"], wp2["lat"], wp2["lng"])

            # Distance from point to wp1
            d1 = calculate_haversine_distance(lat, lng, wp1["lat"], wp1["lng"])
            if d1 < min_dist:
                min_dist = d1
                best_lat = wp1["lat"]
                best_lng = wp1["lng"]
                best_progress = cum_dist

            cum_dist += seg_dist

        # Check last waypoint
        d_last = calculate_haversine_distance(lat, lng, waypoints[-1]["lat"], waypoints[-1]["lng"])
        if d_last < min_dist:
            best_lat = waypoints[-1]["lat"]
            best_lng = waypoints[-1]["lng"]
            best_progress = cum_dist

        return best_lat, best_lng, round(best_progress, 2)

    def ingest_gps(self, bus_id: str, lat: float, lng: float, speed: float, heading: Optional[float] = None, ts: Optional[str] = None) -> Dict[str, Any]:
        """
        Ingests live phone GPS telemetry with map matching, heading direction, and jitter rejection.
        """
        bus = db.buses.find_one({"id": bus_id})
        if not bus:
            raise ValueError(f"Bus {bus_id} not registered")

        route = db.routes.find_one({"code": bus["route_code"]})
        waypoints = route["waypoints"] if route else []

        # 1. Jitter / Teleport Sanity Check (> 120 km/h or impossible jump)
        now = datetime.utcnow()
        now_str = ts or (now.isoformat() + "Z")

        if bus.get("data_source") == "LIVE_GPS" and bus.get("last_gps_ts") and bus.get("lat") and bus.get("lng"):
            prev_dist = calculate_haversine_distance(bus["lat"], bus["lng"], lat, lng)
            if speed > 120.0 or prev_dist > 3.0: # >3km jump between live pings is an outlier
                print(f"[PhoneGpsFeed Warning] Rejected GPS jitter for {bus_id}: dist={prev_dist}km, speed={speed}km/h")
                return bus


        # 2. Map-Matching
        matched_lat, matched_lng, progress_km = self.map_match_coordinate(lat, lng, waypoints)

        # 3. Heading / Direction Inference
        prev_progress = bus.get("progress_km", 0.0)
        direction = bus.get("direction", "UP")

        if heading is not None:
            # 0..180 Southbound -> UP, 180..360 Northbound -> DOWN
            if 90 <= heading <= 270:
                direction = "UP"
            else:
                direction = "DOWN"
        elif progress_km > prev_progress + 0.05:
            direction = "UP"
        elif progress_km < prev_progress - 0.05:
            direction = "DOWN"

        # 4. Seat Status & Occupancy mapping
        occ_pct = bus.get("occupancy_pct", 40)
        seat_status = "SEATS_AVAILABLE" if occ_pct < 70 else ("STANDING_ONLY" if occ_pct <= 90 else "FULL")

        update_payload = {
            "lat": matched_lat,
            "lng": matched_lng,
            "speed_kmh": round(speed, 1),
            "progress_km": progress_km,
            "direction": direction,
            "data_source": "LIVE_GPS",
            "last_gps_ts": now_str,
            "last_ping": now_str,
            "is_online": True,
            "heading": heading or (180.0 if direction == "UP" else 0.0),
            "seat_status": seat_status
        }

        db.buses.update_one({"id": bus_id}, {"$set": update_payload})
        db.gps_logs.insert_one({"bus_id": bus_id, "lat": lat, "lng": lng, "speed": speed, "ts": now_str})

        bus.update(update_payload)
        return bus

    def update_fleet(self) -> List[Dict[str, Any]]:
        """Checks for stale live feeds (>30s) and reverts them to SIMULATED."""
        now = datetime.utcnow()
        live_buses = db.buses.find({"data_source": "LIVE_GPS"})
        reverted = []

        for bus in live_buses:
            last_ts_str = bus.get("last_gps_ts") or bus.get("last_ping")
            if last_ts_str:
                try:
                    last_ts = datetime.fromisoformat(last_ts_str.replace("Z", "+00:00")).replace(tzinfo=None)
                    if (now - last_ts).total_seconds() > STALE_FEED_TIMEOUT_SEC:
                        print(f"[PhoneGpsFeed] Live feed for {bus['id']} stale (>30s). Falling back to SIMULATED.")
                        db.buses.update_one({"id": bus["id"]}, {
                            "$set": {
                                "data_source": "SIMULATED",
                                "is_online": False
                            }
                        })
                        bus["data_source"] = "SIMULATED"
                        bus["is_online"] = False
                        reverted.append(bus)
                except Exception as e:
                    pass

        return reverted

class LiveFeedProvider(TransitFeedProvider):
    """Stub adapter for GTFS-Realtime or JSON authority feeds."""
    def update_fleet(self) -> List[Dict[str, Any]]:
        return []

class TransitFeedManager:
    def __init__(self):
        self.simulated_feed = SimulatedFeed()
        self.phone_gps_feed = PhoneGpsFeed()

    def tick(self):
        """Executes a single simulation and stale-feed check cycle."""
        if DATA_MODE in ["SIMULATED", "HYBRID"]:
            self.simulated_feed.update_fleet()
        if DATA_MODE in ["LIVE", "HYBRID"]:
            self.phone_gps_feed.update_fleet()

feed_manager = TransitFeedManager()
