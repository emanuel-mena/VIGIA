import React, { useEffect, useMemo, useState } from "react";
import { MultiPercentLineChart } from "./MultiPercentLineChart";
import {
  fetchEgresosLineaData,
  fetchEgresosSeries,
  type PercentRow,
} from "../api";

type Props = {
  height?: number;
  yMax?: number;          // por defecto 100 (%)
  topNInTooltip?: number;
  zoomMax?: number;
  className?: string;
};

export default function MultiPercentPanel({
  height = 420,
  yMax = 100,
  topNInTooltip = 12,
  zoomMax = 8,
  className = "",
}: Props) {
  const [rows, setRows] = useState<PercentRow[]>([]);
  const [seriesOptions, setSeriesOptions] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string>(""); // "" = (Todos)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar opciones del selector
  useEffect(() => {
    let alive = true;
    fetchEgresosSeries()
      .then(list => {
        if (!alive) return;
        setSeriesOptions(list);
      })
      .catch(err => {
        if (!alive) return;
        console.error(err);
      });
    return () => { alive = false; };
  }, []);

  // Cargar datos del gráfico (con/sin filtro)
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    const titulo = selectedSeries.trim();
    const arg = titulo.length > 0 ? titulo : undefined;

    fetchEgresosLineaData(arg)
      .then(data => {
        if (!alive) return;
        setRows(data);
        setLoading(false);
      })
      .catch(err => {
        if (!alive) return;
        setError(err?.message ?? String(err));
        setLoading(false);
      });

    return () => { alive = false; };
  }, [selectedSeries]);

  // Adaptador (solo por tipado)
  const data = useMemo(
    () => rows.map(r => ({ month: r.month, series: r.series, value: r.value })),
    [rows]
  );

  return (
    <div className={className}>
      {/* Controles */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-400">Filtrar por Título:</label>
          <select
            value={selectedSeries}
            onChange={e => setSelectedSeries(e.target.value)}
            className="rounded-md bg-white/5 px-2 py-1 text-sm text-white ring-1 ring-white/10 hover:bg-white/10"
          >
            <option value="">(Todos)</option>
            {seriesOptions.map(op => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setSelectedSeries(s => s)} // re-fetch
          className="rounded-md bg-white/5 px-3 py-1.5 text-sm ring-1 ring-white/10 hover:bg-white/10"
        >
          Refrescar
        </button>
      </div>

      {/* Estado */}
      {loading && <div className="text-sm text-zinc-400">Cargando datos…</div>}
      {error && <div className="text-sm text-red-400">Error: {error}</div>}

      {/* Chart */}
      {!loading && !error && (
        <MultiPercentLineChart
          data={data}
          height={height}
          yMax={yMax}                 // 100
          topNInTooltip={topNInTooltip}
          zoomMax={zoomMax}
        />
      )}
    </div>
  );
}
