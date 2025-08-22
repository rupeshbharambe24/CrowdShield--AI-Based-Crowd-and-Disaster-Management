import { create } from 'zustand';

export interface Zone {
  id: string;
  name: string;
  density: number;
  utilization: number;
  isGate: boolean;
  coordinates: [number, number];
  sparklineData: number[];
}

export interface Alert {
  id: string;
  type: 'fire' | 'stampede' | 'medical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  zone: string;
  coordinates: [number, number];
  timestamp: string;
  acknowledged: boolean;
}

export interface KPIs {
  totalPeople: number;
  zonesAbove70: number;
  zonesAbove90: number;
  alertsLast10Min: number;
}

interface CrowdState {
  wsConnected: boolean;
  setWsConnected: (connected: boolean) => void;

  zones: Zone[];
  setZones: (zones: Zone[]) => void;
  updateZone: (zoneId: string, updates: Partial<Zone>) => void;

  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (alertId: string) => void;

  kpis: KPIs;
  setKpis: (kpis: KPIs) => void;

  showHeatmap: boolean;
  showTracks: boolean;
  showRoutes: boolean;
  toggleHeatmap: () => void;
  toggleTracks: () => void;
  toggleRoutes: () => void;

  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useCrowdStore = create<CrowdState>((set, get) => ({
  wsConnected: false,
  setWsConnected: (connected) => set({ wsConnected: connected }),

zones: [
  { id: '1', name: 'Gate A', density: 30, utilization: 40, isGate: true, coordinates: [19.967196724034377, 73.66653735317261], sparklineData: [10,20,30] }, // Delhi
  { id: '2', name: 'Zone B', density: 70, utilization: 60, isGate: false, coordinates: [19.96660917369554, 73.6706158790857], sparklineData: [30,50,70] }, // Delhi nearby
  { id: '3', name: 'Zone C', density: 90, utilization: 80, isGate: false, coordinates: [19.96546520664772, 73.66873073483795], sparklineData: [70,90,100] }, // Taj Mahal, Agra
],
  setZones: (zones) => set({ zones }),
  updateZone: (zoneId, updates) => set((state) => ({
    zones: state.zones.map((zone) => zone.id === zoneId ? { ...zone, ...updates } : zone),
  })),

  alerts: [],
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  acknowledgeAlert: (alertId) => set((state) => ({
    alerts: state.alerts.map((alert) =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ),
  })),

  kpis: { totalPeople: 0, zonesAbove70: 0, zonesAbove90: 0, alertsLast10Min: 0 },
  setKpis: (kpis) => set({ kpis }),

  showHeatmap: true,
  showTracks: false,
  showRoutes: false,
  toggleHeatmap: () => set((state) => ({ showHeatmap: !state.showHeatmap })),
  toggleTracks: () => set((state) => ({ showTracks: !state.showTracks })),
  toggleRoutes: () => set((state) => ({ showRoutes: !state.showRoutes })),

  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));
