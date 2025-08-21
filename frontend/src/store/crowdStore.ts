
import { create } from 'zustand';

interface Zone {
  id: string;
  name: string;
  density: number;
  utilization: number;
  isGate: boolean;
  coordinates: [number, number];
  sparklineData: number[];
}

interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  zone: string;
  cause: string;
  timestamp: string;
  acknowledged: boolean;
}

interface KPIs {
  totalPeople: number;
  zonesAbove70: number;
  zonesAbove90: number;
  alertsLast10Min: number;
}

interface CrowdState {
  // WebSocket
  wsConnected: boolean;
  setWsConnected: (connected: boolean) => void;

  // Zones
  zones: Zone[];
  setZones: (zones: Zone[]) => void;
  updateZone: (zoneId: string, updates: Partial<Zone>) => void;

  // Alerts
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (alertId: string) => void;

  // KPIs
  kpis: KPIs;
  setKpis: (kpis: KPIs) => void;

  // Controls
  showHeatmap: boolean;
  showTracks: boolean;
  showRoutes: boolean;
  toggleHeatmap: () => void;
  toggleTracks: () => void;
  toggleRoutes: () => void;

  // UI State
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useCrowdStore = create<CrowdState>((set, get) => ({
  // WebSocket
  wsConnected: false,
  setWsConnected: (connected) => set({ wsConnected: connected }),

  // Zones
  zones: [],
  setZones: (zones) => set({ zones }),
  updateZone: (zoneId, updates) => 
    set((state) => ({
      zones: state.zones.map((zone) =>
        zone.id === zoneId ? { ...zone, ...updates } : zone
      ),
    })),

  // Alerts
  alerts: [],
  addAlert: (alert) => 
    set((state) => ({ alerts: [alert, ...state.alerts] })),
  acknowledgeAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ),
    })),

  // KPIs
  kpis: {
    totalPeople: 0,
    zonesAbove70: 0,
    zonesAbove90: 0,
    alertsLast10Min: 0,
  },
  setKpis: (kpis) => set({ kpis }),

  // Controls
  showHeatmap: true,
  showTracks: false,
  showRoutes: false,
  toggleHeatmap: () => set((state) => ({ showHeatmap: !state.showHeatmap })),
  toggleTracks: () => set((state) => ({ showTracks: !state.showTracks })),
  toggleRoutes: () => set((state) => ({ showRoutes: !state.showRoutes })),

  // UI State
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));
