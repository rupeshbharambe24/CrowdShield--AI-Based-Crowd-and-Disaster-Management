
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useCrowdStore } from '../store/crowdStore';

export const MapView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { zones, showHeatmap, showTracks, showRoutes } = useCrowdStore();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with OpenStreetMap tiles
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
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
            paint: {
              'raster-opacity': 0.8,
              'raster-contrast': 0.2,
              'raster-brightness-min': 0.1,
              'raster-brightness-max': 0.9
            }
          }
        ]
      },
      zoom: 15,
      center: [-74.006, 40.7128], // NYC coordinates
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add resize listener for responsive map
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      map.current?.remove();
    };
  }, []);

  // Update heatmap visibility
  useEffect(() => {
    if (!map.current) return;
    
    // Add/remove heatmap layer based on toggle
    // This would connect to actual zone data
    console.log('Heatmap visibility:', showHeatmap);
  }, [showHeatmap]);


  return (
    <motion.div 
      className="flex-grow h-full w-full relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
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
