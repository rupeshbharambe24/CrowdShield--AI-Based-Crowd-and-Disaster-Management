"""
Routing Service
- Simulates crowd routing (direct people to alternative gates/zones)
"""

class RoutingService:
    def __init__(self, zones):
        self.zones = zones

    def suggest_route(self, zone_id):
        """
        If a zone is congested, suggest another.
        Very naive hackathon logic.
        """
        alternatives = [z for z in self.zones.keys() if z != zone_id]
        if not alternatives:
            return None
        return alternatives[0]  # pick first alternative
