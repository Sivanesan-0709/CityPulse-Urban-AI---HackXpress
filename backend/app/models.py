"""
CityPulse Urban AI - Pydantic Data Models
SIH 2026 Problem Statement ID: 26124
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class BusModel(BaseModel):
    id: str = Field(..., example="BUS-01")
    route_id: str = Field(..., example="ROUTE-21G")
    route_code: str = Field(..., example="21G")
    route_name: str = Field(..., example="Broadway - Tambaram")
    lat: float = Field(..., example=13.0827)
    lng: float = Field(..., example=80.2707)
    speed_kmh: float = Field(..., example=32.4)
    status: str = Field(default="ACTIVE") # ACTIVE, IDLE, MAINTENANCE
    cameras_online: int = Field(default=5)
    total_cameras: int = Field(default=5)
    ai_status: str = Field(default="ONLINE") # ONLINE, DEGRADED, OFFLINE
    network_status: str = Field(default="5G_EXCELLENT")
    bandwidth_used_mb: float = Field(default=1.4)
    events_detected_count: int = Field(default=18)
    last_ping: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    
    # Extended Phase 1 & 2 Mobility fields
    direction: str = Field(default="UP", example="UP") # UP or DOWN
    progress_km: float = Field(default=0.0, example=4.5)
    next_stop_id: Optional[str] = Field(default=None, example="STOP-21G-UP-03")
    occupancy_pct: int = Field(default=40, example=40)
    seat_status: str = Field(default="SEATS_AVAILABLE", example="SEATS_AVAILABLE") # SEATS_AVAILABLE, STANDING_ONLY, FULL
    data_source: str = Field(default="SIMULATED", example="SIMULATED") # LIVE_GPS or SIMULATED
    last_gps_ts: Optional[str] = None
    heading: Optional[float] = None
    is_online: bool = True
    is_low_floor: bool = False
    extended_dwell_time: bool = False
    driver_verified: bool = True


class RouteWaypoint(BaseModel):
    lat: float
    lng: float
    name: Optional[str] = None

class RouteModel(BaseModel):
    id: str = Field(..., example="ROUTE-21G")
    code: str = Field(..., example="21G")
    name: str = Field(..., example="Broadway ↔ Tambaram")
    start_stop: str = Field(..., example="Broadway Bus Terminus")
    end_stop: str = Field(..., example="Tambaram Sanatorium")
    total_distance_km: float = Field(..., example=28.4)
    waypoints: List[RouteWaypoint] = []
    active_buses_count: int = Field(default=2)

class EventObservationModel(BaseModel):
    id: str
    event_id: str
    bus_id: str
    route_code: str
    timestamp: str
    lat: float
    lng: float
    confidence: float
    camera_angle: str # FRONT, REAR, LEFT, RIGHT, CABIN
    is_full_upload: bool = False
    payload_size_kb: float = 1.2 # 1.2 KB for metadata vs 4800 KB for full video/photo

class UrbanEventModel(BaseModel):
    id: str = Field(..., example="PTH-001")
    type: str = Field(..., example="POTHOLE") # POTHOLE, DAMAGED_ROAD, WATERLOGGING, MISSING_ZEBRA, MISSING_SIGN, DAMAGED_SIGNAL, CONGESTION, RASH_DRIVING, HIT_AND_RUN
    subtype: Optional[str] = "Severe Surface Depression"
    category: str = Field(default="ROAD_DEFECT") # ROAD_DEFECT, INFRASTRUCTURE, TRAFFIC, SAFETY, INCIDENT
    severity: str = Field(default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    severity_score: float = Field(default=84.0) # 0 to 100
    road_name: str = Field(..., example="Anna Salai, Guindy")
    lat: float = Field(..., example=13.0067)
    lng: float = Field(..., example=80.2023)
    first_detected: str
    last_detected: str
    observation_count: int = 1
    observing_buses: List[str] = []
    repair_status: str = "DETECTED" # DETECTED, ASSIGNED, REPAIR_IN_PROGRESS, REPAIR_COMPLETED, RESCAN_PENDING, REPAIR_VERIFIED, REPAIR_FAILED_REOPENED
    confidence: float = 94.5
    image_ref: Optional[str] = "pothole_annasalai_01.jpg"
    is_critical: bool = False
    route_ids: List[str] = []

class RepairWorkOrderModel(BaseModel):
    id: str = Field(..., example="WO-891")
    event_id: str = Field(..., example="PTH-001")
    road_name: str
    issue_type: str
    severity: str
    contractor: str = "Chennai Road Infrastructure Div-4"
    status: str = "DETECTED" # DETECTED, ASSIGNED, REPAIR_IN_PROGRESS, REPAIR_COMPLETED, BUS_RESCAN_PENDING, REPAIR_VERIFIED, REPAIR_FAILED_REOPENED
    assigned_date: Optional[str] = None
    completion_date: Optional[str] = None
    rescan_bus_id: Optional[str] = None
    rescan_date: Optional[str] = None
    verification_confidence: Optional[float] = None
    verification_result: Optional[str] = None # VERIFIED_CLEAN, FAILED_STILL_PRESENT

class IncidentModel(BaseModel):
    id: str = Field(..., example="INC-001")
    timestamp: str
    location: str
    road_name: str
    type: str # HIT_AND_RUN, RASH_DRIVING, RED_LIGHT_VIOLATION
    vehicle_type: str # SEDAN, SUV, MOTORCYCLE, AUTO, TRUCK
    plate_number: str = "TN-09-AB-1234"
    plate_confidence: float = 94.2
    speed_kmh: float = 68.5
    detecting_bus_id: str = "BUS-04"
    camera_angle: str = "REAR"
    status: str = "DISPATCHED_TO_POLICE" # DISPATCHED_TO_POLICE, UNDER_REVIEW, RESOLVED

class TrafficSegmentModel(BaseModel):
    id: str
    road_name: str
    route_code: str
    lat: float
    lng: float
    vehicle_count: int
    density_level: str # LOW, MODERATE, HEAVY, SEVERE
    avg_speed_kmh: float
    congestion_level_pct: float
    delay_minutes: int

class RoadConditionModel(BaseModel):
    id: str
    road_name: str
    health_score: int # 0 to 100
    status: str # EXCELLENT, GOOD, MODERATE, CRITICAL
    potholes_count: int
    cracks_count: int
    waterlogging_risk: str # LOW, MEDIUM, HIGH
    traffic_stress: str
    historical_trend: List[Dict[str, Any]] = []

class AlertModel(BaseModel):
    id: str
    title: str
    category: str
    priority: str # LOW, MEDIUM, HIGH, CRITICAL
    location: str
    road_name: str
    timestamp: str
    details: str
    status: str = "ACTIVE"

class BandwidthSummaryModel(BaseModel):
    total_detections: int
    unique_events: int
    duplicate_suppressions: int
    full_evidence_uploads: int
    metadata_uploads: int
    traditional_volume_mb: float
    optimized_volume_mb: float
    bandwidth_saved_pct: float
    total_saved_mb: float

class CausalityChainModel(BaseModel):
    id: str
    title: str
    root_cause: str
    road_condition: str
    traffic_impact_pct: int
    bus_speed_impact_pct: int
    route_delay_min: int
    affected_routes: List[str]
    timeline: List[Dict[str, Any]]

# -----------------------------------------------------------------------------
# COMMUTER MOBILITY & LIVE INTELLIGENCE MODELS
# -----------------------------------------------------------------------------

class BusStopModel(BaseModel):
    id: str = Field(..., example="STOP-21G-UP-01")
    name: str = Field(..., example="Broadway Bus Terminus")
    lat: float = Field(..., example=13.0891)
    lng: float = Field(..., example=80.2878)
    route_code: str = Field(..., example="21G")
    direction: str = Field(..., example="UP") # UP or DOWN
    sequence: int = Field(..., example=1)
    distance_from_start_km: float = Field(..., example=0.0)

class BusArrivalModel(BaseModel):
    bus_id: str
    route_code: str
    route_name: str
    direction: str
    eta_min: int
    confidence_range: str # e.g. "4-6 min"
    seat_status: str # SEATS_AVAILABLE, STANDING_ONLY, FULL
    occupancy_pct: int
    delay_reason: Optional[str] = None
    speed_kmh: float
    distance_remaining_km: float
    data_source: str # LIVE_GPS or SIMULATED
    is_low_floor: bool = False
    extended_dwell_time: bool = False
    driver_verified: bool = True

class UnsafeReportModel(BaseModel):
    bus_id: str = Field(..., example="BUS-04")
    category: str = Field(..., example="RASH_DRIVING") # RASH_DRIVING, OVERCROWDING, HARASSMENT, ROUTE_DEVIATION, OTHER
    note: Optional[str] = Field(default="", example="Bus bypassed stop at high speed.")
    timestamp: Optional[str] = None

class ExcludedBusModel(BaseModel):
    bus_id: str
    route_code: str
    direction: str
    reason: str # OPPOSITE_DIRECTION or ALREADY_PASSED
    progress_km: float
    stop_distance_km: float
    data_source: str # LIVE_GPS or SIMULATED

class CommuteAdviceModel(BaseModel):
    recommendation: str # WAIT or TAKE_AUTO
    bus_eta_min: int
    auto_eta_min: int
    time_saved_min: int
    bus_fare_inr: float
    auto_fare_inr: float
    cost_diff_inr: float
    rationale: str
    co2_saved_g: float = 0.0

class HeadwayStatModel(BaseModel):
    route_code: str
    direction: str
    buses_count: int
    avg_gap_km: float
    min_gap_km: float
    bunching_detected: bool
    bunching_buses: List[str]

class GpsFeedPayloadModel(BaseModel):
    bus_id: str = Field(..., example="BUS-01")
    lat: float = Field(..., example=13.0827)
    lng: float = Field(..., example=80.2707)
    speed: float = Field(default=30.0, example=32.4)
    heading: Optional[float] = Field(default=180.0, example=185.0)
    ts: Optional[str] = None

class OccupancyUpdateModel(BaseModel):
    bus_id: str
    count: int
    timestamp: Optional[str] = None

class ForecastResponseModel(BaseModel):
    bus_id: str
    current_occupancy_pct: int
    forecast_5min: int
    forecast_10min: int
    forecast_15min: int
    model_used: str

class ModelStatusItemModel(BaseModel):
    name: str
    source: str
    licence: str
    device: str
    load_state: str
    measured_fps_latency: str

class ModelStatusResponseModel(BaseModel):
    status: str
    models: List[ModelStatusItemModel]
    timestamp: str

class AssistantQueryModel(BaseModel):
    message: str = Field(..., example="Next bus to Guindy eppo varum?")
    stop_id: Optional[str] = None
    destination_id: Optional[str] = None
    session_id: Optional[str] = None

