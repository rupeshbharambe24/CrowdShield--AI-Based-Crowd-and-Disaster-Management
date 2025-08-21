"""
Config Utility
- Loads environment variables and provides app-wide config
"""

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    DEBUG = os.getenv("DEBUG", "true").lower() == "true"

    MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN", "")

    # Zone / tracking settings
    FRAME_RATE = int(os.getenv("FRAME_RATE", 10))
    CAPACITY_THRESHOLD = int(os.getenv("CAPACITY_THRESHOLD", 80))
