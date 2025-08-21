"""
Rules Engine
- Defines incident rules (thresholds, anomalies)
"""

class RulesEngine:
    def __init__(self, capacity_threshold=80):
        self.capacity_threshold = capacity_threshold

    def evaluate(self, metrics):
        """
        Check zone utilizations -> return incidents
        """
        incidents = []
        for zone in metrics.get("zones", []):
            if zone["utilization"] > self.capacity_threshold:
                incidents.append({
                    "zone": zone["id"],
                    "issue": "overcapacity",
                    "utilization": zone["utilization"]
                })
        return incidents
