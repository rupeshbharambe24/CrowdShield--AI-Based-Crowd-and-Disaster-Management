// HeatmapLayer.tsx
import { CircleMarker, Tooltip } from "react-leaflet";
import React from "react";

interface Zone {
  id: string;
  coordinates: [number, number];
  density: number;
}

interface HeatmapLayerProps {
  zones: Zone[];
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ zones }) => {
  return (
    <>
      {zones.map((zone) => {
        const radius = Math.min(50, zone.density); // limit max size
        const color = zone.density > 80 ? "red" : zone.density > 50 ? "orange" : "green";

        return (
          <CircleMarker
            key={zone.id}
            center={zone.coordinates}
            radius={radius}
            color={color}
            fillOpacity={0.5}
          >
            <Tooltip>{`${zone.id}: ${zone.density} people`}</Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
};

export default HeatmapLayer;
