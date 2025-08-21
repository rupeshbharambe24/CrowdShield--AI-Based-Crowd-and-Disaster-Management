// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL;

export async function getMetrics() {
  const res = await fetch(`${API_URL}/api/metrics`);
  return res.json();
}

export async function getZones() {
  const res = await fetch(`${API_URL}/api/geo/zones`);
  return res.json();
}

export async function raiseIncident(type: string, zoneId: string) {
  const res = await fetch(`${API_URL}/api/incidents/raise`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, zoneId }),
  });
  return res.json();
}
