"""
CityPulse Urban AI - Live Telemetry & Feed Router
Endpoints for live phone GPS ingestion, WebSocket stream, occupancy updates, crowd forecasting, AI assistant, and dashcam uploads.
"""

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, UploadFile, File, Form, Query, Body
from typing import List, Dict, Any, Optional
import json

from app.models import GpsFeedPayloadModel, OccupancyUpdateModel, AssistantQueryModel
from app.services.transit_feed import PhoneGpsFeed, feed_manager
from app.services.crowd_counter import crowd_counter
from app.services.crowd_forecaster import crowd_forecaster
from app.services.travel_assistant import travel_assistant
from app.services.pothole_detector import pothole_detector
from app.database import db

router = APIRouter(prefix="/api", tags=["Live Telemetry & Ingestion"])

# Connected WebSocket Clients
_WS_CLIENTS: List[WebSocket] = []

phone_gps_feed = PhoneGpsFeed()

@router.post("/feed/gps")
async def ingest_phone_gps(payload: GpsFeedPayloadModel):
    """
    Ingests live phone GPS telemetry from driver tracker (/tracker).
    Performs map-matching, heading direction inference, jitter rejection, and broadcasts telemetry.
    """
    try:
        updated_bus = phone_gps_feed.ingest_gps(
            bus_id=payload.bus_id,
            lat=payload.lat,
            lng=payload.lng,
            speed=payload.speed,
            heading=payload.heading,
            ts=payload.ts
        )

        # Broadcast telemetry to connected WebSockets
        ws_msg = json.dumps({"event": "GPS_UPDATE", "bus": updated_bus}, default=str)
        dead_clients = []
        for client in _WS_CLIENTS:
            try:
                await client.send_text(ws_msg)
            except Exception:
                dead_clients.append(client)
        for d in dead_clients:
            if d in _WS_CLIENTS:
                _WS_CLIENTS.remove(d)

        return {
            "status": "success",
            "bus_id": payload.bus_id,
            "data_source": "LIVE_GPS",
            "matched_location": {"lat": updated_bus["lat"], "lng": updated_bus["lng"]},
            "progress_km": updated_bus["progress_km"],
            "direction": updated_bus["direction"]
        }
    except ValueError as err:
        raise HTTPException(status_code=404, detail=str(err))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion error: {e}")

@router.websocket("/feed/ws")
async def websocket_gps_feed(websocket: WebSocket):
    """WebSocket endpoint streaming real-time fleet GPS updates to dashboard clients."""
    await websocket.accept()
    _WS_CLIENTS.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        if websocket in _WS_CLIENTS:
            _WS_CLIENTS.remove(websocket)

@router.post("/buses/{bus_id}/occupancy")
async def update_bus_occupancy(bus_id: str, payload: OccupancyUpdateModel):
    """Updates bus passenger headcount and maps to seat status."""
    try:
        res = crowd_counter.update_bus_occupancy(bus_id, payload.count, is_live_camera=True)
        return {
            "status": "success",
            "bus_id": bus_id,
            "occupancy_pct": res["occupancy_pct"],
            "seat_status": res["seat_status"],
            "data_source": "LIVE_CAMERA"
        }
    except ValueError as err:
        raise HTTPException(status_code=404, detail=str(err))

@router.get("/buses/{bus_id}/forecast")
async def get_bus_occupancy_forecast(bus_id: str):
    """Returns zero-shot crowd occupancy forecasts for +5, +10, and +15 min horizons."""
    bus = db.buses.find_one({"id": bus_id})
    if not bus:
        raise HTTPException(status_code=404, detail=f"Bus {bus_id} not found")
    return crowd_forecaster.forecast_occupancy(bus_id)

@router.post("/assistant/chat")
async def chat_with_travel_assistant(payload: AssistantQueryModel):
    """Grounded AI Travel Assistant endpoint supporting English and Tamil-English queries."""
    return travel_assistant.query_assistant(
        user_message=payload.message,
        stop_id=payload.stop_id,
        destination_id=payload.destination_id
    )

@router.post("/road-intelligence/dashcam-upload")
async def upload_dashcam_frame(
    file: UploadFile = File(...),
    lat: float = Form(13.0067),
    lng: float = Form(80.2023),
    bus_id: str = Form("BUS-01"),
    route_code: str = Form("21G")
):
    """
    Processes an uploaded dashcam image for potholes and pushes detections into events + repairs pipeline.
    Reports strictly measured performance metrics.
    """
    contents = await file.read()
    res = pothole_detector.process_dashcam_frame(contents, lat, lng, bus_id, route_code)
    return res
