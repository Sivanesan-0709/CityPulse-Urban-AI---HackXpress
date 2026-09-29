"""
CityPulse Urban AI - Route-Aware Deduplication & Bandwidth Optimization Service
SIH 2026 Problem Statement ID: 26124 - Differentiator 2
"""

from typing import Dict, Any, List
from app.database import db
from datetime import datetime

class DeduplicationService:
    @staticmethod
    def get_bandwidth_analytics() -> Dict[str, Any]:
        """Calculates dynamic bandwidth savings comparing Traditional full-upload vs CityPulse Route Cache"""
        events = db.events.find()
        observations = db.event_observations.find()
        
        total_detections = len(observations)
        unique_events = len(events)
        duplicate_suppressions = max(0, total_detections - unique_events)
        
        # Standard average media payload sizes
        full_evidence_mb = 4.8  # ~4.8 MB for 1080p multi-angle frame burst / snippet
        metadata_only_mb = 0.0012  # ~1.2 KB for JSON telemetry confirmation
        
        # Calculations
        traditional_volume_mb = round(total_detections * full_evidence_mb, 2)
        optimized_volume_mb = round((unique_events * full_evidence_mb) + (duplicate_suppressions * metadata_only_mb), 2)
        total_saved_mb = round(traditional_volume_mb - optimized_volume_mb, 2)
        
        saved_pct = round((total_saved_mb / traditional_volume_mb) * 100, 1) if traditional_volume_mb > 0 else 0.0
        
        # Route-by-route breakdown
        routes = db.routes.find()
        route_stats = []
        for r in routes:
            r_code = r["code"]
            r_obs = [o for o in observations if o.get("route_code") == r_code]
            r_unique = len(set(o.get("event_id") for o in r_obs))
            r_dups = max(0, len(r_obs) - r_unique)
            r_trad = round(len(r_obs) * full_evidence_mb, 2)
            r_opt = round((r_unique * full_evidence_mb) + (r_dups * metadata_only_mb), 2)
            r_saved_pct = round(((r_trad - r_opt) / r_trad) * 100, 1) if r_trad > 0 else 0.0
            
            route_stats.append({
                "route_code": r_code,
                "route_name": r["name"],
                "total_detections": len(r_obs),
                "unique_events": r_unique,
                "duplicates_suppressed": r_dups,
                "traditional_mb": r_trad,
                "optimized_mb": r_opt,
                "saved_pct": r_saved_pct
            })
            
        return {
            "total_detections": total_detections,
            "unique_events": unique_events,
            "duplicate_suppressions": duplicate_suppressions,
            "full_evidence_uploads": unique_events,
            "metadata_uploads": duplicate_suppressions,
            "traditional_volume_mb": traditional_volume_mb,
            "optimized_volume_mb": optimized_volume_mb,
            "bandwidth_saved_pct": saved_pct,
            "total_saved_mb": total_saved_mb,
            "route_breakdown": route_stats,
            "updated_at": datetime.now().isoformat() + "Z"
        }

    @staticmethod
    def simulate_detection(bus_id: str, route_code: str, event_id: str, lat: float, lng: float) -> Dict[str, Any]:
        """Simulates onboard Edge AI detecting an event and querying local route cache"""
        cache = db.route_event_cache.find_one({"route_code": route_code})
        active_ids = cache.get("active_event_ids", []) if cache else []
        
        is_duplicate = event_id in active_ids
        is_full_upload = not is_duplicate
        payload_size_kb = 4800.0 if is_full_upload else 1.2
        
        new_obs = {
            "id": f"OBS-{db.event_observations.count_documents() + 1:04d}",
            "event_id": event_id,
            "bus_id": bus_id,
            "route_code": route_code,
            "timestamp": datetime.now().isoformat() + "Z",
            "lat": lat,
            "lng": lng,
            "confidence": 96.5,
            "camera_angle": "FRONT",
            "is_full_upload": is_full_upload,
            "payload_size_kb": payload_size_kb
        }
        db.event_observations.insert_one(new_obs)
        
        # If new, add to cache and update event
        if not is_duplicate:
            active_ids.append(event_id)
            db.route_event_cache.update_one({"route_code": route_code}, {"$set": {"active_event_ids": active_ids}})
            
        # Update event observation count
        event = db.events.find_one({"id": event_id})
        if event:
            buses = event.get("observing_buses", [])
            if bus_id not in buses:
                buses.append(bus_id)
            db.events.update_one({"id": event_id}, {
                "$set": {
                    "observation_count": event.get("observation_count", 1) + 1,
                    "observing_buses": buses,
                    "last_detected": datetime.now().isoformat() + "Z"
                }
            })
            
        return {
            "event_id": event_id,
            "bus_id": bus_id,
            "route_code": route_code,
            "is_duplicate_suppressed": is_duplicate,
            "action": "METADATA_CONFIRMATION_ONLY" if is_duplicate else "FULL_EVIDENCE_TRANSMITTED",
            "payload_size_kb": payload_size_kb,
            "bandwidth_saved_kb": 4798.8 if is_duplicate else 0.0
        }
