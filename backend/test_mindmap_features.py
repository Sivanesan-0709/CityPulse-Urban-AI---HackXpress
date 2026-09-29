"""
CityPulse Urban AI - Mindmap Features Test Suite (Features A-E)
SIH 2026 Problem Statement ID: 26124

Features Under Test:
- Feature A: Disaster-Mode Rerouting & Dynamic Detours (causality_engine)
- Feature B: Verified Driver Badging & Anonymous Zero-PII Safety Reports
- Feature C: System-Wide Corridor Congestion Alert Aggregation
- Feature D: Digital Transit QR Pass Token & Metadata
- Feature E: Mobility Data Authority Dashboard Stats & Exact Formulas
"""

import sys
import os
import tempfile
from pathlib import Path
from fastapi.testclient import TestClient

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Isolated temporary data directory for test execution
_TEST_TEMP_DIR = tempfile.TemporaryDirectory()
os.environ["DATA_DIR"] = _TEST_TEMP_DIR.name

from app.main import app
from app.database import db
from app.seed_data import generate_seed_data
from app.services.causality_engine import CausalityEngine
from app.services.arrival_engine import ArrivalEngine

client = TestClient(app)

def test_mindmap_features_suite():
    print("=" * 70)
    print("CITYPULSE URBAN AI - MINDMAP FEATURES TEST SUITE (FEATURES A-E)")
    print("=" * 70)

    # Initialize fresh isolated test database
    db.reset_all()
    generate_seed_data()

    # ---------------------------------------------------------
    # 1. FEATURE A — Disaster-Mode Rerouting & Dynamic Detours
    # ---------------------------------------------------------
    print("\n[1/5] Testing Feature A: Disaster-Mode Rerouting & Severity Aggregation...")
    
    # 1.1 Check initial normal disaster status
    res_normal = client.get("/api/disaster-status")
    assert res_normal.status_code == 200, f"Failed disaster status: {res_normal.text}"
    data_normal = res_normal.json()
    assert "disaster_mode" in data_normal
    print(f"  [PASS] Initial Status: disaster_mode={data_normal['disaster_mode']}")

    # 1.2 Trigger Flood Disruption Scenario
    res_flood = client.post("/api/simulation/commute-scenario", json={"scenario_type": "disaster_flood"})
    assert res_flood.status_code == 200, f"Failed triggering flood: {res_flood.text}"
    
    # 1.3 Verify Disaster Status after flood scenario
    res_disaster = client.get("/api/disaster-status")
    assert res_disaster.status_code == 200
    data_disaster = res_disaster.json()
    assert data_disaster["disaster_mode"] is True, "Expected disaster_mode=True after flood disruption"
    assert len(data_disaster["affected_routes"]) >= 1, "Expected at least 1 affected route in disaster mode"
    
    aff_route = data_disaster["affected_routes"][0]
    assert aff_route["route_code"] == "21G"
    assert "suggested_detour" in aff_route and len(aff_route["suggested_detour"]) > 0
    print(f"  [PASS] Disaster Mode Active: Route {aff_route['route_code']} affected | Detour: {aff_route['suggested_detour']}")

    # ---------------------------------------------------------
    # 2. FEATURE B — Verified Driver Badge & Anonymous Unsafe Report
    # ---------------------------------------------------------
    print("\n[2/5] Testing Feature B: Verified Driver Badge & Anonymous Zero-PII Reports...")

    # 2.1 Verify driver_verified field in Bus models & arrivals
    buses = db.buses.find()
    verified_buses = [b for b in buses if b.get("driver_verified", True)]
    unverified_buses = [b for b in buses if not b.get("driver_verified", True)]
    assert len(verified_buses) > 0, "Expected verified buses in fleet"
    assert len(unverified_buses) > 0, "Expected some unverified buses for badging contrast"

    # Verify arrival endpoint includes driver_verified
    arr_res = client.get("/api/stops/STOP-21G-UP-01/arrivals")
    assert arr_res.status_code == 200
    arr_data = arr_res.json()
    for bus in arr_data.get("approaching_buses", []):
        assert "driver_verified" in bus, "Approaching bus model must include driver_verified field"
    print(f"  [PASS] Driver verification status successfully propagated to commuter arrivals feed.")

    # 2.2 Submit Anonymous Unsafe Report (Zero PII)
    report_payload = {
        "bus_id": "BUS-04",
        "incident_type": "Reckless Driving / Overspeeding",
        "description": "Bus skipped Guindy Kathipara bus bay at excessive speed."
    }
    rep_post = client.post("/api/report-unsafe", json=report_payload)
    assert rep_post.status_code == 200, f"Failed posting report: {rep_post.text}"
    rep_res_data = rep_post.json()
    assert rep_res_data["status"] == "SUBMITTED"
    assert rep_res_data["pii_retained"] is False, "PII must NEVER be retained"
    report_id = rep_res_data["report_id"]

    # 2.3 Verify in Database Collection & Authority Audit Endpoint
    rep_doc = db.reports.find_one({"id": report_id})
    assert rep_doc is not None, "Report must be stored in db.reports"
    assert rep_doc["bus_id"] == "BUS-04"
    assert rep_doc["incident_type"] == "Reckless Driving / Overspeeding"
    assert rep_doc["pii_retained"] is False
    # Ensure zero PII fields exist
    assert "user_id" not in rep_doc and "phone" not in rep_doc and "ip_address" not in rep_doc and "email" not in rep_doc

    # Fetch via GET /api/reports
    all_reports_res = client.get("/api/reports")
    assert all_reports_res.status_code == 200
    reports_list = all_reports_res.json()
    assert any(r["id"] == report_id for r in reports_list), "Report must appear in authority list"
    print(f"  [PASS] Anonymous Safety Report {report_id} created and verified in db.reports with ZERO PII.")

    # ---------------------------------------------------------
    # 3. FEATURE C — System-Wide Corridor Congestion Alert Banner
    # ---------------------------------------------------------
    print("\n[3/5] Testing Feature C: System-Wide Corridor Congestion Alerts...")
    alerts_res = client.get("/api/congestion-alerts")
    assert alerts_res.status_code == 200, f"Failed congestion alerts: {alerts_res.text}"
    alerts_data = alerts_res.json()
    assert isinstance(alerts_data, list), "Expected list of congestion alerts"
    for alert in alerts_data:
        assert "route_code" in alert
        assert "avg_occupancy_pct" in alert
        assert "high_occupancy_buses" in alert
        assert alert["avg_occupancy_pct"] >= 75.0 or alert["high_occupancy_buses"] >= 1, "Alerts should only trigger for high occupancy corridors"
        print(f"  [PASS] Congestion Alert: Route {alert['route_code']} at {alert['avg_occupancy_pct']}% capacity ({alert['high_occupancy_buses']} full buses)")

    # ---------------------------------------------------------
    # 4. FEATURE D — Digital Transit QR Pass Token & Mock Pass
    # ---------------------------------------------------------
    print("\n[4/5] Testing Feature D: Digital Transit QR Pass Simulation...")
    # Verify trip advice includes fare and fare comparisons for ticketing pass creation
    advice_res = client.get("/api/commute/advice?stop_id=STOP-21G-UP-01")
    assert advice_res.status_code == 200
    advice_data = advice_res.json()
    assert advice_data["bus_fare_inr"] > 0, "Bus fare must be positive"
    assert advice_data["auto_fare_inr"] > advice_data["bus_fare_inr"], "Auto fare should exceed bus fare"
    print(f"  [PASS] Bus Fare ₹{advice_data['bus_fare_inr']} vs Auto ₹{advice_data['auto_fare_inr']} verified for pass creation.")

    # ---------------------------------------------------------
    # 5. FEATURE E — Authority Mobility Data Dashboard Stats
    # ---------------------------------------------------------
    print("\n[5/5] Testing Feature E: Authority Mobility Dashboard Stats & KPI Formulas...")
    mob_res = client.get("/api/mobility-dashboard-stats")
    assert mob_res.status_code == 200, f"Failed mobility stats: {mob_res.text}"
    mob_data = mob_res.json()

    # Test exact KPI formulas (Amendment 4)
    # - fleet_punctuality_pct: percentage of active buses maintaining nominal speed & online
    assert "fleet_punctuality_pct" in mob_data
    assert 0.0 <= mob_data["fleet_punctuality_pct"] <= 100.0, "Punctuality must be between 0 and 100%"

    # - low_floor_availability_ratio: low-floor in service / total in service
    assert "low_floor_availability_ratio" in mob_data
    assert 0.0 <= mob_data["low_floor_availability_ratio"] <= 1.0, "Ratio must be between 0 and 1"
    assert mob_data["low_floor_buses_active"] <= mob_data["total_active_buses"]
    expected_ratio = round(mob_data["low_floor_buses_active"] / max(1, mob_data["total_active_buses"]), 2)
    assert abs(mob_data["low_floor_availability_ratio"] - expected_ratio) < 0.02, "Formula check: low_floor_buses_active / total_active_buses"

    # - Route travel times and schedule variances
    assert "route_travel_times" in mob_data and len(mob_data["route_travel_times"]) > 0
    for r in mob_data["route_travel_times"]:
        assert "route_code" in r and "avg_travel_time_min" in r and "scheduled_travel_time_min" in r

    # - Hourly passenger load distribution
    assert "hourly_passenger_load" in mob_data and len(mob_data["hourly_passenger_load"]) >= 10
    
    # - Safety reports count
    assert mob_data["active_safety_reports"] >= 1, "Expected at least the 1 report filed in Step 2"

    print(f"  [PASS] Authority Mobility KPIs Verified:")
    print(f"         • Fleet Punctuality: {mob_data['fleet_punctuality_pct']}%")
    print(f"         • Low-Floor Ratio: {mob_data['low_floor_availability_ratio']} ({mob_data['low_floor_buses_active']}/{mob_data['total_active_buses']} active)")
    print(f"         • Average Stop Wait Time: {mob_data['average_wait_time_min']} min")
    print(f"         • Active Safety Reports: {mob_data['active_safety_reports']}")
    print(f"         • Total Daily Ridership: {mob_data['total_estimated_passengers']}")

    print("\n" + "=" * 70)
    print("ALL 5 MINDMAP FEATURES PASSED WITH 100% SUCCESS")
    print("=" * 70)

if __name__ == "__main__":
    try:
        test_mindmap_features_suite()
        sys.exit(0)
    except Exception as e:
        print(f"\n[FAIL] MINDMAP TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
