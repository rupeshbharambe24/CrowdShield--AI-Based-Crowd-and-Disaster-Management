import { useEffect } from "react";
import { useCrowdStore } from '../store/crowdStore';

export function useWebSocket() {
  const setZones = useCrowdStore((state) => state.setZones);
  const setKpis = useCrowdStore((state) => state.setKpis);
  const setWsConnected = useCrowdStore((state) => state.setWsConnected);

  const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      setWsConnected(true);
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "zone_update") {
        // Update zones in Zustand store
        if (msg.zones) setZones(msg.zones);

        // Update KPIs in Zustand store
        if (msg.kpis) setKpis(msg.kpis);
      }
    };

    socket.onclose = () => {
      console.log("❌ WebSocket closed");
      setWsConnected(false);
    };

    return () => socket.close();
  }, [WS_URL, setZones, setKpis, setWsConnected]);
}
