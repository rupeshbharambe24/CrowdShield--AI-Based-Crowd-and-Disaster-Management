from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
import random

router = APIRouter()

class PredictRequest(BaseModel):
    horizonSec: int = 300

@router.post("/")
async def predict_future(req: PredictRequest):
    """
    Forecast crowd risk for given horizon (seconds).
    Fake demo: returns random risk levels.
    """
    predictions = [
        {
            "zoneId": "gate3_area",
            "riskLevel": random.choice(["low", "medium", "high"]),
            "predictedUtilization": round(random.uniform(40, 95), 1),
        },
        {
            "zoneId": "plaza",
            "riskLevel": random.choice(["low", "medium", "high"]),
            "predictedUtilization": round(random.uniform(30, 99), 1),
        },
    ]

    return {
        "timestamp": datetime.utcnow().isoformat(),
        "horizonSec": req.horizonSec,
        "predictions": predictions,
    }
