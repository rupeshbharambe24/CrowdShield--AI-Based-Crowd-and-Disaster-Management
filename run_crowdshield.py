"""
CrowdShield Entrypoint

This script launches the FastAPI backend and serves the React frontend build.
It loads environment variables from `.env`, starts the API, WebSocket, and static files.
"""

import os
import uvicorn
from dotenv import load_dotenv

def main():
    # Load environment variables
    load_dotenv()

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))

    print(f"🚀 Starting CrowdShield backend on http://{host}:{port}")

    # Run uvicorn with autoreload for dev, disable in production
    uvicorn.run(
        "backend.app:app",
        host=host,
        port=port,
        reload=True,   # Set False in production
    )

if __name__ == "__main__":
    main()
