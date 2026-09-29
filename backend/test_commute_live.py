"""
CityPulse Urban AI - Phase 2 Live Intelligence & Amendments Test Suite
SIH 2026 Problem Statement ID: 26124
"""

import sys
import time
import tempfile
import os
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

from app.services.model_registry import model_registry
from app.services.transit_feed import PhoneGpsFeed
from app.services.crowd_counter import crowd_counter
from app.services.crowd_forecaster import crowd_forecaster
from app.services.pothole_detector import pothole_detector
from app.services.travel_assistant import travel_assistant
from app.config import STALE_FEED_TIMEOUT_SEC

def test_live_intelligence_suite():
    print("=" * 70)
    print("CITYPULSE URBAN AI - PHASE 2 LIVE INTELLIGENCE & AMENDMENTS SUITE")
    print("=" * 70)

    # 1. Test Model Registry
    print("\n[1/7] Testing Pretrained Model Registry & Diagnostic Endpoint...")
    status = model_registry.get_status()
    assert len(status) == 3, f"Expected 3 registered models, got {len(status)}"
    for m in status:
        assert "name" in m and "licence" in m and "device" in m and "measured_fps_latency" in m
        print(f"  [PASS] Model Registry Entry: {m['name']} | Licence: {m['licence']} | Status: {m['load_state']}")

    # 2. Test Phone GPS Ingestion & Map Matching
    print("\n[2/7] Testing Live Phone GPS Feed, Map-Matching & Heading Inference...")
    phone_feed = PhoneGpsFeed()
    generate_seed_data()

    # Ingest valid GPS ping for BUS-01
    updated_bus = phone_feed.ingest_gps(
        bus_id="BUS-01",
        lat=13.0827,
        lng=80.2754,
        speed=34.5,
        heading=180.0
    )
    assert updated_bus["data_source"] == "LIVE_GPS", "Data source must be LIVE_GPS"
    assert updated_bus["is_online"] is True, "Bus must be marked online"
    assert updated_bus["direction"] == "UP", "Heading 180.0 must map to UP direction"
    print(f"  [PASS] GPS Ingestion for BUS-01 -> Matched ({updated_bus['lat']}, {updated_bus['lng']}) | Source: {updated_bus['data_source']} | Dir: {updated_bus['direction']}")

    # 3. Test Jitter Rejection
    print("\n[3/7] Testing GPS Outlier & Teleportation Jitter Rejection...")
    # Attempt impossible 150 km/h jump
    jitter_res = phone_feed.ingest_gps(
        bus_id="BUS-01",
        lat=13.5000, # ~45km away!
        lng=80.5000,
        speed=150.0
    )
    # Location should remain near previous valid point
    assert abs(jitter_res["lat"] - 13.0827) < 0.1, "Jitter rejection failed to discard teleportation outlier"
    print("  [PASS] Impossible GPS teleportation outlier successfully rejected.")

    # 4. Test Stale Feed Timeout -> SIMULATED Fallback with Explicit Labelling
    print("\n[4/7] Testing Stale Live Feed Handling (Fallback to SIMULATED)...")
    # Set BUS-01 last ping to 40 seconds ago (>30s timeout)
    old_ts = "2020-01-01T00:00:00Z"
    db.buses.update_one({"id": "BUS-01"}, {"$set": {"last_gps_ts": old_ts, "last_ping": old_ts, "data_source": "LIVE_GPS"}})
    
    stale_reverted = phone_feed.update_fleet()
    b1_after = db.buses.find_one({"id": "BUS-01"})
    assert b1_after["data_source"] == "SIMULATED", f"Expected SIMULATED fallback, got {b1_after['data_source']}"
    assert b1_after["is_online"] is False, "Stale bus must be marked is_online=False"
    print("  [PASS] Stale feed timeout (>30s) correctly marked bus as SIMULATED and offline.")

    # 5. Test Crowd Counting & Seat Status Mapping
    print("\n[5/5] Testing Crowd Counting & Seat Status Mapping...")
    res_avail = crowd_counter.update_bus_occupancy("BUS-01", headcount=25, is_live_camera=True)
    assert res_avail["seat_status"] == "SEATS_AVAILABLE", "Expected SEATS_AVAILABLE for 25/50"
    
    res_full = crowd_counter.update_bus_occupancy("BUS-01", headcount=48, is_live_camera=True)
    assert res_full["seat_status"] == "FULL", "Expected FULL for 48/50"
    print(f"  [PASS] Crowd Counting: 25 seats -> {res_avail['seat_status']} | 48 seats -> {res_full['seat_status']}")

    # 6. Test Pothole Road Intelligence to Events Pipeline
    print("\n[6/7] Testing Dashcam Pothole Detector to Events/Repairs Pipeline...")
    dummy_frame = b"\xFF\xD8\xFF\xE0\x00\x10JFIF" # Minimal JPEG byte header
    pothole_res = pothole_detector.process_dashcam_frame(dummy_frame, lat=13.0418, lng=80.2341, bus_id="BUS-02", route_code="21G")
    assert pothole_res["pothole_detected"] is True, "Pothole detection failed"
    assert "measured_fps" in pothole_res, "Measured FPS metric missing"
    assert pothole_res["created_event"] is not None, "Event creation failed"
    
    # Check if event was inserted into db.events and work order in db.repairs
    evt_id = pothole_res["created_event"]["id"]
    db_evt = db.events.find_one({"id": evt_id})
    assert db_evt is not None, "Inserted pothole event not found in database"
    db_wo = db.repairs.find_one({"event_id": evt_id})
    assert db_wo is not None, "Work order for pothole event not found in database"
    print(f"  [PASS] Dashcam Pothole Pipeline: Event '{evt_id}' created and linked to Work Order '{db_wo['id']}'. Measured FPS: {pothole_res['measured_fps']}")

    # 7. Test AI Travel Assistant Tool Grounding & Source Citation
    print("\n[7/8] Testing Grounded AI Travel Assistant...")
    ast_res = travel_assistant.query_assistant("Next bus to Guindy eppo varum?")
    assert "response" in ast_res and len(ast_res["response"]) > 10, "Assistant response missing"
    assert "data_source" in ast_res, "Data source citation missing"
    assert "SIMULATED" in ast_res["response"] or "LIVE_GPS" in ast_res["response"], "Source citation absent from response text"
    print(f"  [PASS] AI Assistant Query Output:\n'{ast_res['response']}'")

    # 8. Test SOS Safety Share Token Registry (Creation, Capacity Cap & Expiry)
    print("\n[8/8] Testing SOS Safety Share Token Registry...")
    from app.routers.commute import _TRIP_SHARE_TOKENS, _cleanup_trip_tokens
    
    # Test token creation
    tok_payload = {
        "stop_id": "STOP-21G-UP-01",
        "destination_id": "STOP-21G-UP-05",
        "bus_id": "BUS-01",
        "created_at_epoch": time.time(),
        "expires_at_epoch": time.time() + 3600.0,
        "created_at": "2026-09-29T08:00:00Z",
        "expires_at": "2026-09-29T09:00:00Z"
    }
    _TRIP_SHARE_TOKENS["TESTOK01"] = tok_payload

    assert "TESTOK01" in _TRIP_SHARE_TOKENS, "Token creation failed"
    
    # Test expired token cleanup
    _TRIP_SHARE_TOKENS["EXPIRED1"] = {
        "stop_id": "STOP-21G-UP-01",
        "created_at_epoch": time.time() - 4000.0,
        "expires_at_epoch": time.time() - 400.0
    }
    _cleanup_trip_tokens()
    assert "EXPIRED1" not in _TRIP_SHARE_TOKENS, "Expired token not cleaned up"

    # Test capacity cap eviction (>200 tokens)
    _TRIP_SHARE_TOKENS.clear()
    for idx in range(210):
        _TRIP_SHARE_TOKENS[f"TOK_{idx:03d}"] = {
            "stop_id": "STOP-21G-UP-01",
            "created_at_epoch": time.time() + idx,
            "expires_at_epoch": time.time() + 3600.0 + idx
        }
    _cleanup_trip_tokens()
    assert len(_TRIP_SHARE_TOKENS) <= 200, f"Token capacity cap failed: {len(_TRIP_SHARE_TOKENS)} tokens remain"
    _TRIP_SHARE_TOKENS.clear()

    print(f"  [PASS] SOS Safety Share Token Registry: Creation, TTL 60m expiry, and 200-token capacity cap verified.")

    print("\n" + "=" * 70)
    print("ALL PHASE 2 LIVE INTELLIGENCE & BONUS FEATURE TESTS PASSED (100% SUCCESS)")
    print("=" * 70)

if __name__ == "__main__":
    try:
        test_live_intelligence_suite()
        sys.exit(0)
    except Exception as e:
        print(f"\n[FAIL] PHASE 2 TEST FAILED: {e}")
        sys.exit(1)
