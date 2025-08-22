import { CircleMarker, Tooltip } from 'react-leaflet';
import { useEffect, useState } from 'react';

interface Zone {
  id: number;
  coords: [number, number][];
  density: number;
}

interface Alert {
  type: string;
  zone?: number;
}

const HeatmapLayer: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000/ws');
    ws.onmessage = (msg: MessageEvent) => {
      const data = JSON.parse(msg.data);
      setZones(data.zones);
      setAlerts(data.alerts);
    };
  }, []);

  return (
    <>
      {zones.map(zone => (
        <CircleMarker
          key={zone.id}
          center={[zone.coords[0][0], zone.coords[0][1]]}
          radius={zone.density / 5}
          color={zone.density > 100 ? 'red' : 'orange'}
        >
          <Tooltip>{`Zone ${zone.id}: ${zone.density} people`}</Tooltip>
        </CircleMarker>
      ))}
    </>
  );
};

export default HeatmapLayer;
