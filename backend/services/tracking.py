"""
Tracking Service
- Assigns IDs to detected people across frames
- Very simplified mock version for hackathon
"""

import itertools

class Tracker:
    def __init__(self):
        self._id_gen = itertools.count(1)
        self.active_tracks = {}

    def update(self, detections: list) -> list:
        """
        Input: list of detections (bbox, conf)
        Output: detections + assigned IDs
        """
        tracked = []
        for det in detections:
            pid = next(self._id_gen)
            det["id"] = pid
            tracked.append(det)
            self.active_tracks[pid] = det
        return tracked
