import os
from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_DIR = BASE_DIR.parent
FRONTEND_DIR = Path(os.getenv("FRONTEND_DIR", str(PROJECT_DIR / "frontend")))
if not FRONTEND_DIR.exists() and (BASE_DIR / "frontend").exists():
    FRONTEND_DIR = BASE_DIR / "frontend"

DATA_DIR = Path(os.getenv("DATA_DIR", str(BASE_DIR / "data")))

# Ensure data directory exists
DATA_DIR.mkdir(exist_ok=True)

# Configuration settings
PROJECT_NAME = "CityPulse AI - Urban Intelligence Platform"
PROJECT_ID = "SIH-2026-26124"
VERSION = "1.0.0"
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
CORS_ORIGINS = ["*"]

# Default Location Settings
DEFAULT_CITY = "Chennai"
DEFAULT_LAT = 13.0827
DEFAULT_LNG = 80.2707

# Models directory
MODELS_DIR = Path(os.getenv("MODELS_DIR", str(BASE_DIR / "models")))
MODELS_DIR.mkdir(exist_ok=True)

# Data mode configuration: HYBRID | LIVE | SIMULATED
DATA_MODE = os.getenv("DATA_MODE", "HYBRID")
STALE_FEED_TIMEOUT_SEC = float(os.getenv("STALE_FEED_TIMEOUT_SEC", "30.0"))

# Navigation & Transit settings
OSRM_BASE_URL = os.getenv("OSRM_BASE_URL", "https://router.project-osrm.org")
BUS_CAPACITY = int(os.getenv("BUS_CAPACITY", "50"))
AUTO_BASE_FARE = float(os.getenv("AUTO_BASE_FARE", "40.0"))
AUTO_PER_KM_RATE = float(os.getenv("AUTO_PER_KM_RATE", "15.0"))
AUTO_AVG_SPEED_KMH = float(os.getenv("AUTO_AVG_SPEED_KMH", "30.0"))
BUS_BASE_FARE = float(os.getenv("BUS_BASE_FARE", "10.0"))
HEADWAY_BUNCHING_THRESHOLD_KM = float(os.getenv("HEADWAY_BUNCHING_THRESHOLD_KM", "0.8"))

# Carbon emission factors for urban passenger transit in India (g CO2 / passenger-km)
# Source: ARAI (Automotive Research Association of India) & CPREE Urban Transit Emissions Study
# Auto-rickshaw (CNG/Petrol 3-wheeler average occupancy ~1.5): ~75.0 g CO2 / pass-km
# City Bus (Diesel/CNG city transit bus average occupancy ~35): ~20.0 g CO2 / pass-km
CARBON_EMISSION_FACTOR_AUTO_G_PER_KM = float(os.getenv("CARBON_EMISSION_FACTOR_AUTO_G_PER_KM", "75.0"))
CARBON_EMISSION_FACTOR_BUS_G_PER_KM = float(os.getenv("CARBON_EMISSION_FACTOR_BUS_G_PER_KM", "20.0"))

# Disaster and Congestion alert thresholds
DISASTER_MODE_SEVERITY_THRESHOLD = float(os.getenv("DISASTER_MODE_SEVERITY_THRESHOLD", "80.0"))
CONGESTION_ALERT_OCCUPANCY_THRESHOLD = int(os.getenv("CONGESTION_ALERT_OCCUPANCY_THRESHOLD", "80"))

# AI & LLM settings
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "OPENAI")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
POTHOLE_MODEL_PATH = os.getenv("POTHOLE_MODEL_PATH", str(MODELS_DIR / "pothole_detector.pt"))



