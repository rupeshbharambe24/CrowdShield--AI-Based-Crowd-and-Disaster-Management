"""
CrowdShield Service Layer
Encapsulates business logic: inference, tracking, zoning, aggregation.
Routers call these functions, not raw code.
"""

from .inference_service import InferenceService
from .tracking import Tracker
from .zoning import ZoneManager
from .aggregation import Aggregator
