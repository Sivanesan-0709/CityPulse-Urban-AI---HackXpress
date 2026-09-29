"""
CityPulse Urban AI - Automatic Post-Repair Verification Service
SIH 2026 Problem Statement ID: 26124 - Differentiator 1
"""

from typing import Dict, Any, Optional
from datetime import datetime
from app.database import db

class RepairVerificationService:
    @staticmethod
    def get_repair_orders():
        return db.repairs.find()

    @staticmethod
    def mark_repair_completed(work_order_id: str) -> Dict[str, Any]:
        """Authority user marks repair as completed. System queues autonomous fleet re-scan."""
        repair = db.repairs.find_one({"id": work_order_id})
        if not repair:
            return {"success": False, "error": f"Work order {work_order_id} not found"}
        
        event_id = repair["event_id"]
        now = datetime.now().isoformat() + "Z"
        
        db.repairs.update_one({"id": work_order_id}, {
            "$set": {
                "status": "REPAIR_COMPLETED",
                "completion_date": now,
                "rescan_bus_id": "BUS-15",
                "verification_result": "QUEUED_FOR_RESCAN"
            }
        })
        
        db.events.update_one({"id": event_id}, {
            "$set": {
                "repair_status": "REPAIR_COMPLETED",
                "updated_at": now
            }
        })
        
        return {
            "success": True,
            "work_order_id": work_order_id,
            "event_id": event_id,
            "status": "REPAIR_COMPLETED",
            "next_step": "BUS_RESCAN_QUEUED",
            "assigned_rescan_bus": "BUS-15"
        }

    @staticmethod
    def simulate_bus_rescan(work_order_id: str, force_success: bool = True) -> Dict[str, Any]:
        """
        Subsequent bus travels through GPS location and Onboard Edge AI checks road again.
        If no defect detected: STATUS = REPAIR_VERIFIED (Green)
        If defect still detected: STATUS = REPAIR_FAILED_REOPENED (Red)
        """
        repair = db.repairs.find_one({"id": work_order_id})
        if not repair:
            # Fallback to finding by event_id
            repair = db.repairs.find_one({"event_id": work_order_id})
            if not repair:
                return {"success": False, "error": f"Work order or event {work_order_id} not found"}
                
        work_order_id = repair["id"]
        event_id = repair["event_id"]
        now = datetime.now().isoformat() + "Z"
        
        if force_success:
            confidence = 96.4
            new_status = "REPAIR_VERIFIED"
            result_code = "VERIFIED_CLEAN"
            ai_detection = "Pothole no longer detected. Road surface smooth."
            
            # Update database
            db.repairs.update_one({"id": work_order_id}, {
                "$set": {
                    "status": new_status,
                    "rescan_date": now,
                    "rescan_bus_id": "BUS-15",
                    "verification_confidence": confidence,
                    "verification_result": result_code
                }
            })
            db.events.update_one({"id": event_id}, {
                "$set": {
                    "repair_status": new_status,
                    "is_critical": False,
                    "confidence": confidence,
                    "updated_at": now
                }
            })
        else:
            confidence = 91.2
            new_status = "REPAIR_FAILED_REOPENED"
            result_code = "FAILED_STILL_PRESENT"
            ai_detection = "Pothole still detected (Depth 8.5cm). Defect persists."
            
            # Update database
            db.repairs.update_one({"id": work_order_id}, {
                "$set": {
                    "status": new_status,
                    "rescan_date": now,
                    "rescan_bus_id": "BUS-15",
                    "verification_confidence": confidence,
                    "verification_result": result_code
                }
            })
            db.events.update_one({"id": event_id}, {
                "$set": {
                    "repair_status": "REPAIR_FAILED_REOPENED",
                    "severity": "CRITICAL",
                    "is_critical": True,
                    "confidence": confidence,
                    "updated_at": now
                }
            })
            
        return {
            "success": True,
            "work_order_id": work_order_id,
            "event_id": event_id,
            "rescan_bus_id": "BUS-15",
            "rescan_timestamp": now,
            "ai_verification_result": ai_detection,
            "confidence": confidence,
            "repair_status": new_status,
            "is_success": force_success
        }
