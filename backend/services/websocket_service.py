"""
WebSocket Service
- Pushes live metrics/incidents to frontend dashboard
"""

from fastapi import WebSocket

class WebSocketService:
    def __init__(self):
        self.connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.append(websocket)

    async def disconnect(self, websocket: WebSocket):
        self.connections.remove(websocket)

    async def broadcast(self, message: dict):
        for ws in self.connections:
            await ws.send_json(message)
