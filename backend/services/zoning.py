"""
Zone Manager
- Defines areas (zones, gates)
- Provides mapping: which detection is inside which zone
"""

from shapely.geometry import Point, Polygon

class ZoneManager:
    def __init__(self):
        # Define mock zones as polygons
        self.zones = {
            "gate3_area": Polygon([(0, 0), (300, 0), (300, 200), (0, 200)]),
            "plaza": Polygon([(300, 0), (600, 0), (600, 400), (300, 400)]),
        }

    def locate(self, detections: list) -> list:
        """
        Annotate detections with zone IDs.
        """
        results = []
        for det in detections:
            x, y, _, _ = det["bbox"]
            pt = Point(x, y)
            assigned = None
            for zone_id, poly in self.zones.items():
                if poly.contains(pt):
                    assigned = zone_id
                    break
            det["zoneId"] = assigned
            results.append(det)
        return results

    def get_zones(self):
        """
        Return available zones with basic info.
        """
        return [{"id": zid, "coords": list(poly.exterior.coords)} for zid, poly in self.zones.items()]
