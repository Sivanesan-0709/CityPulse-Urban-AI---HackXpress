"""
CityPulse Urban AI - Embedded MongoDB-Compatible Document Database
Provides a robust document store operating on disk JSON files with in-memory caching.
Zero external database dependencies required.
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime

from app.config import DATA_DIR

class DocumentCollection:
    def __init__(self, name: str, filepath: Path):
        self.name = name
        self.filepath = filepath
        self._data: List[Dict[str, Any]] = []
        self._load()

    def _load(self):
        if self.filepath.exists():
            try:
                with open(self.filepath, "r", encoding="utf-8") as f:
                    self._data = json.load(f)
            except Exception as e:
                print(f"Error loading collection {self.name}: {e}")
                self._data = []
        else:
            self._data = []
            self._save()

    def _save(self):
        try:
            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump(self._data, f, indent=2, default=str)
        except Exception as e:
            print(f"Error saving collection {self.name}: {e}")

    def find(self, query: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        if not query:
            return [doc.copy() for doc in self._data]
        
        results = []
        for doc in self._data:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                results.append(doc.copy())
        return results

    def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        for doc in self._data:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return doc.copy()
        return None

    def insert_one(self, doc: Dict[str, Any]) -> Dict[str, Any]:
        item = doc.copy()
        if "created_at" not in item:
            item["created_at"] = datetime.utcnow().isoformat() + "Z"
        if "updated_at" not in item:
            item["updated_at"] = datetime.utcnow().isoformat() + "Z"
        
        self._data.append(item)
        self._save()
        return item

    def insert_many(self, docs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        inserted = []
        now = datetime.utcnow().isoformat() + "Z"
        for doc in docs:
            item = doc.copy()
            if "created_at" not in item:
                item["created_at"] = now
            if "updated_at" not in item:
                item["updated_at"] = now
            self._data.append(item)
            inserted.append(item)
        self._save()
        return inserted

    def update_one(self, query: Dict[str, Any], update: Dict[str, Any]) -> bool:
        for idx, doc in enumerate(self._data):
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                # Support $set style or direct update
                if "$set" in update:
                    doc.update(update["$set"])
                else:
                    doc.update(update)
                doc["updated_at"] = datetime.utcnow().isoformat() + "Z"
                self._data[idx] = doc
                self._save()
                return True
        return False

    def count_documents(self, query: Optional[Dict[str, Any]] = None) -> int:
        if not query:
            return len(self._data)
        return len(self.find(query))

    def delete_many(self, query: Optional[Dict[str, Any]] = None) -> int:
        if not query:
            count = len(self._data)
            self._data = []
            self._save()
            return count
        
        initial = len(self._data)
        self._data = [
            doc for doc in self._data 
            if not all(doc.get(k) == v for k, v in query.items())
        ]
        self._save()
        return initial - len(self._data)

    def drop(self):
        self._data = []
        self._save()


class Database:
    def __init__(self, data_dir: Path):
        self.data_dir = data_dir
        self.data_dir.mkdir(exist_ok=True)
        
        self.buses = DocumentCollection("buses", self.data_dir / "buses.json")
        self.routes = DocumentCollection("routes", self.data_dir / "routes.json")
        self.bus_stops = DocumentCollection("bus_stops", self.data_dir / "bus_stops.json")
        self.events = DocumentCollection("events", self.data_dir / "events.json")
        self.event_observations = DocumentCollection("event_observations", self.data_dir / "event_observations.json")
        self.route_event_cache = DocumentCollection("route_event_cache", self.data_dir / "route_event_cache.json")
        self.repairs = DocumentCollection("repairs", self.data_dir / "repairs.json")
        self.incidents = DocumentCollection("incidents", self.data_dir / "incidents.json")
        self.traffic_data = DocumentCollection("traffic_data", self.data_dir / "traffic_data.json")
        self.road_conditions = DocumentCollection("road_conditions", self.data_dir / "road_conditions.json")
        self.alerts = DocumentCollection("alerts", self.data_dir / "alerts.json")
        self.bandwidth_metrics = DocumentCollection("bandwidth_metrics", self.data_dir / "bandwidth_metrics.json")
        self.causality_chains = DocumentCollection("causality_chains", self.data_dir / "causality_chains.json")
        self.occupancy_history = DocumentCollection("occupancy_history", self.data_dir / "occupancy_history.json")
        self.gps_logs = DocumentCollection("gps_logs", self.data_dir / "gps_logs.json")
        self.model_metrics = DocumentCollection("model_metrics", self.data_dir / "model_metrics.json")
        self.reports = DocumentCollection("reports", self.data_dir / "reports.json")

    def reset_all(self):
        for col in [
            self.buses, self.routes, self.bus_stops, self.events, self.event_observations,
            self.route_event_cache, self.repairs, self.incidents,
            self.traffic_data, self.road_conditions, self.alerts,
            self.bandwidth_metrics, self.causality_chains,
            self.occupancy_history, self.gps_logs, self.model_metrics,
            self.reports
        ]:
            col.drop()


# Global database singleton
db = Database(DATA_DIR)
