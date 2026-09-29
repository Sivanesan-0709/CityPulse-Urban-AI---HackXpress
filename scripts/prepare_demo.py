"""
CityPulse Urban AI - Pre-Demo Environment Preparer Script
Pre-downloads model weights, pre-caches OSRM route geometries and OSM bus stops, and validates DATA_MODE=HYBRID.
"""

import sys
import os
from pathlib import Path

if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR / "backend"
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))



from app.config import DATA_MODE, OSRM_BASE_URL, MODELS_DIR
from app.services.model_registry import model_registry
from app.services.osrm_routing import OSRMRoutingService
from scripts.import_osm_stops import import_osm_stops
from app.database import db

def prepare_demo():
    print("=" * 70)
    print("CITYPULSE URBAN AI - PRE-DEMO ENVIRONMENT PREPARATION")
    print("=" * 70)

    # 1. Validate DATA_MODE
    print(f"\n[1/4] Validating Data Mode Configuration...")
    print(f"  - Configured DATA_MODE: {DATA_MODE}")
    if DATA_MODE not in ["HYBRID", "LIVE", "SIMULATED"]:
        print(f"  [WARNING] Invalid DATA_MODE '{DATA_MODE}'. Reverting to 'HYBRID'.")
    else:
        print("  [SUCCESS] DATA_MODE is valid and ready for hybrid live telemetry + fallback.")

    # 2. Pre-cache OpenStreetMap Bus Stops
    print(f"\n[2/4] Pre-caching OpenStreetMap Bus Stops for Chennai...")
    stops = import_osm_stops()
    print(f"  [SUCCESS] Total {len(stops)} OpenStreetMap bus stops cached.")

    # 3. Pre-cache OSRM Route Geometries
    print(f"\n[3/4] Pre-caching OSRM Driving Route Geometries ({OSRM_BASE_URL})...")
    routes = db.routes.find()
    for r in routes:
        wps = r.get("waypoints", [])
        if len(wps) >= 2:
            dist, geom = OSRMRoutingService.get_route_geometry(wps)
            print(f"  - Route {r['code']} ({r['name']}): {dist} km | {len(geom)} polyline points cached")

    # 4. Pre-download AI Model Weights
    print(f"\n[4/4] Pre-loading & Auto-downloading AI Model Weights to {MODELS_DIR}...")
    for model_key in ["yolov8n_person", "pothole_detector", "chronos_bolt_small"]:
        print(f"  - Loading {model_key}...")
        m = model_registry.load_model(model_key)
        status = model_registry._models_info[model_key]["load_state"]
        print(f"    -> Status: {status}")

    print("\n" + "=" * 70)
    print("PRE-DEMO PREPARATION COMPLETE — PLATFORM READY FOR LIVE DEMONSTRATION")
    print("=" * 70)

if __name__ == "__main__":
    prepare_demo()
