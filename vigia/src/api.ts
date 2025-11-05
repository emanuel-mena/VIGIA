// src/api.ts
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export type TopInversion = {
  Institucion: string;
  "Monto adjudicado en colones": number;
};

export type PercentRow = { month: number; series: string; value: number };

export async function fetchTopInversiones(): Promise<TopInversion[]> {
  const res = await fetch(`${API_BASE}/top-inversiones`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function fetchEgresosLineaTotales(titulo?: string) {
  const url = new URL(`${API_BASE}/egresos-linea-totales`, window.location.origin);
  if (titulo && titulo.trim() !== "") url.searchParams.set("titulo", titulo.trim());
  const res = await fetch(url.toString().replace(window.location.origin, ""));
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<{month:number; series:string; value:number}[]>;
}


export async function fetchEgresosLineaData(titulo?: string): Promise<PercentRow[]> {
  const url = new URL(`${API_BASE}/egresos-linea-data`, window.location.origin);
  if (titulo && titulo.trim() !== "") url.searchParams.set("titulo", titulo);
  const res = await fetch(url.toString().replace(window.location.origin, ""));
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Formato inesperado en egresos-linea-data");
  return data as PercentRow[];
}

export async function fetchEgresosSeries(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/egresos-series`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Formato inesperado en egresos-series");
  return data as string[];
}
