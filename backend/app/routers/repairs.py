from fastapi import APIRouter, HTTPException, Body
from typing import Optional, Dict, Any
from app.services.repair_verification_service import RepairVerificationService
from app.database import db

router = APIRouter(prefix="/api/repairs", tags=["Repairs & Post-Repair Verification"])

@router.get("")
async def list_repair_orders(status: Optional[str] = None):
    query = {}
    if status:
        query["status"] = status.upper()
    return db.repairs.find(query)

@router.post("/{work_order_id}/complete")
async def mark_repair_complete(work_order_id: str):
    res = RepairVerificationService.mark_repair_completed(work_order_id.upper())
    if not res.get("success"):
        raise HTTPException(status_code=404, detail=res.get("error"))
    return res

@router.post("/{work_order_id}/verify")
async def verify_repair(
    work_order_id: str,
    payload: Dict[str, Any] = Body(default={"force_success": True})
):
    force_success = payload.get("force_success", True)
    res = RepairVerificationService.simulate_bus_rescan(work_order_id.upper(), force_success=force_success)
    if not res.get("success"):
        raise HTTPException(status_code=404, detail=res.get("error"))
    return res
