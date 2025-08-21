import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MapView } from './MapView';
import { RightPanel } from './RightPanel';
import { useCrowdStore } from '../store/crowdStore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL;
const WS_URL = import.meta.env.VITE_WS_URL;

export const Dashboard: React.FC = () => {
  const { 
    setWsConnected, 
    setZones, 
    setKpis, 
    addAlert,
    sidebarCollapsed 
  } = useCrowdStore();

  useEffect(() => {
    // 🔹 Initial fetch from REST API
    async function fetchInitialData() {
      try {
        const metricsRes = await fetch(`${API_URL}/api/metrics`);
        const metrics = await metricsRes.json();

        if (metrics?.zones) {
          setZones(metrics.zones);
        }
        if (metrics?.kpis) {
          setKpis(metrics.kpis);
        }
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
        toast.error("❌ Could not connect to backend API", { theme: "dark" });
      }
    }

    fetchInitialData();

    // 🔹 Setup WebSocket connection
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      setWsConnected(true);
      toast.success('✅ Connected to CrowdShield monitoring system', {
        position: 'top-right',
        theme: 'dark'
      });
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "metrics") {
          if (msg.payload?.zones) setZones(msg.payload.zones);
          if (msg.payload?.kpis) setKpis(msg.payload.kpis);
        }

        if (msg.type === "alert") {
          addAlert(msg.payload);
          toast.warning(
            `⚠️ ${msg.payload.type} alert in ${msg.payload.zoneId}`,
            { theme: "dark" }
          );
        }
      } catch (e) {
        console.error("WebSocket message error:", e);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      toast.error("⚠️ WebSocket connection error", { theme: "dark" });
    };

    socket.onclose = () => {
      setWsConnected(false);
      toast.info("🔌 Disconnected from CrowdShield", { theme: "dark" });
    };

    return () => {
      socket.close();
    };
  }, [setWsConnected, setZones, setKpis, addAlert]);

  return (
    <div className="min-h-screen bg-crowd-bg flex flex-col">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 flex min-w-0">
          <MapView />
        </main>
        
        <RightPanel />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{
          backgroundColor: 'hsl(var(--crowd-surface))',
        }}
      />

      {/* Footer */}
      <footer className="bg-crowd-surface/50 border-t border-white/10 py-2 px-4">
        <div className="text-center">
          <p className="text-sm text-white/70">
            © 2024 <span className="text-crowd-electric font-semibold">Rupesh Team SentinelX</span> - All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};
