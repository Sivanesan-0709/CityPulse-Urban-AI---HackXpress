"""
CityPulse Urban AI - OSRM Routing Service
Interfaces with OSRM HTTP service for road network distances and polyline shapes.
"""

import math
import urllib.request
import json
from typing import List, Dict, Any, Tuple, Optional
from app.config import OSRM_BASE_URL

# In-memory routing cache
_ROUTE_CACHE: Dict[str, Dict[str, Any]] = {}

def calculate_haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculates straight-line haversine distance between two coordinates in km."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class OSRMRoutingService:
    @staticmethod
    def get_route_geometry(waypoints: List[Dict[str, float]]) -> Tuple[float, List[List[float]]]:
        """
        Returns (distance_km, geometry_latlngs) for a list of waypoints.
        Falls back gracefully to straight-line interpolation if OSRM is unreachable.
        """
        if not waypoints or len(waypoints) < 2:
            return 0.0, []

        cache_key = "|".join(f"{w['lat']:.4f},{w['lng']:.4f}" for w in waypoints)
        if cache_key in _ROUTE_CACHE:
            cached = _ROUTE_CACHE[cache_key]
            return cached["distance_km"], cached["geometry"]

        # Format coordinates for OSRM: lng,lat;lng,lat
        coord_str = ";".join(f"{w['lng']},{w['lat']}" for w in waypoints)
        url = f"{OSRM_BASE_URL.rstrip('/')}/route/v1/driving/{coord_str}?overview=full&geometries=geojson"

        try:
            req = urllib.request.Request(url, headers={"User-Agent": "CityPulse-UrbanAI/1.0"})
            with urllib.request.urlopen(req, timeout=3.0) as res:
                if res.status == 200:
                    data = json.loads(res.read().decode('utf-8'))
                    if data.get("code") == "Ok" and data.get("routes"):
                        route_info = data["routes"][0]
                        distance_km = round(route_info["distance"] / 1000.0, 2)
                        coords = route_info["geometry"]["coordinates"]
                        # OSRM returns [lng, lat], convert to [lat, lng]
                        latlng_geometry = [[c[1], c[0]] for c in coords]
                        
                        _ROUTE_CACHE[cache_key] = {
                            "distance_km": distance_km,
                            "geometry": latlng_geometry
                        }
                        return distance_km, latlng_geometry
        except Exception as e:
            # Silent fallback to haversine straight-line interpolation
            pass

        # Fallback: compute haversine distance & line points
        total_dist = 0.0
        geometry = []
        for idx, wp in enumerate(waypoints):
            geometry.append([wp["lat"], wp["lng"]])
            if idx > 0:
                prev = waypoints[idx - 1]
                total_dist += calculate_haversine_distance(prev["lat"], prev["lng"], wp["lat"], wp["lng"])

        total_dist = round(total_dist, 2)
        _ROUTE_CACHE[cache_key] = {"distance_km": total_dist, "geometry": geometry}
        return total_dist, geometry

    @staticmethod
    def check_health() -> Dict[str, Any]:
        """Checks connection to OSRM server or returns cache state."""
        cache_count = len(_ROUTE_CACHE)
        url = f"{OSRM_BASE_URL.rstrip('/')}/route/v1/driving/80.27,13.08;80.28,13.09?overview=false"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "CityPulse-UrbanAI/1.0"})
            with urllib.request.urlopen(req, timeout=2.0) as res:
                if res.status == 200:
                    return {"status": "ONLINE", "mode": "LIVE_OSRM", "cached_routes": cache_count, "base_url": OSRM_BASE_URL}
        except Exception:
            pass
        return {"status": "ONLINE" if cache_count > 0 else "STANDBY", "mode": "CACHED_FALLBACK", "cached_routes": cache_count, "base_url": OSRM_BASE_URL}

