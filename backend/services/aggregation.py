"""
Aggregation Service
- Aggregates detections/tracks into zone-level stats
"""

from collections import defaultdict
import datetime

class Aggregator:
    def __init__(self, zone_manager):
        self.zone_manager = zone_manager

    def aggregate(self, tracked_detections: list):
        """
        Input: tracked detections with zoneId
        Output: zone -> count + timestamp
        """
        zone_counts = defaultdict(int)
        for det in tracked_detections:
            if det.get("zoneId"):
                zone_counts[det["zoneId"]] += 1

        stats = {
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "zones": [
                {"id": zid, "count": cnt, "capacity": 100, "utilization": round((cnt / 100) * 100, 1)}
                for zid, cnt in zone_counts.items()
            ],
        }
        return stats
