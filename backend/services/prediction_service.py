"""
Prediction Service
- Wraps Inference + Tracking + Zoning + Aggregation
- Provides single function: process_frame(frame) -> metrics
"""

from .inference_service import InferenceService
from .tracking import Tracker
from .zoning import ZoneManager
from .aggregation import Aggregator

class PredictionService:
    def __init__(self):
        self.inference = InferenceService()
        self.tracker = Tracker()
        self.zones = ZoneManager()
        self.aggregator = Aggregator(self.zones)

    def process_frame(self, frame):
        detections = self.inference.detect_people(frame)
        tracked = self.tracker.update(detections)
        with_zones = self.zones.locate(tracked)
        stats = self.aggregator.aggregate(with_zones)
        return stats
