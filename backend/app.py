from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import metrics, predict, routing, incidents

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
app.include_router(metrics.metrics_bp, prefix="/metrics", tags=["Metrics"])
app.include_router(predict.predict_bp, prefix="/predict", tags=["Prediction"])
app.include_router(routing.routing_bp, prefix="/routing", tags=["Routing"])
app.include_router(incidents.incidents_bp, prefix="/incidents", tags=["Incidents"])

@app.get("/")
async def home():
    return {"message": "CrowdShield Backend is running!"}
