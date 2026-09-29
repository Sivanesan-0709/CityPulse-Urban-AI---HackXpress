from fastapi import APIRouter
from typing import List, Dict, Any
from app.database import db

router = APIRouter(prefix="/api/road-conditions", tags=["Road Condition Intelligence"])

@router.get("")
async def get_road_conditions():
    """Returns Road Health Scores (0-100), degradation factors, and historical degradation trends"""
    events = db.events.find()
    
    # Analyze major corridors
    corridor_names = [
        "Anna Salai (Mount Road)",
        "Rajiv Gandhi Salai (OMR)",
        "Jawaharlal Nehru Road (100 Ft Rd)",
        "GST Road (Guindy - Tambaram)",
        "Poonamallee High Road",
        "LB Road (Adyar - Thiruvanmiyur)",
        "Kamarajar Salai (Marina)",
        "Arcot Road (Vadapalani - Porur)"
    ]
    
    roads = [
        {
            "id": "RC-01",
            "road_name": "Anna Salai (Mount Road)",
            "health_score": 54,
            "status": "CRITICAL",
            "potholes_count": 8,
            "cracks_count": 14,
            "waterlogging_risk": "HIGH",
            "traffic_stress": "SEVERE",
            "pci_rating": "Fair to Poor (PCI: 52)",
            "estimated_maintenance_cost_inr": "₹ 14.5 Lakhs",
            "primary_defects": ["PTH-001 Severe Pothole (Guindy)", "DMG-004 Alligator Cracks"]
        },
        {
            "id": "RC-02",
            "road_name": "Rajiv Gandhi Salai (OMR)",
            "health_score": 78,
            "status": "GOOD",
            "potholes_count": 3,
            "cracks_count": 6,
            "waterlogging_risk": "MEDIUM",
            "traffic_stress": "HIGH",
            "pci_rating": "Good (PCI: 78)",
            "estimated_maintenance_cost_inr": "₹ 6.2 Lakhs",
            "primary_defects": ["PTH-002 Thoraipakkam Pothole", "ZEB-008 Worn Zebra Crossing"]
        },
        {
            "id": "RC-03",
            "road_name": "Jawaharlal Nehru Road (100 Ft Rd)",
            "health_score": 48,
            "status": "CRITICAL",
            "potholes_count": 11,
            "cracks_count": 19,
            "waterlogging_risk": "HIGH",
            "traffic_stress": "EXTREME",
            "pci_rating": "Poor (PCI: 46)",
            "estimated_maintenance_cost_inr": "₹ 22.8 Lakhs",
            "primary_defects": ["PTH-009 Koyambedu Crater", "DIV-003 Broken Median Barrier"]
        },
        {
            "id": "RC-04",
            "road_name": "GST Road (Guindy - Tambaram)",
            "health_score": 62,
            "status": "MODERATE",
            "potholes_count": 6,
            "cracks_count": 10,
            "waterlogging_risk": "CRITICAL",
            "traffic_stress": "SEVERE",
            "pci_rating": "Moderate (PCI: 61)",
            "estimated_maintenance_cost_inr": "₹ 18.0 Lakhs",
            "primary_defects": ["WATER-001 Airport Subway Inundation", "PTH-012 Pallavaram Pothole"]
        },
        {
            "id": "RC-05",
            "road_name": "Kamarajar Salai (Marina Coastal)",
            "health_score": 91,
            "status": "EXCELLENT",
            "potholes_count": 1,
            "cracks_count": 2,
            "waterlogging_risk": "LOW",
            "traffic_stress": "LOW",
            "pci_rating": "Excellent (PCI: 91)",
            "estimated_maintenance_cost_inr": "₹ 1.8 Lakhs",
            "primary_defects": ["SIGN-011 Minor Sign Discoloration"]
        }
    ]
    
    avg_city_health = round(sum(r["health_score"] for r in roads) / len(roads), 1)
    
    return {
        "citywide_average_health_score": avg_city_health,
        "total_monitored_corridors_km": 178.4,
        "roads": roads,
        "city_health_distribution": {
            "excellent_pct": 20,
            "good_pct": 35,
            "moderate_pct": 25,
            "critical_pct": 20
        }
    }
