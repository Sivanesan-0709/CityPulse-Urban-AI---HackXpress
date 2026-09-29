import sys
import os
import tempfile
from pathlib import Path

# Ensure UTF-8 output on Windows console
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Isolated temporary data directory for test execution
_TEST_TEMP_DIR = tempfile.TemporaryDirectory()
os.environ["DATA_DIR"] = _TEST_TEMP_DIR.name

from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)

def get(path):
    res = client.get(path)
    assert res.status_code == 200, f"GET {path} returned status {res.status_code}: {res.text}"
    return res.json()

def post(path, payload):
    res = client.post(path, json=payload)
    assert res.status_code == 200, f"POST {path} returned status {res.status_code}: {res.text}"
    return res.json()

def run_tests():
    print("=" * 65)
    print("CITYPULSE URBAN AI - PHASE 3 REST API VERIFICATION SUITE")
    print("=" * 65)

    from app.seed_data import generate_seed_data
    generate_seed_data()

    # 1. System Health & Stats
    print("\n[1/7] Testing Health & Dashboard Stats APIs...")
    health = get("/api/health")
    assert health["status"] == "healthy", "Health check failed"
    print(f"  [PASS] GET /api/health -> Status: {health['status']} | City: {health['city']}")

    stats = get("/api/dashboard/stats")
    assert stats["active_buses"] == 20, "Active buses mismatch"
    assert stats["total_events_detected"] >= 100, "Events count mismatch"
    print(f"  [PASS] GET /api/dashboard/stats -> {stats['active_buses']} Buses | {stats['total_events_detected']} Events | {stats['bandwidth_saved_pct']}% Bandwidth Saved")

    # 2. Buses & Routes Endpoints
    print("\n[2/7] Testing Fleet & Route Endpoints...")
    buses = get("/api/buses")
    assert len(buses) == 20, f"Expected 20 buses, got {len(buses)}"
    bus1 = get("/api/buses/BUS-01")
    assert bus1["id"] == "BUS-01" and bus1["route_code"] == "21G", "BUS-01 lookup mismatch"
    print(f"  [PASS] GET /api/buses & GET /api/buses/BUS-01 -> {len(buses)} buses active")

    routes = get("/api/routes")
    assert len(routes) == 10, f"Expected 10 routes, got {len(routes)}"
    r21g = get("/api/routes/21G")
    assert r21g["code"] == "21G", "Route 21G lookup mismatch"
    print(f"  [PASS] GET /api/routes & GET /api/routes/21G -> {len(routes)} routes loaded")

    # 3. Events & Observation Multi-Bus APIs
    print("\n[3/7] Testing Urban Events & Observation Linkage...")
    events = get("/api/events")
    assert len(events) >= 100, "Total events count mismatch"
    
    filtered_defects = get("/api/events?category=ROAD_DEFECT")
    assert len(filtered_defects) > 0, "Filtered defects empty"
    
    pth1_obs = get("/api/events/PTH-001/observations")
    assert pth1_obs["event_id"] == "PTH-001" and pth1_obs["count"] >= 4, "PTH-001 observations count mismatch"
    print(f"  [PASS] GET /api/events (Filtered: {len(filtered_defects)} defects) & GET /api/events/PTH-001/observations ({pth1_obs['count']} bus records)")

    # 4. Bandwidth Analytics & Route Deduplication (Differentiator 2)
    print("\n[4/7] Testing Bandwidth & Deduplication Service (Diff 2)...")
    bw = get("/api/bandwidth")
    assert "bandwidth_saved_pct" in bw and bw["bandwidth_saved_pct"] > 40.0, "Bandwidth calculation error"
    print(f"  [PASS] GET /api/bandwidth -> Traditional: {bw['traditional_volume_mb']} MB | Optimized: {bw['optimized_volume_mb']} MB | Saved: {bw['bandwidth_saved_pct']}% ({bw['total_saved_mb']} MB)")

    cache = get("/api/bandwidth/route-cache/21G")
    assert cache["route_code"] == "21G" and cache["cached_event_count"] > 0, "Route cache 21G error"
    print(f"  [PASS] GET /api/bandwidth/route-cache/21G -> {cache['cached_event_count']} active cached events on bus")

    sim_dedup = post("/api/bandwidth/simulate-detection", {
        "bus_id": "BUS-05", "route_code": "21G", "event_id": "PTH-001", "lat": 13.0067, "lng": 80.2023
    })
    assert sim_dedup["is_duplicate_suppressed"] is True, "Expected duplicate suppression for cached PTH-001 on Route 21G"
    print(f"  [PASS] POST /api/bandwidth/simulate-detection -> {sim_dedup['action']} (Saved: {sim_dedup['bandwidth_saved_kb']} KB)")

    # 5. Post-Repair Verification Workflow (Differentiator 1)
    print("\n[5/7] Testing Automatic Post-Repair Verification (Diff 1)...")
    repairs = get("/api/repairs")
    assert len(repairs) >= 4, "Repairs list error"
    print(f"  [PASS] GET /api/repairs -> {len(repairs)} work orders")

    comp_res = post("/api/repairs/WO-891/complete", {})
    assert comp_res["status"] == "REPAIR_COMPLETED", "Repair complete status mismatch"
    print(f"  [PASS] POST /api/repairs/WO-891/complete -> Status: {comp_res['status']} | Next: {comp_res['next_step']}")

    verify_res = post("/api/repairs/WO-891/verify", {"force_success": True})
    assert verify_res["repair_status"] == "REPAIR_VERIFIED" and verify_res["confidence"] > 95.0, "Repair verification failed"
    print(f"  [PASS] POST /api/repairs/WO-891/verify (Success) -> Status: {verify_res['repair_status']} | Confidence: {verify_res['confidence']}%")

    verify_fail = post("/api/repairs/WO-891/verify", {"force_success": False})
    assert verify_fail["repair_status"] == "REPAIR_FAILED_REOPENED", "Repair failure reopening mismatch"
    print(f"  [PASS] POST /api/repairs/WO-891/verify (Failure) -> Status: {verify_fail['repair_status']} | Confidence: {verify_fail['confidence']}%")

    # 6. Causality Chains & Weather Cascades (Differentiator 3)
    print("\n[6/7] Testing Causality & Event Evolution (Diff 3)...")
    caus = get("/api/causality")
    assert len(caus) >= 3, "Causality chains count mismatch"
    print(f"  [PASS] GET /api/causality -> {len(caus)} urban causality chains")

    weather_sim = get("/api/causality/simulate-weather?rainfall_mmh=45")
    assert "traffic_density_increase_pct" in weather_sim, "Weather simulation error"
    print(f"  [PASS] GET /api/causality/simulate-weather -> Rain: 45mm/h -> Density: {weather_sim['traffic_density_increase_pct']} | Speed: {weather_sim['bus_average_speed_impact']} | Delay: {weather_sim['cumulative_route_delay']}")

    # 7. Traffic, Road Conditions, Incidents, Alerts & Simulation Triggers
    print("\n[7/7] Testing Traffic, Road Conditions, Incidents, Alerts & Simulation...")
    traffic = get("/api/traffic")
    assert len(traffic["congested_corridors"]) >= 4, "Traffic corridors error"
    print(f"  [PASS] GET /api/traffic -> {len(traffic['congested_corridors'])} monitored corridors | Fleet Speed: {traffic['avg_fleet_speed_kmh']} km/h")

    rc = get("/api/road-conditions")
    assert rc["citywide_average_health_score"] > 0, "Road health score error"
    print(f"  [PASS] GET /api/road-conditions -> City Average Health: {rc['citywide_average_health_score']}/100")

    incidents = get("/api/incidents")
    assert len(incidents) >= 3, "Incidents count error"
    print(f"  [PASS] GET /api/incidents -> {len(incidents)} incident logs (ANPR Plate: {incidents[0]['plate_number']})")

    alerts = get("/api/alerts")
    assert alerts["total_active_alerts"] > 0, "Alerts count error"
    print(f"  [PASS] GET /api/alerts -> {alerts['total_active_alerts']} active dispatch items ({alerts['critical_count']} Critical)")

    sim_trigger = post("/api/simulation/trigger", {"action": "step1_detect"})
    assert sim_trigger["action"] == "FULL_EVIDENCE_TRANSMITTED", "Simulation trigger failed"
    print(f"  [PASS] POST /api/simulation/trigger -> Action: step1_detect executed successfully")

    print("\n" + "=" * 65)
    print("ALL 16 PHASE 3 REST API TEST SUITES PASSED (100% WORKING)")
    print("=" * 65)

if __name__ == "__main__":
    try:
        run_tests()
        sys.exit(0)
    except Exception as e:
        print(f"\n[FAIL] API TEST FAILED: {e}")
        sys.exit(1)
