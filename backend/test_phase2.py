"""
CityPulse Urban AI - Phase 2 Database & Seed Verification Test
SIH 2026 Problem Statement ID: 26124
"""

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
sys.path.insert(0, str(BASE_DIR))

# Isolated temporary data directory for test execution
_TEST_TEMP_DIR = tempfile.TemporaryDirectory()
os.environ["DATA_DIR"] = _TEST_TEMP_DIR.name

from app.database import db
from app.seed_data import generate_seed_data


def run_tests():
    print("=" * 60)
    print("CITYPULSE URBAN AI - PHASE 2 VERIFICATION SUITE")
    print("=" * 60)

    # 1. Test Seed Data Execution
    print("\n[1/5] Executing Seed Data Generator...")
    generate_seed_data()
    print("Seed execution finished without exceptions.")

    # 2. Check Document Counts
    print("\n[2/5] Checking Collection Counts & Integrity...")
    collections = {
        "buses": (db.buses, 20),
        "routes": (db.routes, 10),
        "events": (db.events, 108),
        "event_observations": (db.event_observations, 108),
        "route_event_cache": (db.route_event_cache, 10),
        "repairs": (db.repairs, 4),
        "incidents": (db.incidents, 3),
        "causality_chains": (db.causality_chains, 3),
        "bandwidth_metrics": (db.bandwidth_metrics, 1)
    }

    all_passed = True
    for name, (col, min_expected) in collections.items():
        count = col.count_documents()
        status = "PASS" if count >= min_expected else "FAIL"
        print(f"  - Collection [{name:20}]: {count:4d} records (Expected >= {min_expected}) -> {status}")
        if count < min_expected:
            all_passed = False

    assert all_passed, "Some collections did not meet minimum record counts!"

    # 3. Verify Multi-Bus Deduplication Seed (Key Requirement for Differentiator 2)
    print("\n[3/5] Verifying Multi-Bus Event Deduplication Dataset...")
    pth1 = db.events.find_one({"id": "PTH-001"})
    assert pth1 is not None, "PTH-001 not found in events collection!"
    assert pth1["observation_count"] == 4, f"PTH-001 observation count is {pth1['observation_count']}, expected 4"
    assert len(pth1["observing_buses"]) == 4, "PTH-001 observing buses list must have 4 buses"

    pth1_obs = db.event_observations.find({"event_id": "PTH-001"})
    assert len(pth1_obs) == 4, f"Expected 4 observation records for PTH-001, got {len(pth1_obs)}"
    
    full_uploads = [o for o in pth1_obs if o["is_full_upload"]]
    dedup_uploads = [o for o in pth1_obs if not o["is_full_upload"]]
    
    assert len(full_uploads) == 1, f"Expected exactly 1 full upload for PTH-001, got {len(full_uploads)}"
    assert len(dedup_uploads) == 3, f"Expected exactly 3 deduplicated lightweight confirmations, got {len(dedup_uploads)}"
    
    print("  [PASS] PTH-001 multi-bus deduplication verified:")
    print(f"    - Initial detection: {full_uploads[0]['bus_id']} (Full Upload: {full_uploads[0]['payload_size_kb']} KB)")
    for d in dedup_uploads:
        print(f"    - Route cache match: {d['bus_id']} (Metadata Only: {d['payload_size_kb']} KB)")

    # 4. Verify Route Cache Linkage
    print("\n[4/5] Verifying Route-Aware Cache Seed...")
    cache_21g = db.route_event_cache.find_one({"route_code": "21G"})
    assert cache_21g is not None, "Route 21G cache not found"
    assert "PTH-001" in cache_21g["active_event_ids"], "PTH-001 must be present in Route 21G cache"
    print(f"  [PASS] Route 21G local active cache contains {len(cache_21g['active_event_ids'])} active events (including PTH-001)")

    # 5. Verify Causality & Repair Work Orders
    print("\n[5/5] Verifying Causality Chains & Repair Workflows...")
    wo = db.repairs.find_one({"id": "WO-891"})
    assert wo is not None, "WO-891 for PTH-001 not found"
    assert wo["event_id"] == "PTH-001", "WO-891 must link to PTH-001"
    print(f"  [PASS] Work Order WO-891 linked to PTH-001 with status: {wo['status']}")

    chains = db.causality_chains.find()
    assert len(chains) >= 3, "Expected at least 3 causality chains"
    print(f"  [PASS] Found {len(chains)} Urban Causality Chains (Precipitation Inundation, Signal Outage, Pothole Degradation)")

    print("\n" + "=" * 60)
    print("ALL PHASE 2 DATABASE & SEED DATA TESTS PASSED (100% WORKING)")
    print("=" * 60)

if __name__ == "__main__":
    try:
        run_tests()
        sys.exit(0)
    except Exception as e:
        print(f"\n[FAIL] TEST FAILED: {e}")
        sys.exit(1)
