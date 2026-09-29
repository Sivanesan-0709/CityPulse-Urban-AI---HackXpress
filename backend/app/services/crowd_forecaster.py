"""
CityPulse Urban AI - Zero-Shot Crowd Occupancy Forecaster
Forecasts bus passenger occupancy for +5, +10, and +15 minute horizons.
Uses Chronos-Bolt small model interface with seasonal-naive fallback.
"""

import random
from typing import Dict, Any, List
from app.database import db
from app.services.model_registry import model_registry

class CrowdForecaster:
    @staticmethod
    def forecast_occupancy(bus_id: str) -> Dict[str, Any]:
        """
        Forecasts occupancy_pct for +5m, +10m, and +15m horizons.
        """
        bus = db.buses.find_one({"id": bus_id})
        current_occ = bus.get("occupancy_pct", 45) if bus else 45

        # Fetch recent historical trend for bus
        history_records = db.occupancy_history.find({"bus_id": bus_id})
        history_vals = [r.get("occupancy_pct", 45) for r in history_records[-10:]]

        if not history_vals:
            history_vals = [current_occ]

        model = model_registry.load_model("chronos_bolt_small")
        
        if model is not None:
            # Run Chronos zero-shot time series model
            try:
                import torch
                context = torch.tensor(history_vals, dtype=torch.float32).unsqueeze(0)
                forecast = model.predict(context, prediction_length=3)
                f_5 = int(round(clamp_occ(forecast[0, 0].item())))
                f_10 = int(round(clamp_occ(forecast[0, 1].item())))
                f_15 = int(round(clamp_occ(forecast[0, 2].item())))
                model_used = "Chronos-Bolt Small (Zero-Shot)"
            except Exception as e:
                print(f"[CrowdForecaster Warning] Chronos inference error: {e}")
                f_5, f_10, f_15, model_used = seasonal_naive_forecast(current_occ, history_vals)
        else:
            # Robust seasonal-naive fallback
            f_5, f_10, f_15, model_used = seasonal_naive_forecast(current_occ, history_vals)

        return {
            "bus_id": bus_id,
            "current_occupancy_pct": current_occ,
            "forecast_5min": f_5,
            "forecast_10min": f_10,
            "forecast_15min": f_15,
            "model_used": model_used
        }

def clamp_occ(val: float) -> float:
    return max(10.0, min(100.0, val))

def seasonal_naive_forecast(current: int, history: List[int]) -> tuple:
    # Trend adjustment based on recent history
    avg = sum(history) / float(len(history))
    trend = 1 if current >= avg else -1
    f_5 = int(max(10, min(100, current + trend * 3)))
    f_10 = int(max(10, min(100, current + trend * 6)))
    f_15 = int(max(10, min(100, current + trend * 8)))
    return f_5, f_10, f_15, "Seasonal-Naive Fallback Engine"

crowd_forecaster = CrowdForecaster()
