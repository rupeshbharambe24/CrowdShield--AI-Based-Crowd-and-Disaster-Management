"""
Geo Utility
- Helper for zone polygons, gates, and map operations
"""

from shapely.geometry import Point, Polygon

def point_in_zone(point, polygon_coords):
    """
    Check if a point (x,y) lies inside a zone polygon
    """
    polygon = Polygon(polygon_coords)
    return polygon.contains(Point(point))

def zone_center(polygon_coords):
    """
    Get centroid of polygon zone
    """
    polygon = Polygon(polygon_coords)
    return list(polygon.centroid.coords)[0]
