"""
Recorder Service
- Stores incidents or metrics in simple log file (or DB later)
"""

import json
import datetime

class Recorder:
    def __init__(self, filename="crowdshield_log.jsonl"):
        self.filename = filename

    def save(self, data: dict):
        entry = {
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "data": data
        }
        with open(self.filename, "a") as f:
            f.write(json.dumps(entry) + "\n")
