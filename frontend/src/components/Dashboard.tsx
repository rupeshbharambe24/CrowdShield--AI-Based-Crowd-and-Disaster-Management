
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MapView } from './MapView';
import { RightPanel } from './RightPanel';
import { useCrowdStore } from '../store/crowdStore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Dashboard: React.FC = () => {
  const { 
    setWsConnected, 
    setZones, 
    setKpis, 
    addAlert,
    sidebarCollapsed 
  } = useCrowdStore();

  useEffect(() => {
    // Initialize demo data
    const demoZones = [
      {
        id: 'zone-1',
        name: 'Main Entrance',
        density: 450,
        utilization: 75,
        isGate: true,
        coordinates: [-74.006, 40.7128] as [number, number],
        sparklineData: [20, 35, 45, 30, 60, 75, 45, 55, 40, 50]
      },
      {
        id: 'zone-2',
        name: 'Food Court',
        density: 320,
        utilization: 85,
        isGate: false,
        coordinates: [-74.007, 40.7135] as [number, number],
        sparklineData: [40, 50, 65, 70, 85, 80, 75, 85, 90, 85]
      },
      {
        id: 'zone-3',
        name: 'Emergency Exit A',
        density: 120,
        utilization: 30,
        isGate: true,
        coordinates: [-74.005, 40.7125] as [number, number],
        sparklineData: [10, 15, 25, 20, 30, 25, 35, 30, 28, 30]
      }
    ];

    const demoKpis = {
      totalPeople: 2847,
      zonesAbove70: 8,
      zonesAbove90: 2,
      alertsLast10Min: 3
    };

    setZones(demoZones);
    setKpis(demoKpis);
    
    // Simulate WebSocket connection
    setTimeout(() => {
      setWsConnected(true);
      toast.success('Connected to CrowdShield monitoring system', {
        position: 'top-right',
        theme: 'dark'
      });
    }, 1000);

    // Demo alert
    setTimeout(() => {
      addAlert({
        id: 'alert-1',
        severity: 'high',
        zone: 'Food Court',
        cause: 'Overcrowding detected - 85% capacity reached',
        timestamp: new Date().toISOString(),
        acknowledged: false
      });
      
      toast.warning('High density alert in Food Court', {
        position: 'top-right',
        theme: 'dark'
      });
    }, 3000);

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
