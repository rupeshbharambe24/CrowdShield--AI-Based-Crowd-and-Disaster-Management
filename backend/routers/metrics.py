from fastapi import APIRouter
from datetime import datetime
import random

router = APIRouter()

@router.get("/")
async def get_metrics():
    """
    Return snapshot of zones, gates, and KPIs.
    For demo purposes, generates fake numbers.
    """
    zones = [
        {
            "id": "gate3_area",
            "name": "Gate 3",
            "capacity": 200,
            "density": round(random.uniform(0.2, 1.5), 2),   # people per m2
            "utilization": round(random.uniform(30, 95), 1), # %
            "isGate": True,
        },
        {
            "id": "plaza",
            "name": "Main Plaza",
            "capacity": 500,
            "density": round(random.uniform(0.1, 2.0), 2),
            "utilization": round(random.uniform(20, 99), 1),
            "isGate": False,
        },
    ]

    return {
        "timestamp": datetime.utcnow().isoformat(),
        "zones": zones,
        "kpis": {
            "total_headcount": sum(int(z["capacity"] * z["utilization"] / 100) for z in zones),
            "zones_over_70": sum(1 for z in zones if z["utilization"] > 70),
            "zones_over_90": sum(1 for z in zones if z["utilization"] > 90),
        },
    }
