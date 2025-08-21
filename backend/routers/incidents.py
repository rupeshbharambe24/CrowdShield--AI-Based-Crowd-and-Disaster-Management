from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
import uuid

incidents_bp = APIRouter()

class IncidentRaise(BaseModel):
    type: str
    zoneId: str

class IncidentAck(BaseModel):
    id: str

# In-memory store (for hackathon demo)
INCIDENTS = []

@incidents_bp.post("/raise")
async def raise_incident(incident: IncidentRaise):
    """
    Simulate raising an incident.
    """
    new_incident = {
        "id": str(uuid.uuid4()),
        "type": incident.type,
        "zoneId": incident.zoneId,
        "time": datetime.utcnow().isoformat(),
        "status": "active",
    }
    INCIDENTS.append(new_incident)
    return {"message": "Incident raised", "incident": new_incident}

@incidents_bp.post("/ack")
async def acknowledge_incident(body: IncidentAck):
    """
    Acknowledge an active incident.
    """
    for inc in INCIDENTS:
        if inc["id"] == body.id:
            inc["status"] = "acknowledged"
            return {"message": "Incident acknowledged", "incident": inc}
    return {"error": "Incident not found"}

@incidents_bp.get("/")
async def list_incidents():
    """
    Get list of all incidents.
    """
    return INCIDENTS
