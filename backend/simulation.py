import random

zones = [
    {"id": 1, "coords": [(0,0),(0,10),(10,10),(10,0)], "density": 50},
    {"id": 2, "coords": [(10,0),(10,10),(20,10),(20,0)], "density": 30},
]

def update_density():
    for zone in zones:
        change = random.randint(-5,5)
        zone['density'] = max(0, zone['density'] + change)
    return zones
