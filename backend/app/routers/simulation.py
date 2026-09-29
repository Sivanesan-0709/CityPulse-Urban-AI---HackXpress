from fastapi import APIRouter, Body
from typing import Dict, Any
from app.services.deduplication_service import DeduplicationService
from app.services.repair_verification_service import RepairVerificationService
from app.services.causality_engine import CausalityEngine
from app.seed_data import generate_seed_data
from app.database import db
from datetime import datetime

router = APIRouter(prefix="/api/simulation", tags=["Simulation Engine"])

@router.post("/trigger")
async def trigger_simulation_action(payload: Dict[str, Any] = Body(...)):
    action = payload.get("action", "")
    now = datetime.now().isoformat() + "Z"
    
    if action == "step1_detect":
        # Step 1: Initial Detection of PTH-001 by BUS-01 (Full 4.8MB Media Upload)
        # Reset PTH-001 and WO-891 in DB
        db.events.update_one({"id": "PTH-001"}, {
            "$set": {
                "repair_status": "DETECTED",
                "observation_count": 1,
                "observing_buses": ["BUS-01"],
                "confidence": 97.4,
                "severity": "CRITICAL",
                "is_critical": True,
                "last_detected": now
            }
        })
        
        # Reset observations to just BUS-01
        db.event_observations.delete_many({"event_id": "PTH-001"})
        db.event_observations.insert_one({
            "id": f"OBS-{db.event_observations.count_documents() + 1:04d}",
            "event_id": "PTH-001",
            "bus_id": "BUS-01",
            "route_code": "21G",
            "timestamp": now,
            "lat": 13.0067,
            "lng": 80.2023,
            "confidence": 97.4,
            "camera_angle": "FRONT",
            "is_full_upload": True,
            "payload_size_kb": 4850.0
        })
        
        # Ensure WO-891 is in DETECTED state
        db.repairs.update_one({"id": "WO-891"}, {
            "$set": {
                "status": "DETECTED",
                "assigned_date": None,
                "completion_date": None,
                "rescan_bus_id": None,
                "rescan_date": None,
                "verification_confidence": None,
                "verification_result": None
            }
        })
        
        # Add PTH-001 into Route 21G Active Cache
        cache = db.route_event_cache.find_one({"route_code": "21G"})
        if cache:
            ids = list(set(cache.get("active_event_ids", []) + ["PTH-001"]))
            db.route_event_cache.update_one({"route_code": "21G"}, {"$set": {"active_event_ids": ids}})
            
        return {
            "step": 1,
            "action": "FULL_EVIDENCE_TRANSMITTED",
            "event_id": "PTH-001",
            "bus_id": "BUS-01",
            "route_code": "21G",
            "payload_size_kb": 4850.0,
            "description": "BUS-01 detected PTH-001 on Route 21G. Full 4.85 MB video evidence transmitted. Event added to Route 21G local cache."
        }
    
    elif action == "step2_dedup":
        # Step 2: BUS-05 encounters PTH-001 -> Matches Route Cache -> Suppress Upload
        # Add observation from BUS-05 (Metadata Only)
        db.event_observations.insert_one({
            "id": f"OBS-{db.event_observations.count_documents() + 1:04d}",
            "event_id": "PTH-001",
            "bus_id": "BUS-05",
            "route_code": "21G",
            "timestamp": now,
            "lat": 13.0067,
            "lng": 80.2023,
            "confidence": 96.8,
            "camera_angle": "FRONT",
            "is_full_upload": False,
            "payload_size_kb": 1.2
        })
        
        pth = db.events.find_one({"id": "PTH-001"})
        buses = list(set((pth.get("observing_buses", []) if pth else []) + ["BUS-05"]))
        db.events.update_one({"id": "PTH-001"}, {
            "$set": {
                "observation_count": len(buses),
                "observing_buses": buses,
                "last_detected": now
            }
        })
        
        return {
            "step": 2,
            "action": "METADATA_CONFIRMATION_ONLY",
            "event_id": "PTH-001",
            "bus_id": "BUS-05",
            "route_code": "21G",
            "payload_size_kb": 1.2,
            "bandwidth_saved_kb": 4848.8,
            "is_duplicate_suppressed": True,
            "description": "BUS-05 encountered PTH-001. Matched in Route 21G Cache: Full media suppressed, 1.2 KB confirmation sent."
        }
        
    elif action == "step3_multibus":
        # Step 3: BUS-08 and BUS-12 cross-verify
        for b_id in ["BUS-08", "BUS-12"]:
            db.event_observations.insert_one({
                "id": f"OBS-{db.event_observations.count_documents() + 1:04d}",
                "event_id": "PTH-001",
                "bus_id": b_id,
                "route_code": "21G",
                "timestamp": now,
                "lat": 13.0067,
                "lng": 80.2023,
                "confidence": 98.2,
                "camera_angle": "FRONT",
                "is_full_upload": False,
                "payload_size_kb": 1.1
            })
            
        pth = db.events.find_one({"id": "PTH-001"})
        buses = list(set((pth.get("observing_buses", []) if pth else []) + ["BUS-01", "BUS-05", "BUS-08", "BUS-12"]))
        db.events.update_one({"id": "PTH-001"}, {
            "$set": {
                "observation_count": len(buses),
                "observing_buses": buses,
                "confidence": 98.4,
                "last_detected": now
            }
        })
        
        return {
            "step": 3,
            "action": "MULTI_BUS_CONFIRMATION",
            "event_id": "PTH-001",
            "observation_count": 4,
            "observing_buses": ["BUS-01", "BUS-05", "BUS-08", "BUS-12"],
            "aggregate_confidence": 98.4,
            "description": "Cross-fleet verification confirmed PTH-001 across 4 buses. Aggregate confidence raised to 98.4%."
        }
        
    elif action == "step4_repaired":
        # Step 4: Authority marks repair completed -> Queued for autonomous re-scan
        return RepairVerificationService.mark_repair_completed("WO-891")
        
    elif action == "step5_verify_success":
        # Step 5: BUS-15 passes and re-scans -> Pothole gone -> REPAIR VERIFIED
        return RepairVerificationService.simulate_bus_rescan("WO-891", force_success=True)
        
    elif action == "step5_verify_failure":
        # Alternate Step 5b: Pothole still present -> ISSUE REOPENED
        return RepairVerificationService.simulate_bus_rescan("WO-891", force_success=False)
        
    elif action == "simulate_rain":
        return CausalityEngine.simulate_weather_cascade(45.0)
        
    elif action == "reset":
        generate_seed_data()
        return {"success": True, "message": "Simulation data reset to seed baseline"}
        
    return {"success": True, "action": action, "message": f"Simulated action {action} processed"}
