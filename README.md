<p align="center">
  <img src="https://img.shields.io/badge/CrowdShield-AI%20Crowd%20Management-red?style=for-the-badge&logo=shield&logoColor=white" alt="CrowdShield" />
</p>

<h1 align="center">CrowdShield</h1>
<p align="center">
  <strong>AI-Based Real-Time Crowd Monitoring and Disaster Management System</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.112-009688?style=flat-square&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/YOLOv8-Ultralytics-FF6F00?style=flat-square&logo=yolo&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/WebSocket-Real--Time-010101?style=flat-square&logo=socketdotio&logoColor=white" />
</p>

---

## Overview

CrowdShield is a real-time crowd monitoring and disaster management platform designed for large-scale events and public gatherings. It uses YOLOv8 object detection on live video feeds to track crowd density across zones, detect anomalies, predict congestion, and route crowds through safer paths during emergencies.

Built for scenarios like religious gatherings, concerts, stadiums, and festivals where stampede prevention and crowd flow optimization are critical.

---

## Features

### Real-Time Detection & Tracking
- Live person detection using **YOLOv8** on multiple camera feeds
- Multi-object tracking with **BoT-SORT** (via Ultralytics)
- Configurable inference FPS with frame-skipping for resource efficiency
- Supports CUDA GPU acceleration and CPU fallback

### Zone-Based Monitoring
- **GeoJSON-defined zones** with per-zone capacity limits
- Real-time density and utilization calculation per zone
- Amber (70%) and Red (90%) alert thresholds with cooldown
- Zone sparkline data for trend visualization

### Predictive Analytics
- Crowd density **prediction engine** (5-minute forecast horizon)
- LightGBM + XGBoost models for congestion prediction
- Auto-retraining at configurable intervals
- Walk-forward validation

### Emergency Routing
- **Graph-based shortest path routing** using NetworkX
- Density-aware cost function (avoids congested zones)
- Incident penalty routing (routes around active incidents)
- GeoJSON graph with real geographic coordinates

### Real-Time Communication
- **WebSocket** server for live dashboard updates
- **MQTT** integration for IoT sensor data ingestion
- Sub-second latency from detection to dashboard

### Interactive Dashboard
- React + TypeScript + Tailwind CSS + shadcn/ui
- **Mapbox GL** map with live zone heatmaps
- KPI cards: total count, density, alerts, utilization
- Alerts panel with severity levels and timestamps
- Zone drawing tools for on-the-fly zone creation
- Responsive sidebar with incident management

---

## Architecture

```
Camera Feeds ──► YOLOv8 Detection ──► Object Tracking (BoT-SORT)
                                            │
                                            ▼
                                    Zone Density Calc
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    ▼                       ▼                       ▼
             Rules Engine           Prediction Engine        Routing Engine
           (Anomaly Detection)    (LightGBM/XGBoost)     (Graph + NetworkX)
                    │                       │                       │
                    └───────────────────────┼───────────────────────┘
                                            │
                              ┌─────────────┼─────────────┐
                              ▼             ▼             ▼
                          WebSocket       MQTT         REST API
                              │
                              ▼
                    React Dashboard (Mapbox + Charts)
```

---

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Backend** | Python, FastAPI, Uvicorn |
| **Detection** | YOLOv8 (Ultralytics), OpenCV |
| **Tracking** | BoT-SORT, LAPX, FilterPy |
| **ML/Prediction** | LightGBM, XGBoost, scikit-learn |
| **Geospatial** | Shapely, GeoPandas, PyProj, NetworkX |
| **Messaging** | WebSocket, MQTT (Paho) |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **UI Components** | shadcn/ui (Radix primitives) |
| **Maps** | Mapbox GL JS |
| **Config** | YAML, GeoJSON, dotenv |

---

## Project Structure

