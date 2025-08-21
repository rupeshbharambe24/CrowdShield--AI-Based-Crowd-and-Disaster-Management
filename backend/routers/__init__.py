from fastapi import APIRouter

from . import metrics, predict, routing, incidents

api_router = APIRouter()

# Register all routers
api_router.include_router(metrics.router, prefix="/api/metrics", tags=["Metrics"])
api_router.include_router(predict.router, prefix="/api/predict", tags=["Prediction"])
api_router.include_router(routing.router, prefix="/api/route", tags=["Routing"])
api_router.include_router(incidents.router, prefix="/api/incidents", tags=["Incidents"])
