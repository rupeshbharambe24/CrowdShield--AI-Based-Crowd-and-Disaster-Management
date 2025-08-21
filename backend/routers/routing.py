from fastapi import APIRouter, Query
from datetime import datetime

routing_bp = APIRouter()

@routing_bp.get("/")
async def get_route(from_zone: str = Query(...), to: str = Query(...)):
    """
    Return a mock route between two zones/gates.
    Replace with real pathfinding over graph.geojson if available.
    """
    route = {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [72.8777, 19.0760],  # Example: Mumbai-ish coords
                [72.8785, 19.0765],
                [72.8790, 19.0770],
            ],
        },
        "properties": {
            "from": from_zone,
            "to": to,
            "createdAt": datetime.utcnow().isoformat(),
        },
    }
    return route