```
CrowdShield/
├── backend/
│   ├── app.py                  # FastAPI application entry
│   ├── detection.py            # Anomaly detection logic
│   ├── simulation.py           # Zone density simulation
│   ├── yolov8_detect.py        # YOLO inference + camera stream
│   ├── routers/
│   │   ├── incidents.py        # Incident management endpoints
│   │   ├── metrics.py          # Zone metrics API
│   │   ├── predict.py          # Prediction endpoints
│   │   ├── routing.py          # Emergency routing API
│   │   └── websocket.py        # WebSocket handler
│   ├── services/
│   │   ├── inference_service.py    # Model inference orchestration
│   │   ├── prediction_service.py   # Congestion prediction
│   │   ├── routing_service.py      # Graph-based path routing
│   │   ├── rules_engine.py         # Alert rule processing
│   │   ├── mqtt_service.py         # MQTT broker communication
│   │   ├── websocket_service.py    # WebSocket broadcasting
│   │   ├── tracking.py             # Multi-object tracking
│   │   ├── zoning.py               # Zone management
│   │   ├── aggregation.py          # Data aggregation
│   │   └── recorder.py             # Event recording
│   └── utils/
│       ├── config.py           # Configuration loader
│       ├── geo.py              # Geospatial utilities
│       ├── video.py            # Video stream utilities
│       ├── logging.py          # Structured logging
│       └── timing.py           # Performance timing
├── config/
│   ├── config.yaml             # Application configuration
│   ├── cameras.yaml            # Camera feed definitions
│   ├── zones.geojson           # Zone boundaries
│   └── graph.geojson           # Routing graph
├── data/
│   ├── models/                 # Trained model weights
│   └── videos/                 # Sample video feeds
├── frontend/
│   ├── src/
│   │   ├── components/         # Dashboard, MapView, Sidebar, etc.
│   │   ├── hooks/              # WebSocket hooks
│   │   ├── store/              # Zustand state management
│   │   ├── pages/              # Route pages
│   │   └── lib/                # API client, utilities
│   ├── package.json
│   └── vite.config.ts
├── run_crowdshield.py          # Single-command launcher
├── requirements.txt
└── env.example
```

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Mapbox access token (free tier works)

### 1. Clone & Setup

```bash
git clone https://github.com/rupeshbharambe24/CrowdShield--AI-Based-Crowd-and-Disaster-Management.git
cd CrowdShield--AI-Based-Crowd-and-Disaster-Management
```

### 2. Backend

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend

```bash
cd frontend
npm install
npm run build                   # Build for production
cd ..
```

### 4. Environment

```bash
cp env.example .env
# Edit .env and add your MAPBOX_TOKEN
```

### 5. Run

```bash
python run_crowdshield.py
```

The dashboard will be available at `http://localhost:8000`. The API docs are at `http://localhost:8000/docs`.

---

## Configuration

All runtime settings are in `config/config.yaml`:

| Setting | Default | Description |
|:--------|:--------|:------------|
| `models.yolo_conf` | 0.30 | YOLO confidence threshold |
| `runtime.inference_fps` | 12 | Target processing FPS |
| `zones.capacity_people_per_m2` | 3.0 | Default zone capacity |
| `alerts.amber_utilization` | 0.70 | Amber alert threshold |
| `alerts.red_utilization` | 0.90 | Red alert threshold |
| `predictor.horizon_sec` | 300 | Prediction lookahead (5 min) |
| `mqtt.enabled` | false | Enable MQTT integration |

---

## API Endpoints

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/docs` | OpenAPI documentation |
| `WS` | `/ws` | WebSocket for real-time updates |
| `GET` | `/api/metrics` | Zone metrics and KPIs |
| `POST` | `/api/predict` | Crowd density prediction |
| `POST` | `/api/routing` | Emergency route calculation |
| `GET` | `/api/incidents` | List active incidents |
| `POST` | `/api/incidents` | Report new incident |

---

## License

This project is for educational and research purposes.
