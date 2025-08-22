import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useCrowdStore, Zone, Alert } from '../store/crowdStore';

export const MapView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { zones, alerts, showHeatmap, showTracks, showRoutes } = useCrowdStore();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          { id: 'osm-tiles', type: 'raster', source: 'osm-tiles' }
        ]
      },
      center: [77.209, 28.6139], // Delhi, India
      zoom: 5,
      pitch: 0
    });

    map.current.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

    return () => { map.current?.remove(); };
  }, []);

  // Render Heatmap / Density Circles
  useEffect(() => {
    if (!map.current) return;

    const renderHeatmap = () => {
      // Remove old heatmap if exists
      if (map.current!.getLayer('zone-heatmap')) {
        map.current!.removeLayer('zone-heatmap');
        map.current!.removeSource('zone-heatmap');
      }
      if (!showHeatmap) return;

      const features: GeoJSON.Feature<GeoJSON.Point, { density: number }>[] = zones.map((z: Zone) => ({
        type: 'Feature', 
        geometry: { type: 'Point', coordinates: z.coordinates }, // Must be [lng, lat]
        properties: { density: z.density }
      }));

      map.current!.addSource('zone-heatmap', { type: 'geojson', data: { type: 'FeatureCollection', features } });

      map.current!.addLayer({
        id: 'zone-heatmap',
        type: 'circle',
        source: 'zone-heatmap',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['get', 'density'], 0, 5, 100, 40],
          'circle-color': ['interpolate', ['linear'], ['get', 'density'], 0, '#00ff00', 50, '#ffa500', 80, '#ff0000'],
          'circle-opacity': 0.6
        }
      });

      // Fit map to zones
      if (zones.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        zones.forEach((z) => bounds.extend(z.coordinates));
        map.current!.fitBounds(bounds, { padding: 50 });
      }
    };

    if (map.current.isStyleLoaded()) {
      renderHeatmap();
    } else {
      map.current.on('load', renderHeatmap);
    }
  }, [zones, showHeatmap]);

  // Render Alerts
  useEffect(() => {
    if (!map.current) return;

    const renderAlerts = () => {
      // Remove previous alert layers
      map.current!.getStyle().layers
        .filter((l) => l.id.startsWith('alert-'))
        .forEach((l) => map.current!.removeLayer(l.id));
      Object.keys(map.current!.getStyle().sources)
        .filter((s) => s.startsWith('alert-'))
        .forEach((s) => map.current!.removeSource(s));

      alerts.forEach((alert: Alert, idx: number) => {
        const sourceId = `alert-${idx}`;
        map.current!.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: { type: 'Point', coordinates: alert.coordinates },
              properties: { alertType: alert.type }
            }]
          }
        });

        const color = alert.type === 'fire' ? '#ff0000' :
                      alert.type === 'stampede' ? '#ffa500' : '#00f';

        map.current!.addLayer({
          id: sourceId,
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-radius': 12,
            'circle-color': color,
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 2
          }
        });
      });
    };

    if (map.current.isStyleLoaded()) {
      renderAlerts();
    } else {
      map.current.on('load', renderAlerts);
    }
  }, [alerts]);

  return (
    <motion.div className="flex-grow h-full w-full relative" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      {/* Map overlay info */}
      <div className="absolute top-4 left-4 glass-card p-3 space-y-2">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${showHeatmap ? 'bg-crowd-electric' : 'bg-gray-500'}`} />
          <span className="text-sm">Heatmap</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${showTracks ? 'bg-crowd-safe' : 'bg-gray-500'}`} />
          <span className="text-sm">Tracks</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${showRoutes ? 'bg-crowd-warning' : 'bg-gray-500'}`} />
          <span className="text-sm">Routes</span>
        </div>
      </div>
    </motion.div>
  );
};
