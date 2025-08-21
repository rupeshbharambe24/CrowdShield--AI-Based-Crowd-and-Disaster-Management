import { useEffect, useState } from "react";

export function useWebSocket() {
  const [data, setData] = useState<any>(null);
  const WS_URL = import.meta.env.VITE_WS_URL;

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => console.log("✅ WebSocket connected");
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setData(msg);
    };
    socket.onclose = () => console.log("❌ WebSocket closed");

    return () => socket.close();
  }, [WS_URL]);

  return data;
}
