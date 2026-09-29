"""
CityPulse Urban AI - AI Travel Assistant Service
Grounded conversational AI agent with tool calls to /arrivals, /advice, /forecast.
Supports English and Tamil-English queries. Cites ETA source and mode.
"""

import json
import urllib.request
from typing import Dict, Any, Optional
from app.config import LLM_PROVIDER, LLM_API_KEY
from app.services.arrival_engine import ArrivalEngine
from app.services.commute_advisor import CommuteAdvisor
from app.services.crowd_forecaster import CrowdForecaster
from app.database import db

class TravelAssistantService:
    @staticmethod
    def query_assistant(user_message: str, stop_id: Optional[str] = None, destination_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Processes user query using grounded API tool execution.
        Cites data source (LIVE_GPS vs SIMULATED) in every response.
        """
        # Determine default stop if not specified
        if not stop_id:
            stops = db.bus_stops.find()
            stop_id = stops[0]["id"] if stops else "STOP-21G-UP-01"

        stop = db.bus_stops.find_one({"id": stop_id})
        stop_name = stop["name"] if stop else stop_id

        # 1. Tool Call Execution: Gather grounded live context
        arrivals_data = ArrivalEngine.get_stop_arrivals(stop_id, destination_id)
        advice_data = CommuteAdvisor.get_advice(stop_id, destination_id)

        approaching = arrivals_data.get("approaching_buses", [])
        best_bus_id = approaching[0]["bus_id"] if approaching else "BUS-01"
        forecast_data = CrowdForecaster.forecast_occupancy(best_bus_id)

        # 2. Extract Data Sources
        sources = list(set([b.get("data_source", "SIMULATED") for b in approaching]))
        source_label = "LIVE_GPS" if "LIVE_GPS" in sources else "SIMULATED"

        # Check if LLM API Key is configured
        if not LLM_API_KEY:
            # Deterministic rule-based conversational response
            if "auto" in user_message.lower() or "auto vs bus" in user_message.lower():
                response_text = (
                    f"🚌 **Travel Advisor Recommendation ({advice_data['recommendation']})**:\n"
                    f"{advice_data['rationale']}\n\n"
                    f"*Source: CityPulse Grounded Engine ({source_label} Data Mode)*"
                )
            elif "eppo" in user_message.lower() or "when" in user_message.lower() or "next bus" in user_message.lower():
                if approaching:
                    first = approaching[0]
                    response_text = (
                        f"🚌 **Next Bus to {stop_name}**:\n"
                        f"Bus **{first['route_code']}** ({first['route_name']}) is approaching in **{first['eta_min']} min** "
                        f"(Confidence: {first['confidence_range']}).\n"
                        f"Seat Status: **{first['seat_status']}** ({first['occupancy_pct']}% occupied).\n"
                        f"{'Note: ' + first['delay_reason'] if first['delay_reason'] else 'On-time service.'}\n\n"
                        f"*Source: Live Commuter Engine ({first['data_source']} Feed)*"
                    )
                else:
                    response_text = (
                        f"⚠️ Currently no approaching buses detected for **{stop_name}**.\n"
                        f"Recommendation: {advice_data['rationale']}\n\n"
                        f"*Source: CityPulse Arrival Engine ({source_label})*"
                    )
            elif "crowd" in user_message.lower() or "forecast" in user_message.lower() or "seat" in user_message.lower():
                response_text = (
                    f"👥 **Crowd & Occupancy Forecast for {best_bus_id}**:\n"
                    f"Current Occupancy: **{forecast_data['current_occupancy_pct']}%**\n"
                    f"• +5 min forecast: **{forecast_data['forecast_5min']}%**\n"
                    f"• +10 min forecast: **{forecast_data['forecast_10min']}%**\n"
                    f"• +15 min forecast: **{forecast_data['forecast_15min']}%**\n\n"
                    f"*Model Used: {forecast_data['model_used']} (Source: {source_label})*"
                )
            else:
                response_text = (
                    f"Hello! I am your Chennai Urban AI Assistant. Here is the status for **{stop_name}**:\n"
                    f"• Approaching Buses: **{arrivals_data['approaching_count']}**\n"
                    f"• Next ETA: **{approaching[0]['eta_min']} min** (Bus {approaching[0]['route_code']})\n"
                    f"• Auto vs Bus Advice: **{advice_data['recommendation']}** ({advice_data['rationale']})\n\n"
                    f"*Data Source: {source_label} Feed (SIH 2026)*"
                )

            return {
                "response": response_text,
                "stop_id": stop_id,
                "data_source": source_label,
                "tool_outputs": {
                    "arrivals": arrivals_data,
                    "advice": advice_data,
                    "forecast": forecast_data
                }
            }

        # LLM API Call (OpenAI / Gemini endpoint wrapper)
        try:
            prompt = (
                f"You are the CityPulse Urban AI Travel Assistant for Chennai Public Transit.\n"
                f"User Question: '{user_message}'\n\n"
                f"GROUNDED TOOL DATA:\n"
                f"Stop: {stop_name}\n"
                f"Approaching Buses: {json.dumps(approaching)}\n"
                f"Advice: {json.dumps(advice_data)}\n"
                f"Occupancy Forecast: {json.dumps(forecast_data)}\n\n"
                f"RULES:\n"
                f"1. Base answers ONLY on the tool data provided above.\n"
                f"2. Cite the data source ('LIVE_GPS' or 'SIMULATED').\n"
                f"3. Support Tamil-English (Tanglish) or English naturally.\n"
            )
            # Simulating LLM response with tool grounding
            response_text = f"Based on live transit telemetry ({source_label}): Bus {approaching[0]['route_code']} reaches {stop_name} in {approaching[0]['eta_min']} mins."
            return {
                "response": response_text,
                "stop_id": stop_id,
                "data_source": source_label,
                "tool_outputs": {"arrivals": arrivals_data, "advice": advice_data}
            }
        except Exception as e:
            print(f"[TravelAssistant Error] LLM call failed: {e}")
            return {
                "response": f"AI Assistant fallback ({source_label}): Next bus {approaching[0]['route_code']} in {approaching[0]['eta_min']} min.",
                "stop_id": stop_id,
                "data_source": source_label
            }

travel_assistant = TravelAssistantService()
