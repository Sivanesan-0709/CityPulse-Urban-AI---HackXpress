"""
CityPulse Urban AI - Seed Dataset Generator
SIH 2026 Problem Statement ID: 26124
Generates realistic Chennai city fleet, routes, and 100+ events with deliberate duplicate observations.
"""

from typing import List, Dict, Any
from datetime import datetime, timedelta
import random

from app.database import db

def generate_seed_data():
    print("Generating Chennai Urban Sensing Seed Dataset...")

    # Clear existing data
    db.reset_all()

    now = datetime.utcnow()
    
    # -------------------------------------------------------------
    # 1. 10 CHENNAI BUS ROUTES
    # -------------------------------------------------------------
    routes_data = [
        {
            "id": "ROUTE-21G",
            "code": "21G",
            "name": "Broadway ↔ Tambaram",
            "start_stop": "Broadway Bus Terminus",
            "end_stop": "Tambaram Sanatorium",
            "total_distance_km": 28.4,
            "waypoints": [
                {"lat": 13.0891, "lng": 80.2878, "name": "Broadway"},
                {"lat": 13.0827, "lng": 80.2754, "name": "Central Railway Station"},
                {"lat": 13.0604, "lng": 80.2496, "name": "Gemini Flyover (Anna Salai)"},
                {"lat": 13.0418, "lng": 80.2341, "name": "Nandanam Jn"},
                {"lat": 13.0067, "lng": 80.2023, "name": "Guindy Kathipara"},
                {"lat": 12.9815, "lng": 80.1636, "name": "Chennai Airport (Meenambakkam)"},
                {"lat": 12.9431, "lng": 80.1412, "name": "Pallavaram"},
                {"lat": 12.9249, "lng": 80.1264, "name": "Tambaram Sanatorium"}
            ],
            "active_buses_count": 2
        },
        {
            "id": "ROUTE-19B",
            "code": "19B",
            "name": "T. Nagar ↔ Kelambakkam (OMR IT Corridor)",
            "start_stop": "T. Nagar Bus Terminus",
            "end_stop": "Kelambakkam Bus Stand",
            "total_distance_km": 34.2,
            "waypoints": [
                {"lat": 13.0405, "lng": 80.2337, "name": "T. Nagar Terminus"},
                {"lat": 13.0213, "lng": 80.2231, "name": "Saidapet"},
                {"lat": 12.9863, "lng": 80.2432, "name": "Tidel Park / SRP Tools"},
                {"lat": 12.9698, "lng": 80.2458, "name": "Perungudi OMR"},
                {"lat": 12.9348, "lng": 80.2312, "name": "Thoraipakkam"},
                {"lat": 12.9010, "lng": 80.2279, "name": "Sholinganallur Jn"},
                {"lat": 12.8398, "lng": 80.2234, "name": "Siruseri SIPCOT IT Park"},
                {"lat": 12.7876, "lng": 80.2212, "name": "Kelambakkam"}
            ],
            "active_buses_count": 2
        },
        {
            "id": "ROUTE-5C",
            "code": "5C",
            "name": "Broadway ↔ T. Nagar",
            "start_stop": "Broadway Bus Terminus",
            "end_stop": "T. Nagar Terminus",
            "total_distance_km": 14.6,
            "waypoints": [
                {"lat": 13.0891, "lng": 80.2878, "name": "Broadway"},
                {"lat": 13.0836, "lng": 80.2707, "name": "Park Station"},
                {"lat": 13.0732, "lng": 80.2609, "name": "Egmore"},
                {"lat": 13.0588, "lng": 80.2428, "name": "Nungambakkam High Road"},
                {"lat": 13.0405, "lng": 80.2337, "name": "T. Nagar Terminus"}
            ],
            "active_buses_count": 2
        },
        {
            "id": "ROUTE-23C",
            "code": "23C",
            "name": "Besant Nagar ↔ Ayanavaram",
            "start_stop": "Besant Nagar Bus Stand",
            "end_stop": "Ayanavaram Bus Depot",
            "total_distance_km": 18.8,
            "waypoints": [
                {"lat": 13.0002, "lng": 80.2668, "name": "Besant Nagar"},
                {"lat": 13.0063, "lng": 80.2575, "name": "Adyar Depot"},
                {"lat": 13.0336, "lng": 80.2677, "name": "Mylapore Luz Corner"},
                {"lat": 13.0674, "lng": 80.2415, "name": "Chetpet"},
                {"lat": 13.0987, "lng": 80.2312, "name": "Ayanavaram"}
            ],
            "active_buses_count": 2
        },
        {
            "id": "ROUTE-29C",
            "code": "29C",
            "name": "Perambur ↔ Besant Nagar",
            "start_stop": "Perambur Railway Station",
            "end_stop": "Besant Nagar Beach",
            "total_distance_km": 22.1,
            "waypoints": [
                {"lat": 13.1114, "lng": 80.2432, "name": "Perambur"},
                {"lat": 13.0827, "lng": 80.2707, "name": "Chennai Central"},
                {"lat": 13.0504, "lng": 80.2612, "name": "Royapettah Hospital"},
                {"lat": 13.0234, "lng": 80.2619, "name": "Mandaveli"},
                {"lat": 13.0002, "lng": 80.2668, "name": "Besant Nagar Beach"}
            ],
            "active_buses_count": 2
        },
        {
            "id": "ROUTE-45B",
            "code": "45B",
            "name": "Anna Nagar West ↔ Guindy",
            "start_stop": "Anna Nagar West Depot",
            "end_stop": "Guindy Industrial Estate",
            "total_distance_km": 16.5,
            "waypoints": [
                {"lat": 13.0902, "lng": 80.2014, "name": "Anna Nagar West"},
                {"lat": 13.0712, "lng": 80.1989, "name": "Koyambedu CMBT"},
                {"lat": 13.0521, "lng": 80.2123, "name": "Vadapalani Junction"},
                {"lat": 13.0345, "lng": 80.2156, "name": "Ashok Pillar"},
                {"lat": 13.0067, "lng": 80.2023, "name": "Guindy Kathipara"}
            ],
            "active_buses_count": 2
        },
        {
            "id": "ROUTE-88K",
            "code": "88K",
            "name": "Broadway ↔ Kundrathur",
            "start_stop": "Broadway",
            "end_stop": "Kundrathur Murugan Temple",
            "total_distance_km": 24.3,
            "waypoints": [
                {"lat": 13.0891, "lng": 80.2878, "name": "Broadway"},
                {"lat": 13.0604, "lng": 80.2496, "name": "Gemini"},
                {"lat": 13.0378, "lng": 80.1589, "name": "Porur Junction"},
                {"lat": 13.0012, "lng": 80.0987, "name": "Kundrathur"}
            ],
            "active_buses_count": 2
        },
        {
            "id": "ROUTE-102X",
            "code": "102X",
            "name": "Broadway ↔ Kelambakkam Express",
            "start_stop": "Broadway",
            "end_stop": "Kelambakkam",
            "total_distance_km": 36.0,
            "waypoints": [
                {"lat": 13.0891, "lng": 80.2878, "name": "Broadway"},
                {"lat": 13.0500, "lng": 80.2824, "name": "Marina Beach"},
                {"lat": 12.9863, "lng": 80.2432, "name": "Tidel Park"},
                {"lat": 12.9010, "lng": 80.2279, "name": "Sholinganallur"},
                {"lat": 12.7876, "lng": 80.2212, "name": "Kelambakkam"}
            ],
            "active_buses_count": 2
        },
        {
            "id": "ROUTE-570",
            "code": "570",
            "name": "CMBT Koyambedu ↔ Siruseri SIPCOT",
            "start_stop": "CMBT Koyambedu",
            "end_stop": "Siruseri IT Park",
            "total_distance_km": 38.5,
            "waypoints": [
                {"lat": 13.0712, "lng": 80.1989, "name": "CMBT"},
                {"lat": 13.0521, "lng": 80.2123, "name": "Vadapalani"},
                {"lat": 13.0067, "lng": 80.2023, "name": "Guindy"},
                {"lat": 12.9798, "lng": 80.2212, "name": "Velachery"},
                {"lat": 12.9010, "lng": 80.2279, "name": "Sholinganallur"},
                {"lat": 12.8398, "lng": 80.2234, "name": "Siruseri"}
            ],
            "active_buses_count": 2
        },
        {
            "id": "ROUTE-47A",
            "code": "47A",
            "name": "Villivakkam ↔ Thiruvanmiyur",
            "start_stop": "Villivakkam Bus Stand",
            "end_stop": "Thiruvanmiyur RTO",
            "total_distance_km": 21.0,
            "waypoints": [
                {"lat": 13.1078, "lng": 80.2089, "name": "Villivakkam"},
                {"lat": 13.0798, "lng": 80.2412, "name": "Kilpauk"},
                {"lat": 13.0604, "lng": 80.2496, "name": "Gemini"},
                {"lat": 13.0063, "lng": 80.2575, "name": "Adyar"},
                {"lat": 12.9832, "lng": 80.2598, "name": "Thiruvanmiyur"}
            ],
            "active_buses_count": 2
        }
    ]
    db.routes.insert_many(routes_data)

    # -------------------------------------------------------------
    # 1B. GENERATE BUS STOPS FOR ALL 10 ROUTES (UP & DOWN)
    # -------------------------------------------------------------
    import math

    def calculate_haversine(lat1, lng1, lat2, lng2):
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2)**2
        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    all_stops = []
    for route in routes_data:
        wps = route["waypoints"]
        total_dist_km = route["total_distance_km"]

        # UP Direction Stops
        cum_dist = 0.0
        for idx, wp in enumerate(wps):
            if idx > 0:
                cum_dist += calculate_haversine(wps[idx-1]["lat"], wps[idx-1]["lng"], wp["lat"], wp["lng"])
            dist_km = round(min(cum_dist, total_dist_km), 2)
            all_stops.append({
                "id": f"STOP-{route['code']}-UP-{idx+1:02d}",
                "name": wp.get("name") or f"{route['code']} Stop {idx+1}",
                "lat": wp["lat"],
                "lng": wp["lng"],
                "route_code": route["code"],
                "direction": "UP",
                "sequence": idx + 1,
                "distance_from_start_km": dist_km
            })

        # DOWN Direction Stops (Reversed order)
        rev_wps = list(reversed(wps))
        cum_dist = 0.0
        for idx, wp in enumerate(rev_wps):
            if idx > 0:
                cum_dist += calculate_haversine(rev_wps[idx-1]["lat"], rev_wps[idx-1]["lng"], wp["lat"], wp["lng"])
            dist_km = round(min(cum_dist, total_dist_km), 2)
            all_stops.append({
                "id": f"STOP-{route['code']}-DOWN-{idx+1:02d}",
                "name": wp.get("name") or f"{route['code']} Return Stop {idx+1}",
                "lat": wp["lat"],
                "lng": wp["lng"],
                "route_code": route["code"],
                "direction": "DOWN",
                "sequence": idx + 1,
                "distance_from_start_km": dist_km
            })

    db.bus_stops.insert_many(all_stops)

    # -------------------------------------------------------------
    # 2. 20 MTC BUSES (BUS-01 to BUS-20)
    # -------------------------------------------------------------
    buses_data = []
    for i in range(1, 21):
        bus_id = f"BUS-{i:02d}"
        route_idx = (i - 1) % len(routes_data)
        route = routes_data[route_idx]
        wp = route["waypoints"]
        
        direction = "UP" if (i % 2 != 0) else "DOWN"
        
        # Position bus along route waypoints based on bus index
        frac = ((i * 3) % 10) / 10.0
        progress_km = round(max(0.5, min(frac * route["total_distance_km"], route["total_distance_km"] - 0.5)), 2)

        # Estimate lat/lng from progress
        wp_idx = min(int(frac * (len(wp) - 1)), len(wp) - 1)
        wp_choice = wp[wp_idx]
        lat = round(wp_choice["lat"] + random.uniform(-0.002, 0.002), 5)
        lng = round(wp_choice["lng"] + random.uniform(-0.002, 0.002), 5)
        speed = round(random.uniform(22.0, 42.0), 1)

        occupancy_pct = random.randint(25, 85)
        if occupancy_pct < 70:
            seat_status = "SEATS_AVAILABLE"
        elif occupancy_pct <= 90:
            seat_status = "STANDING_ONLY"
        else:
            seat_status = "FULL"

        # Find next stop
        route_stops = [s for s in all_stops if s["route_code"] == route["code"] and s["direction"] == direction]
        next_stops = [s for s in route_stops if s["distance_from_start_km"] > progress_km]
        next_stop_id = next_stops[0]["id"] if next_stops else (route_stops[-1]["id"] if route_stops else None)

        buses_data.append({
            "id": bus_id,
            "route_id": route["id"],
            "route_code": route["code"],
            "route_name": route["name"],
            "lat": lat,
            "lng": lng,
            "speed_kmh": speed,
            "status": "ACTIVE",
            "cameras_online": 5,
            "total_cameras": 5,
            "ai_status": "ONLINE",
            "network_status": "5G_EXCELLENT" if i % 4 != 0 else "4G_STABLE",
            "bandwidth_used_mb": round(random.uniform(1.2, 4.8), 2),
            "events_detected_count": random.randint(8, 24),
            "last_ping": (now - timedelta(seconds=random.randint(1, 15))).isoformat() + "Z",
            "direction": direction,
            "progress_km": progress_km,
            "next_stop_id": next_stop_id,
            "occupancy_pct": occupancy_pct,
            "seat_status": seat_status,
            "data_source": "SIMULATED",
            "last_gps_ts": (now - timedelta(seconds=random.randint(1, 15))).isoformat() + "Z",
            "heading": 180.0 if direction == "UP" else 0.0,
            "is_online": True,
            "is_low_floor": (i in [1, 3, 5, 8, 10, 15, 18]),
            "extended_dwell_time": (i in [1, 3, 5, 8, 10, 15, 18]),
            "driver_verified": (i not in [4, 14])
        })
    db.buses.insert_many(buses_data)


    # -------------------------------------------------------------
    # 3. 108 URBAN EVENTS (With Intentional Multi-Bus Observations)
    # -------------------------------------------------------------
    events_data = []
    observations_data = []
    route_caches: Dict[str, List[str]] = {r["code"]: [] for r in routes_data}

    # Primary Differentiator Pothole Event: PTH-001 on Route 21G
    pth_001 = {
        "id": "PTH-001",
        "type": "POTHOLE",
        "subtype": "Severe Road Depression (Depth 9cm, Width 48cm)",
        "category": "ROAD_DEFECT",
        "severity": "CRITICAL",
        "severity_score": 88.5,
        "road_name": "Anna Salai, Guindy Kathipara Junction",
        "lat": 13.0067,
        "lng": 80.2023,
        "first_detected": (now - timedelta(days=5, hours=3)).isoformat() + "Z",
        "last_detected": (now - timedelta(minutes=12)).isoformat() + "Z",
        "observation_count": 4,
        "observing_buses": ["BUS-01", "BUS-05", "BUS-08", "BUS-12"],
        "repair_status": "DETECTED", # Initial state for Differentiator 1 demo
        "confidence": 97.4,
        "image_ref": "pothole_annasalai_pth001.jpg",
        "is_critical": True,
        "route_ids": ["21G", "45B", "570"]
    }
    events_data.append(pth_001)
    route_caches["21G"].append("PTH-001")
    route_caches["45B"].append("PTH-001")
    route_caches["570"].append("PTH-001")

    # Observations for PTH-001: First bus uploads full, next 3 deduplicate!
    obs_buses = [("BUS-01", True, 4850.0), ("BUS-05", False, 1.2), ("BUS-08", False, 1.1), ("BUS-12", False, 1.2)]
    for b_id, is_full, p_size in obs_buses:
        observations_data.append({
            "id": f"OBS-{len(observations_data)+1:04d}",
            "event_id": "PTH-001",
            "bus_id": b_id,
            "route_code": "21G",
            "timestamp": (now - timedelta(hours=random.randint(1, 40))).isoformat() + "Z",
            "lat": 13.0067 + random.uniform(-0.0001, 0.0001),
            "lng": 80.2023 + random.uniform(-0.0001, 0.0001),
            "confidence": round(random.uniform(94.0, 98.5), 1),
            "camera_angle": "FRONT",
            "is_full_upload": is_full,
            "payload_size_kb": p_size
        })

    # Pothole Event 2: PTH-002
    pth_002 = {
        "id": "PTH-002",
        "type": "POTHOLE",
        "subtype": "Medium Surface Cavity (Depth 6cm)",
        "category": "ROAD_DEFECT",
        "severity": "HIGH",
        "severity_score": 72.0,
        "road_name": "OMR - Thoraipakkam Junction",
        "lat": 12.9348,
        "lng": 80.2312,
        "first_detected": (now - timedelta(days=3)).isoformat() + "Z",
        "last_detected": (now - timedelta(minutes=45)).isoformat() + "Z",
        "observation_count": 3,
        "observing_buses": ["BUS-03", "BUS-09", "BUS-17"],
        "repair_status": "ASSIGNED",
        "confidence": 95.2,
        "image_ref": "pothole_omr_pth002.jpg",
        "is_critical": False,
        "route_ids": ["19B", "570", "102X"]
    }
    events_data.append(pth_002)
    route_caches["19B"].append("PTH-002")
    route_caches["570"].append("PTH-002")

    for b_id, is_full in [("BUS-03", True), ("BUS-09", False), ("BUS-17", False)]:
        observations_data.append({
            "id": f"OBS-{len(observations_data)+1:04d}",
            "event_id": "PTH-002",
            "bus_id": b_id,
            "route_code": "19B",
            "timestamp": (now - timedelta(hours=random.randint(2, 30))).isoformat() + "Z",
            "lat": 12.9348,
            "lng": 80.2312,
            "confidence": 95.2,
            "camera_angle": "FRONT",
            "is_full_upload": is_full,
            "payload_size_kb": 4900.0 if is_full else 1.2
        })

    # Waterlogging Event: WATER-001 (For Causality Differentiator 3)
    water_001 = {
        "id": "WATER-001",
        "type": "WATERLOGGING",
        "subtype": "Lane Inundation (Water Depth 14cm)",
        "category": "ROAD_DEFECT",
        "severity": "CRITICAL",
        "severity_score": 91.0,
        "road_name": "GST Road, Near Airport Subway",
        "lat": 12.9815,
        "lng": 80.1636,
        "first_detected": (now - timedelta(hours=6)).isoformat() + "Z",
        "last_detected": (now - timedelta(minutes=8)).isoformat() + "Z",
        "observation_count": 3,
        "observing_buses": ["BUS-02", "BUS-06", "BUS-14"],
        "repair_status": "REPAIR_IN_PROGRESS",
        "confidence": 96.8,
        "image_ref": "waterlogging_gst_001.jpg",
        "is_critical": True,
        "route_ids": ["21G"]
    }
    events_data.append(water_001)
    route_caches["21G"].append("WATER-001")

    # Generate additional 105 realistic urban events across Chennai
    event_templates = [
        ("POTHOLE", "ROAD_DEFECT", ["Surface Crater", "Asphalt Depression", "Manhole Subsidence", "Edge Pothole"], ["HIGH", "MEDIUM", "CRITICAL"]),
        ("DAMAGED_ROAD", "ROAD_DEFECT", ["Alligator Cracking", "Longitudinal Crack", "Surface Ravelling"], ["MEDIUM", "LOW", "HIGH"]),
        ("WATERLOGGING", "ROAD_DEFECT", ["Curb Overflow", "Underpass Inundation", "Puddle Ponding"], ["CRITICAL", "HIGH", "MEDIUM"]),
        ("MISSING_ZEBRA", "INFRASTRUCTURE", ["Faded Paint (>80%)", "Completely Missing Crossing", "Worn Pedestrian Lane"], ["HIGH", "MEDIUM"]),
        ("MISSING_SIGN", "INFRASTRUCTURE", ["Missing Speed Limit (40kmh)", "Missing Stop Sign", "Obscured One-Way Board"], ["MEDIUM", "LOW"]),
        ("DAMAGED_SIGNAL", "INFRASTRUCTURE", ["Blinking Yellow Outage", "Broken Lens Cover", "Misaligned Traffic Signal"], ["CRITICAL", "HIGH"]),
        ("DAMAGED_DIVIDER", "INFRASTRUCTURE", ["Broken Median Concrete", "Missing Reflector Studs", "Misplaced Barricade"], ["HIGH", "MEDIUM"]),
        ("CONGESTION", "TRAFFIC", ["Bottleneck Shockwave", "Illegal Shoulder Parking", "Intersection Gridlock"], ["HIGH", "CRITICAL"]),
        ("RASH_DRIVING", "SAFETY", ["Unsafe Overtaking at Blind Curve", "Lane Tailgating", "Sudden Swerving"], ["HIGH", "CRITICAL"]),
        ("UNSAFE_CROSSING", "SAFETY", ["Pedestrian Jaywalking over Median", "High Vulnerability School Zone", "Low Visibility Crossing"], ["HIGH", "CRITICAL"])
    ]

    chennai_locations = [
        ("Anna Salai, Mount Road", 13.0604, 80.2496, ["21G", "5C"]),
        ("Nandanam Signal Junction", 13.0418, 80.2341, ["21G"]),
        ("T. Nagar Panagal Park", 13.0405, 80.2337, ["19B", "5C"]),
        ("Saidapet Maraimalai Adigal Bridge", 13.0213, 80.2231, ["19B"]),
        ("Tidel Park Junction, Tharamani", 12.9863, 80.2432, ["19B", "102X"]),
        ("Perungudi OMR Toll", 12.9698, 80.2458, ["19B"]),
        ("Sholinganallur Junction", 12.9010, 80.2279, ["19B", "570", "102X"]),
        ("Siruseri IT Park Gate 1", 12.8398, 80.2234, ["19B", "570"]),
        ("Adyar LB Road Junction", 13.0063, 80.2575, ["23C", "47A"]),
        ("Mylapore Luz Church Road", 13.0336, 80.2677, ["23C"]),
        ("Koyambedu CMBT Flyover", 13.0712, 80.1989, ["45B", "570"]),
        ("Vadapalani 100 Feet Road", 13.0521, 80.2123, ["45B", "570"]),
        ("Ashok Nagar 11th Avenue", 13.0345, 80.2156, ["45B"]),
        ("Porur Signal Roundabout", 13.0378, 80.1589, ["88K"]),
        ("Marina Beach Kamarajar Salai", 13.0500, 80.2824, ["102X", "29C"]),
        ("Velachery Bypass Road", 12.9798, 80.2212, ["570"]),
        ("Central Station EVR Periyar Salai", 13.0827, 80.2707, ["21G", "5C", "29C"]),
        ("Egmore Gandhi Irwin Road", 13.0732, 80.2609, ["5C"]),
        ("Nungambakkam High Road", 13.0588, 80.2428, ["5C"]),
        ("Villivakkam MTH Road", 13.1078, 80.2089, ["47A"])
    ]

    event_counter = 4
    for i in range(105):
        tmpl = random.choice(event_templates)
        loc = random.choice(chennai_locations)
        ev_type = tmpl[0]
        cat = tmpl[1]
        subtype = random.choice(tmpl[2])
        sev = random.choice(tmpl[3])
        
        prefix = {
            "POTHOLE": "PTH",
            "DAMAGED_ROAD": "DMG",
            "WATERLOGGING": "WATER",
            "MISSING_ZEBRA": "ZEB",
            "MISSING_SIGN": "SIGN",
            "DAMAGED_SIGNAL": "SIG",
            "DAMAGED_DIVIDER": "DIV",
            "CONGESTION": "TRF",
            "RASH_DRIVING": "SAF",
            "UNSAFE_CROSSING": "PED"
        }.get(ev_type, "EVT")

        ev_id = f"{prefix}-{event_counter:03d}"
        event_counter += 1

        lat = round(loc[1] + random.uniform(-0.006, 0.006), 5)
        lng = round(loc[2] + random.uniform(-0.006, 0.006), 5)
        obs_count = random.choice([1, 1, 2, 2, 3, 4])
        
        buses_picking = random.sample([f"BUS-{b:02d}" for b in range(1, 21)], obs_count)
        
        # Repair status distribution
        if cat in ["ROAD_DEFECT", "INFRASTRUCTURE"]:
            rep_status = random.choice(["DETECTED", "DETECTED", "ASSIGNED", "REPAIR_IN_PROGRESS", "REPAIR_VERIFIED"])
        else:
            rep_status = "N/A"

        ev_item = {
            "id": ev_id,
            "type": ev_type,
            "subtype": subtype,
            "category": cat,
            "severity": sev,
            "severity_score": random.randint(45, 96),
            "road_name": f"{loc[0]} ({subtype})",
            "lat": lat,
            "lng": lng,
            "first_detected": (now - timedelta(days=random.randint(1, 10), hours=random.randint(1, 20))).isoformat() + "Z",
            "last_detected": (now - timedelta(minutes=random.randint(5, 300))).isoformat() + "Z",
            "observation_count": obs_count,
            "observing_buses": buses_picking,
            "repair_status": rep_status,
            "confidence": round(random.uniform(88.0, 98.8), 1),
            "image_ref": f"{prefix.lower()}_{event_counter}.jpg",
            "is_critical": sev == "CRITICAL",
            "route_ids": loc[3]
        }
        events_data.append(ev_item)

        # Add to route caches
        for r_code in loc[3]:
            if r_code in route_caches:
                route_caches[r_code].append(ev_id)

        # Create Observations: First bus uploads full, subsequent buses deduplicate!
        for idx, b_id in enumerate(buses_picking):
            is_full = (idx == 0)
            observations_data.append({
                "id": f"OBS-{len(observations_data)+1:04d}",
                "event_id": ev_id,
                "bus_id": b_id,
                "route_code": loc[3][0] if loc[3] else "21G",
                "timestamp": (now - timedelta(hours=random.randint(1, 48))).isoformat() + "Z",
                "lat": lat + random.uniform(-0.0001, 0.0001),
                "lng": lng + random.uniform(-0.0001, 0.0001),
                "confidence": ev_item["confidence"],
                "camera_angle": random.choice(["FRONT", "FRONT", "FRONT", "LEFT", "RIGHT", "REAR"]),
                "is_full_upload": is_full,
                "payload_size_kb": 4800.0 if is_full else 1.2
            })

    db.events.insert_many(events_data)
    db.event_observations.insert_many(observations_data)

    # Store route caches
    cache_records = [{"route_code": k, "active_event_ids": v, "updated_at": now.isoformat() + "Z"} for k, v in route_caches.items()]
    db.route_event_cache.insert_many(cache_records)

    # -------------------------------------------------------------
    # 4. REPAIR WORK ORDERS (Differentiator 1)
    # -------------------------------------------------------------
    repairs_data = [
        {
            "id": "WO-891",
            "event_id": "PTH-001",
            "road_name": "Anna Salai, Guindy Kathipara Junction",
            "issue_type": "Severe Surface Depression (Pothole)",
            "severity": "CRITICAL",
            "contractor": "Chennai Corporation Div-5 PWD",
            "status": "DETECTED", # Initial state for live interactive demo
            "assigned_date": (now - timedelta(days=2)).isoformat() + "Z",
            "completion_date": None,
            "rescan_bus_id": "BUS-15",
            "rescan_date": None,
            "verification_confidence": None,
            "verification_result": None
        },
        {
            "id": "WO-884",
            "event_id": "PTH-002",
            "road_name": "OMR - Thoraipakkam Junction",
            "issue_type": "Medium Pothole",
            "severity": "HIGH",
            "contractor": "Tamil Nadu Road Dev Co (TNRDC)",
            "status": "ASSIGNED",
            "assigned_date": (now - timedelta(days=1)).isoformat() + "Z",
            "completion_date": None,
            "rescan_bus_id": "BUS-09",
            "rescan_date": None,
            "verification_confidence": None,
            "verification_result": None
        },
        {
            "id": "WO-872",
            "event_id": "PTH-015",
            "road_name": "Mount Road Gemini Flyover",
            "issue_type": "Cracked Asphalt & Pothole",
            "severity": "HIGH",
            "contractor": "Chennai PWD Zone 9",
            "status": "REPAIR_VERIFIED",
            "assigned_date": (now - timedelta(days=6)).isoformat() + "Z",
            "completion_date": (now - timedelta(days=2)).isoformat() + "Z",
            "rescan_bus_id": "BUS-04",
            "rescan_date": (now - timedelta(days=1)).isoformat() + "Z",
            "verification_confidence": 96.4,
            "verification_result": "VERIFIED_CLEAN"
        },
        {
            "id": "WO-865",
            "event_id": "PTH-019",
            "road_name": "Koyambedu 100 Feet Road",
            "issue_type": "Deep Pothole",
            "severity": "HIGH",
            "contractor": "Metro Highway Maintenance Div",
            "status": "REPAIR_VERIFIED",
            "assigned_date": (now - timedelta(days=8)).isoformat() + "Z",
            "completion_date": (now - timedelta(days=3)).isoformat() + "Z",
            "rescan_bus_id": "BUS-11",
            "rescan_date": (now - timedelta(days=2)).isoformat() + "Z",
            "verification_confidence": 95.8,
            "verification_result": "VERIFIED_CLEAN"
        }
    ]
    db.repairs.insert_many(repairs_data)

    # -------------------------------------------------------------
    # 5. INCIDENTS / ANPR CAPTURES
    # -------------------------------------------------------------
    incidents_data = [
        {
            "id": "INC-001",
            "timestamp": (now - timedelta(minutes=34)).isoformat() + "Z",
            "location": "Anna Salai near DMS Metro",
            "road_name": "Anna Salai, Teynampet",
            "type": "HIT_AND_RUN",
            "vehicle_type": "WHITE SUV (Creta)",
            "plate_number": "TN-09-AB-1234",
            "plate_confidence": 94.2,
            "speed_kmh": 68.5,
            "detecting_bus_id": "BUS-04",
            "camera_angle": "REAR",
            "status": "DISPATCHED_TO_POLICE"
        },
        {
            "id": "INC-002",
            "timestamp": (now - timedelta(hours=2, minutes=15)).isoformat() + "Z",
            "location": "OMR SRP Tools Junction",
            "road_name": "Rajiv Gandhi Salai (OMR)",
            "type": "RASH_DRIVING",
            "vehicle_type": "SEDAN (Honda City)",
            "plate_number": "TN-22-CX-8890",
            "plate_confidence": 96.0,
            "speed_kmh": 74.0,
            "detecting_bus_id": "BUS-07",
            "camera_angle": "FRONT",
            "status": "UNDER_REVIEW"
        },
        {
            "id": "INC-003",
            "timestamp": (now - timedelta(hours=5)).isoformat() + "Z",
            "location": "Guindy Kathipara Slip Road",
            "road_name": "GST Road",
            "type": "RED_LIGHT_VIOLATION",
            "vehicle_type": "COMMERCIAL TRUCK",
            "plate_number": "TN-10-H-4412",
            "plate_confidence": 91.5,
            "speed_kmh": 52.0,
            "detecting_bus_id": "BUS-15",
            "camera_angle": "RIGHT",
            "status": "DISPATCHED_TO_POLICE"
        }
    ]
    db.incidents.insert_many(incidents_data)

    # -------------------------------------------------------------
    # 6. CAUSALITY CHAINS (Differentiator 3)
    # -------------------------------------------------------------
    causality_data = [
        {
            "id": "CAUS-001",
            "title": "Monsoon Inundation & Speed Degeneration",
            "root_cause": "Intense Rainfall (42 mm/h in South Corridor)",
            "road_condition": "Severe Waterlogging on Anna Salai & Guindy (14cm Depth)",
            "traffic_impact_pct": 42,
            "bus_speed_impact_pct": -31,
            "route_delay_min": 14,
            "affected_routes": ["21G", "21A", "5C", "45B"],
            "timeline": [
                {"time": "08:15 AM", "event": "Heavy cloudburst commences over Guindy-Saidapet corridor"},
                {"time": "08:30 AM", "event": "BUS-01 & BUS-06 detect rising waterlogging (WATER-001)"},
                {"time": "08:45 AM", "event": "Vehicular bottleneck forms as cars avoid center lane"},
                {"time": "09:00 AM", "event": "Average fleet speed drops from 32 km/h to 14 km/h"},
                {"time": "09:15 AM", "event": "Route 21G cumulative schedule delay reaches +14 mins"}
            ]
        },
        {
            "id": "CAUS-002",
            "title": "Traffic Signal Malfunction Cascade",
            "root_cause": "Power Surge at T. Nagar Panagal Park Signal (SIG-004)",
            "road_condition": "Unregulated Multi-Directional Vehicle Conflict",
            "traffic_impact_pct": 58,
            "bus_speed_impact_pct": -45,
            "route_delay_min": 22,
            "affected_routes": ["19B", "5C", "47A"],
            "timeline": [
                {"time": "11:20 AM", "event": "BUS-03 Front AI flags malfunctioning traffic signal"},
                {"time": "11:32 AM", "event": "Intersection vehicle density spikes to 88% capacity"},
                {"time": "11:45 AM", "event": "Bus route 19B and 5C encounter 22-minute backlog"}
            ]
        },
        {
            "id": "CAUS-003",
            "title": "PTH-001 Severity Evolution Lifecycle",
            "root_cause": "Heavy Axle Traffic + Monsoon Water Ingress",
            "road_condition": "Micro-cracking rapidly expanding to 9cm pothole crater",
            "traffic_impact_pct": 28,
            "bus_speed_impact_pct": -18,
            "route_delay_min": 8,
            "affected_routes": ["21G", "45B", "570"],
            "timeline": [
                {"day": "Day 1", "stage": "Small surface crack", "severity_pct": 32, "notes": "Observed by BUS-01"},
                {"day": "Day 5", "stage": "Cavity depression expands", "severity_pct": 51, "notes": "Observed by BUS-05"},
                {"day": "Day 10", "stage": "Critical 9cm deep pothole", "severity_pct": 84, "notes": "Observed by BUS-08, BUS-12"},
                {"day": "Day 12", "stage": "Assigned to Municipal Contractor", "severity_pct": 84, "notes": "Work order WO-891 created"},
                {"day": "Day 14", "stage": "Contractor marks REPAIR COMPLETED", "severity_pct": 0, "notes": "Flagged for AI re-scan"},
                {"day": "Day 15", "stage": "BUS-15 Autonomous Re-scan", "severity_pct": 0, "notes": "AI verifies pothole gone (96% conf)"}
            ]
        }
    ]
    db.causality_chains.insert_many(causality_data)

    # -------------------------------------------------------------
    # 7. BANDWIDTH SAVINGS METRICS (Differentiator 2)
    # -------------------------------------------------------------
    total_obs = len(observations_data)
    unique_ev = len(events_data)
    dups_suppressed = total_obs - unique_ev
    trad_mb = round((total_obs * 4.8), 1) # If every observation uploaded 4.8MB
    opt_mb = round((unique_ev * 4.8) + (dups_suppressed * 0.0012), 1)
    saved_mb = round(trad_mb - opt_mb, 1)
    saved_pct = round((saved_mb / trad_mb) * 100, 1)

    bw_metrics = {
        "total_detections": total_obs,
        "unique_events": unique_ev,
        "duplicate_suppressions": dups_suppressed,
        "full_evidence_uploads": unique_ev,
        "metadata_uploads": dups_suppressed,
        "traditional_volume_mb": trad_mb,
        "optimized_volume_mb": opt_mb,
        "bandwidth_saved_pct": saved_pct,
        "total_saved_mb": saved_mb,
        "updated_at": now.isoformat() + "Z"
    }
    db.bandwidth_metrics.insert_one(bw_metrics)

    print(f"Seed Data Generation Complete!")
    print(f"Buses: {db.buses.count_documents()} | Routes: {db.routes.count_documents()}")
    print(f"Events: {db.events.count_documents()} | Observations: {db.event_observations.count_documents()}")
    print(f"Bandwidth Saved: {saved_pct}% ({saved_mb} MB saved across fleet)")

if __name__ == "__main__":
    import sys
    if "--reset" in sys.argv:
        print("[RESET] Re-seeding fresh CityPulse Urban AI dataset...")
    generate_seed_data()

