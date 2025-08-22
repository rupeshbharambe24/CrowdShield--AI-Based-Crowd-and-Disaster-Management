from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
import random
import threading
import json

# Import your existing modules
from .simulation import update_density
from .detection import detect_anomaly
from .yolov8_detect import camera_stream

app = FastAPI(title="CrowdShield Backend", version="1.0")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Zones and simulation data ---
ZONES = [
    {"id": "main-entrance", "name": "Main Entrance", "isGate": True, "coordinates": [19.076, 72.8777]},
    {"id": "food-court", "name": "Food Court", "isGate": False, "coordinates": [19.077, 72.878]},
    {"id": "stage-area", "name": "Stage Area", "isGate": False, "coordinates": [19.078, 72.879]},
    {"id": "corridor-a", "name": "Corridor A", "isGate": False, "coordinates": [19.079, 72.880]},
    {"id": "corridor-b", "name": "Corridor B", "isGate": False, "coordinates": [19.080, 72.881]},
    {"id": "parking-gate", "name": "Parking Gate", "isGate": True, "coordinates": [19.081, 72.882]},
]

zone_data = {
    z["id"]: {
        **z,
        "density": random.randint(20, 60),
        "utilization": random.randint(20, 60),
        "sparklineData": []
    }
    for z in ZONES
}

clients = []  # Connected WebSocket clients
camera_alerts = []

# --- Background YOLOv8 detection ---
def run_camera():
    global camera_alerts
    for _, alerts in camera_stream(0):
        camera_alerts = alerts

threading.Thread(target=run_camera, daemon=True).start()

# --- Crowd simulation functions ---
def update_zones():
    for z in zone_data.values():
        arrivals = random.randint(0, 3)
        departures = random.randint(0, 2)
        z["density"] = max(0, min(100, z["density"] + arrivals - departures))
        z["utilization"] = z["density"]
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
        "alertsLast10Min": 0
    }

async def broadcast(message: dict):
    dead_clients = []
    for ws in clients:
        try:
            await ws.send_text(json.dumps(message))
        except:
            dead_clients.append(ws)
    for ws in dead_clients:
        clients.remove(ws)

# --- API Endpoints ---
@app.get("/")
async def home():
    return {"message": "CrowdShield Backend is running!"}

@app.get("/api/zones")
async def get_zones():
    update_zones()
    return JSONResponse(list(zone_data.values()))

# --- WebSocket for frontend ---
@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    clients.append(ws)
    try:
        while True:
            await asyncio.sleep(2)  # update every 2 seconds
            update_zones()
            kpis = compute_kpis()
            # Combine density + anomaly detection + YOLOv8 alerts
            alerts = detect_anomaly(list(zone_data.values())) + camera_alerts
            payload = {
                "type": "zone_update",
                "zones": list(zone_data.values()),
                "kpis": kpis,
                "alerts": alerts
            }
            await broadcast(payload)
    except WebSocketDisconnect:
        clients.remove(ws)
