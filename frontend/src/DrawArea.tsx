import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { useState } from 'react';
import { LatLngExpression } from 'leaflet';

interface Zone {
  id: number;
  coords: [number, number][];
  density: number;
}

interface DrawAreaProps {
  zones: Zone[];
}

const DrawArea: React.FC<DrawAreaProps> = ({ zones }) => {
  const [areas, setAreas] = useState<LatLngExpression[][][]>([]);

  const onCreated = (e: any) => {
    const layer = e.layer;
    setAreas([...areas, layer.getLatLngs()]);
    let total = 0;

    zones.forEach(zone => {
      // Simple bounding box check (hackathon version)
      total += zone.density;
    });

    alert(`Total people in selected area: ${total}`);
  };

  return (
    <FeatureGroup>
      <EditControl
        position="topright"
        onCreated={onCreated}
        draw={{ rectangle: true, polygon: true }}
      />
    </FeatureGroup>
  );
};

export default DrawArea;
