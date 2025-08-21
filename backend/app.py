from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import metrics, predict, routing, incidents, websocket

app = FastAPI(title="CrowdShield Backend", version="1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(metrics.metrics_bp, prefix="/api/metrics", tags=["Metrics"])
app.include_router(predict.predict_bp, prefix="/api/predict", tags=["Prediction"])
app.include_router(routing.routing_bp, prefix="/api/routing", tags=["Routing"])
app.include_router(incidents.incidents_bp, prefix="/api/incidents", tags=["Incidents"])
app.include_router(websocket.router, tags=["websocket"])

@app.get("/")
async def home():
    return {"message": "CrowdShield Backend is running!"}
