from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .routers import metrics, predict, routing, incidents, websocket
import asyncio
import random
import json

app = FastAPI(title="CrowdShield Backend", version="1.0")

ZONES = [
    {"id": "main-entrance", "name": "Main Entrance", "isGate": True, "coordinates": [19.076, 72.8777]},
    {"id": "food-court", "name": "Food Court", "isGate": False, "coordinates": [19.077, 72.878]},
    {"id": "stage-area", "name": "Stage Area", "isGate": False, "coordinates": [19.078, 72.879]},
    {"id": "corridor-a", "name": "Corridor A", "isGate": False, "coordinates": [19.079, 72.880]},
    {"id": "corridor-b", "name": "Corridor B", "isGate": False, "coordinates": [19.080, 72.881]},
    {"id": "parking-gate", "name": "Parking Gate", "isGate": True, "coordinates": [19.081, 72.882]},
]

# Each zone stores density + sparkline
zone_data = {
    z["id"]: {
        **z,
        "density": random.randint(20, 60),
        "utilization": random.randint(20, 60),
        "sparklineData": []
    }
    for z in ZONES
}

clients = []  # connected WebSocket clients

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(metrics.router, prefix="/api/metrics", tags=["Metrics"])
app.include_router(predict.router, prefix="/api/predict", tags=["Prediction"])
app.include_router(routing.router, prefix="/api/routing", tags=["Routing"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["Incidents"])
app.include_router(websocket.router, tags=["websocket"])

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    clients.append(ws)
    try:
        while True:
            await asyncio.sleep(2)  # update every 2s
            update_zones()
            kpis = compute_kpis()
            payload = {
                "type": "zone_update",
                "zones": list(zone_data.values()),
                "kpis": kpis
            }
            await broadcast(payload)
    except WebSocketDisconnect:
        clients.remove(ws)

def update_zones():
    """Simulate people movement and update sparkline"""
    for z in zone_data.values():
        arrivals = random.randint(0, 3)
        departures = random.randint(0, 2)
        z["density"] = max(0, min(100, z["density"] + arrivals - departures))
        z["utilization"] = z["density"]
        # maintain last 20 density points
        z["sparklineData"].append(z["density"])
        if len(z["sparklineData"]) > 20:
            z["sparklineData"].pop(0)


def compute_kpis():
    total_people = sum(z["density"] for z in zone_data.values())
    zones_above_70 = sum(1 for z in zone_data.values() if z["density"] > 70)
    zones_above_90 = sum(1 for z in zone_data.values() if z["density"] > 90)
    return {
        "totalPeople": total_people,
        "zonesAbove70": zones_above_70,
        "zonesAbove90": zones_above_90,
        "alertsLast10Min": 0  # alerts will come later
    }


async def broadcast(message: dict):
    """Send payload to all connected clients"""
    dead_clients = []
    for ws in clients:
        try:
            await ws.send_text(json.dumps(message))
        except:
            dead_clients.append(ws)
    for ws in dead_clients:
        clients.remove(ws)
        
@app.get("/")
async def home():
    return {"message": "CrowdShield Backend is running!"}
