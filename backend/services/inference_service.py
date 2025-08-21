"""
Video/ML Inference Service
- Loads detection model (YOLO/Detectron/etc.)
- Provides `detect_people(frame)` for crowd estimation
"""

import random
import numpy as np

class InferenceService:
    def __init__(self, model_path: str = None):
        self.model_path = model_path
        # In hackathon demo: skip actual loading
        print(f"[InferenceService] Initialized (model={model_path})")

    def detect_people(self, frame: np.ndarray) -> list:
        """
        Run detection on frame -> returns list of bounding boxes.
        For demo, returns random coords.
        """
        people = []
        n = random.randint(5, 20)
        for _ in range(n):
            x, y, w, h = [random.randint(0, 640), random.randint(0, 480), 50, 100]
            people.append({"bbox": [x, y, w, h], "confidence": round(random.uniform(0.5, 0.99), 2)})
        return people
