// AlertsLayer.tsx
import { Marker, Popup } from "react-leaflet";
import React from "react";
import L from "leaflet";

interface Alert {
  id: string;
  type: "fire" | "stampede" | "medical";
  coordinates: [number, number];
  message: string;
}

interface AlertsLayerProps {
  alerts: Alert[];
}

const iconMap: Record<string, L.Icon> = {
  fire: new L.Icon({ iconUrl: "/icons/fire.png", iconSize: [25, 25] }),
  stampede: new L.Icon({ iconUrl: "/icons/stampede.png", iconSize: [25, 25] }),
  medical: new L.Icon({ iconUrl: "/icons/medical.png", iconSize: [25, 25] }),
};

const AlertsLayer: React.FC<AlertsLayerProps> = ({ alerts }) => {
  return (
    <>
      {alerts.map((alert) => (
        <Marker
          key={alert.id}
          position={alert.coordinates}
          icon={iconMap[alert.type]}
        >
          <Popup>{alert.message}</Popup>
        </Marker>
      ))}
    </>
  );
};

export default AlertsLayer;
