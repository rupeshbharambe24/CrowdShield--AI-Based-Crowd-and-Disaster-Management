from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
import asyncio
import json
import time

router = APIRouter()

clients = []

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)

    try:
        while True:
            # 🔹 Demo payload (replace with real metrics service later)
            payload = {
                "type": "metrics",
                "payload": {
                    "timestamp": time.time(),
                    "zones": [
                        {"id": "zone-1", "name": "Main Entrance", "utilization": 70, "density": 420, "isGate": True},
                        {"id": "zone-2", "name": "Food Court", "utilization": 85, "density": 520, "isGate": False}
                    ],
                    "kpis": {
                        "totalPeople": 3000,
                        "zonesAbove70": 2,
                        "zonesAbove90": 1
                    }
                }
            }

            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(1)  # send every 1s

    except WebSocketDisconnect:
        clients.remove(websocket)
