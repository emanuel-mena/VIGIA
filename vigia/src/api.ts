// src/api.ts
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export type TopInversion = {
  Institucion: string;
  "Monto adjudicado en colones": number;
};

export async function fetchTopInversiones(): Promise<TopInversion[]> {
  const res = await fetch(`${API_BASE}/top-inversiones`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
