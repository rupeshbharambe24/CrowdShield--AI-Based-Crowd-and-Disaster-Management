from fastapi import APIRouter

from . import metrics, predict, routing, incidents

api_router = APIRouter()

# Register all routers
api_router.include_router(metrics.metrics_bp, prefix="/api/metrics", tags=["Metrics"])
api_router.include_router(predict.predict_bp, prefix="/api/predict", tags=["Prediction"])
api_router.include_router(routing.routing_bp, prefix="/api/route", tags=["Routing"])
api_router.include_router(incidents.incidents_bp, prefix="/api/incidents", tags=["Incidents"])
