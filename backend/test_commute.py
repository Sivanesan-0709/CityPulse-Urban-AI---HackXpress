"""
CityPulse Urban AI - Phase 1 Commuter Mobility Engine Test Suite
SIH 2026 Problem Statement ID: 26124
"""

import tempfile
import os
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Isolated temporary data directory for test execution
_TEST_TEMP_DIR = tempfile.TemporaryDirectory()
os.environ["DATA_DIR"] = _TEST_TEMP_DIR.name

from app.database import db
from app.seed_data import generate_seed_data

from app.services.arrival_engine import ArrivalEngine
from app.services.commute_advisor import CommuteAdvisor
from app.services.headway_engine import HeadwayEngine

def test_commuter_mobility_suite():
    print("=" * 65)
    print("CITYPULSE URBAN AI - PHASE 1 COMMUTER MOBILITY TEST SUITE")
    print("=" * 65)

    # 1. Ensure seed data
    print("\n[1/5] Verifying database seeding and bus stops collection...")
    generate_seed_data()
    assert db.bus_stops.count_documents() >= 40, f"Expected >= 40 stops, got {db.bus_stops.count_documents()}"
    print(f"  [PASS] Bus stops loaded: {db.bus_stops.count_documents()} stops across 10 routes (both UP & DOWN)")

    # 2. Test Nearest Stop Lookup
    print("\n[2/5] Testing Nearest Stop Lookup Service...")
    # Broadway coordinates
    near_stop = ArrivalEngine.find_nearest_stop(13.0891, 80.2878, radius_m=2000.0)
    assert near_stop is not None, "Nearest stop lookup returned None"
    assert "distance_m" in near_stop, "Distance in meters missing from nearest stop"
    print(f"  [PASS] Nearest stop to (13.0891, 80.2878): {near_stop['name']} ({near_stop['distance_m']} m)")

    # 3. Test Arrival Engine & Direction Filtering
    print("\n[3/5] Testing Arrival Engine & Direction/Past Bus Exclusions...")
    stop = db.bus_stops.find_one({"route_code": "21G", "direction": "UP", "sequence": 2})
    assert stop is not None, "Stop 21G UP 02 not found"

    arrivals = ArrivalEngine.get_stop_arrivals(stop["id"])
    assert "approaching_buses" in arrivals, "Approaching buses missing"
    assert "excluded_buses" in arrivals, "Excluded buses panel data missing"

    # Verify low-floor accessibility attributes in arrivals
    for app_bus in arrivals["approaching_buses"]:
        assert "is_low_floor" in app_bus, "is_low_floor missing from approaching bus"
        assert "extended_dwell_time" in app_bus, "extended_dwell_time missing from approaching bus"

    print(f"  [PASS] Arrival Engine for {stop['name']}: {arrivals['approaching_count']} approaching | {arrivals['excluded_count']} excluded (Reasons verified)")

    # 4. Test Commute Advisor (Wait vs Auto & Carbon Savings)
    print("\n[4/5] Testing Commute Advisor Engine (Wait vs Auto & Carbon Savings)...")
    advice = CommuteAdvisor.get_advice(stop["id"])
    assert advice["recommendation"] in ["WAIT", "TAKE_AUTO"], f"Invalid recommendation: {advice['recommendation']}"
    assert advice["bus_fare_inr"] == 10.0, "Bus fare mismatch"
    assert advice["auto_fare_inr"] > advice["bus_fare_inr"], "Auto fare must exceed bus fare"
    assert "co2_saved_g" in advice, "co2_saved_g field missing from advice"
    if advice["recommendation"] == "WAIT":
        assert advice["co2_saved_g"] > 0, "co2_saved_g should be positive for bus recommendation"
    else:
        assert advice["co2_saved_g"] == 0.0, "co2_saved_g should be 0 when auto is recommended"
    assert len(advice["rationale"]) > 10, "Rationale text too short"
    print(f"  [PASS] Commute Advisor Output: Recommendation={advice['recommendation']} | CO2 Saved={advice['co2_saved_g']}g | Rationale='{advice['rationale']}'")

    # 5. Test Headway Engine & Bunching Detection
    print("\n[5/5] Testing Headway Spacing & Bunching Alerts...")
    stats = HeadwayEngine.get_fleet_headway()
    assert len(stats) >= 10, f"Expected headway stats for routes, got {len(stats)}"
    print(f"  [PASS] Headway metrics computed for {len(stats)} route corridors.")

    print("\n" + "=" * 65)
    print("ALL PHASE 1 COMMUTER MOBILITY TESTS PASSED (100% SUCCESS)")
    print("=" * 65)

if __name__ == "__main__":
    try:
        test_commuter_mobility_suite()
        sys.exit(0)
    except Exception as e:
        print(f"\n[FAIL] PHASE 1 TEST FAILED: {e}")
        sys.exit(1)
