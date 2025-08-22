import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MapView } from './MapView';
import { RightPanel } from './RightPanel';
import { useCrowdStore } from '../store/crowdStore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register all necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_URL = import.meta.env.VITE_API_URL;
const WS_URL = import.meta.env.VITE_WS_URL;

export const Dashboard: React.FC = () => {
  const { 
    setWsConnected, 
    setZones, 
    setKpis, 
    addAlert,
    kpis,
    zones,
    sidebarCollapsed 
  } = useCrowdStore();

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const metricsRes = await fetch(`${API_URL}/api/metrics`);
        const metrics = await metricsRes.json();

        if (metrics?.zones) setZones(metrics.zones);
        if (metrics?.kpis) setKpis(metrics.kpis);
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
        toast.error("❌ Could not connect to backend API", { theme: "dark" });
      }
    }

    fetchInitialData();

    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      setWsConnected(true);
      toast.success('✅ Connected to CrowdShield monitoring system', { position: 'top-right', theme: 'dark' });
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "zone_update") {
          if (msg.zones) setZones(msg.zones);
          if (msg.kpis) setKpis(msg.kpis);
        }

        if (msg.type === "alert") {
          addAlert(msg.payload);
          toast.warning(`⚠️ ${msg.payload.type} alert in ${msg.payload.zoneId}`, { theme: "dark" });
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

    return () => socket.close();
  }, [setWsConnected, setZones, setKpis, addAlert]);

  return (
    <div className="min-h-screen bg-crowd-bg flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex min-w-0">
          <MapView />
        </main>

        {/* Right Panel */}
        <RightPanel>
          <div className="p-4 space-y-4">
            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-crowd-surface/70 p-4 rounded-lg text-white">
                <p>Total People</p>
                <h2 className="text-2xl font-bold">{kpis.totalPeople}</h2>
              </div>
              <div className="bg-crowd-surface/70 p-4 rounded-lg text-white">
                <p>Zones &gt; 70%</p>
                <h2 className="text-2xl font-bold">{kpis.zonesAbove70}</h2>
              </div>
              <div className="bg-crowd-surface/70 p-4 rounded-lg text-white">
                <p>Zones &gt; 90%</p>
                <h2 className="text-2xl font-bold">{kpis.zonesAbove90}</h2>
              </div>
            </div>

            {/* Zones */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {zones?.map((zone) => (
                <div key={zone.id} className="bg-crowd-surface/50 p-3 rounded-lg text-white">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{zone.name}</h3>
                    <span className="font-bold">{zone.density}%</span>
                  </div>
                  <div className="mt-2">
                    <Line
                      data={{
                        labels: zone.sparklineData?.map((_, i) => i + 1) || [],
                        datasets: [
                          {
                            label: 'Density',
                            data: zone.sparklineData || [],
                            borderColor: '#0ff',
                            backgroundColor: 'rgba(0,255,255,0.2)',
                            fill: true,
                            tension: 0.3
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: { x: { display: false }, y: { min: 0, max: 100 } }
                      }}
                      height={50}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RightPanel>
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
        style={{ backgroundColor: 'hsl(var(--crowd-surface))' }}
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
