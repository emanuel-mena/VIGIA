// src/components/MultiPercentLineChart.tsx
import * as d3 from "d3";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as utils from "./Utils";

type Row = { month: number; series: string; value: number };
type Props = {
  data: Row[];
  height?: number;
  yMax?: number;
  topNInTooltip?: number;
  // límites de zoom: 1 = sin zoom, 8 = 8x
  zoomMax?: number;
};

export const MultiPercentLineChart: React.FC<Props> = ({
  data,
  height = 420,
  yMax = 100,
  topNInTooltip = 12,
  zoomMax = 8,
}) => {
  const { ref, rect } = utils.useMeasure<HTMLDivElement>();
  const width = Math.max(360, rect.width);
  const margin = { top: 28, right: 220, bottom: 36, left: 56 };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);

  // --- dominios
  const months = useMemo(() => {
    const ms = Array.from(new Set(data.map(d => d.month))).sort((a, b) => a - b);
    return ms; // mantenemos numérico para un x continuo
  }, [data]);

  const seriesNames = useMemo(
    () => Array.from(new Set(data.map(d => d.series))),
    [data]
  );

  // índice por mes para acceso O(1)
  const idxByMonth = useMemo(() => {
    const m2i = new Map<number, number>();
    months.forEach((m, i) => m2i.set(m, i));
    return m2i;
  }, [months]);

  // agrupar por serie y normalizar meses faltantes a 0
  const bySeries = useMemo(() => {
    const map = d3.group(data, d => d.series);
    return seriesNames.map(name => {
      const rows = map.get(name) ?? [];
      const dict = new Map(rows.map(r => [r.month, r.value]));
      const arr = months.map(m => ({ m, v: dict.get(m) ?? 0 }));
      return { name, arr };
    });
  }, [data, months, seriesNames]);

  // --- escalas base
  // X continuo en [0, n-1] para que zoom/drag sean suaves
  const x0 = useMemo(
    () => d3.scaleLinear().domain([0, Math.max(0, months.length - 1)]).range([0, innerW]),
    [months.length, innerW]
  );
  // Y lineal 0..yMax
  const y = useMemo(
    () => d3.scaleLinear().domain([0, yMax]).nice().range([innerH, 0]),
    [innerH, yMax]
  );

  // estado del zoom (transformación)
  const [transform, setTransform] = useState(d3.zoomIdentity);
  const xZ = useMemo(() => transform.rescaleX(x0), [transform, x0]);

  // color por serie
  const colors = useMemo(() => {
    const N = Math.max(1, seriesNames.length);
    const seq = d3.scaleSequential<number, string>()
      .domain([0, N - 1])
      .interpolator(d3.interpolateRainbow);
    return d3.scaleOrdinal<string, string>()
      .domain(seriesNames)
      .range(seriesNames.map((_, i) => seq(i)));
  }, [seriesNames]);

  // ocultar/mostrar series
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const toggle = (name: string) => {
    setHidden(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  // generador de línea usando xZ + idx
  const xForMonth = (m: number) => xZ(idxByMonth.get(m) ?? 0);
  const line = d3.line<{ m: number; v: number }>()
    .x(d => xForMonth(d.m))
    .y(d => y(d.v))
    .curve(d3.curveMonotoneX);

  // interacción (tooltip por mes)
  const [hoverMonth, setHoverMonth] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gxRef = useRef<SVGGElement | null>(null);
  const axisXRef = useRef<SVGGElement | null>(null);

  // eje X reactivo al zoom
  useEffect(() => {
    if (!axisXRef.current) return;
    const n = months.length;
    const axis = d3.axisBottom(xZ)
      .ticks(Math.min(10, n))
      .tickFormat((t: d3.NumberValue) => {
        const i = Math.round(Number(t));
        const m = months[Math.max(0, Math.min(n - 1, i))];
        return String(m);
      });
    d3.select(axisXRef.current).call(axis as any);
  }, [xZ, months]);

  // zona de zoom/pan (sobre g interior)
  useEffect(() => {
    if (!svgRef.current || !gxRef.current) return;

    const zoom = d3.zoom<SVGRectElement, unknown>()
      .scaleExtent([1, zoomMax])
      .translateExtent([[0, 0], [innerW, innerH]])
      .extent([[0, 0], [innerW, innerH]])
      .filter((event: any) => {
        // Permite: rueda, pinch, arrastre con botón izquierdo; ignora clics secundarios
        if (event.type === "dblclick") return true;
        if (event.button && event.type === "mousedown") return event.button === 0;
        return !event.ctrlKey || event.type === "wheel" ? true : true;
      })
      .on("zoom", (ev) => setTransform(ev.transform as d3.ZoomTransform))
      .on("end", () => { /* noop */ });

    const overlay = d3.select(gxRef.current).select<SVGRectElement>("rect.interaction-overlay");
    overlay.call(zoom as any);

    // reset con doble-click
    overlay.on("dblclick.zoom-reset", (ev) => {
      ev.preventDefault();
      setTransform(d3.zoomIdentity);
    });

    return () => {
      overlay.on(".zoom", null);
    };
  }, [innerW, innerH, zoomMax]);

  // puntero -> mes más cercano (respetando transform)
  const onMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    // coords SVG
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const ctm = (svgRef.current as any).getScreenCTM();
    const p = pt.matrixTransform(ctm.inverse());
    const gx = p.x - margin.left;
    const i = Math.round(xZ.invert(gx));
    const clamped = Math.max(0, Math.min(months.length - 1, i));
    setHoverMonth(months[clamped]);
    setMousePos({ x: p.x, y: p.y });
  };
  const onLeave = () => { setHoverMonth(null); setMousePos(null); };

  // filas del tooltip (top N)
  const tipRows = useMemo(() => {
    if (hoverMonth == null) return [];
    return bySeries
      .filter(s => !hidden.has(s.name))
      .map(s => ({ name: s.name, v: s.arr.find(d => d.m === hoverMonth)?.v ?? 0 }))
      .sort((a, b) => d3.descending(a.v, b.v))
      .slice(0, topNInTooltip);
  }, [hoverMonth, bySeries, hidden, topNInTooltip]);

  // id único para clipPath
  const clipId = useMemo(
    () => `clip-${Math.random().toString(36).slice(2)}`,
    []
  );

  return (
    <div ref={ref} className="w-full">
      <svg ref={svgRef} width={width} height={height} className="overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={innerW} height={innerH} />
          </clipPath>
        </defs>

        <g ref={gxRef} transform={`translate(${margin.left},${margin.top})`}>
          {/* Eje Y (no cambia con zoom) */}
          <utils.YAxis scale={y} x={0} format={d3.format(".0%")} />

          {/* Eje X reactivo al zoom */}
          <g ref={axisXRef} transform={`translate(0,${innerH})`} />

          {/* Área recortada para líneas y puntos */}
          <g clipPath={`url(#${clipId})`}>
            {/* Líneas */}
            {bySeries.map(s => {
              if (hidden.has(s.name)) return null;
              return (
                <path
                  key={s.name}
                  d={line(s.arr)!}
                  fill="none"
                  stroke={colors(s.name)}
                  strokeWidth={2}
                  opacity={0.9}
                />
              );
            })}

            {/* Puntos */}
            {bySeries.map(s => {
              if (hidden.has(s.name)) return null;
              return (
                <g key={s.name + "_pts"} fill={colors(s.name)} opacity={0.85}>
                  {s.arr.map(d => (
                    <circle key={s.name + d.m} cx={xForMonth(d.m)} cy={y(d.v)} r={2} />
                  ))}
                </g>
              );
            })}

            {/* Regla vertical cuando hay hover */}
            {hoverMonth != null && (
              <line
                x1={xForMonth(hoverMonth)}
                x2={xForMonth(hoverMonth)}
                y1={0}
                y2={innerH}
                className="stroke-white/30"
                strokeDasharray="3 3"
              />
            )}
          </g>

          {/* Overlay de interacción (recibe zoom y mouse events) */}
          <rect
            className="interaction-overlay"
            x={0}
            y={0}
            width={innerW}
            height={innerH}
            fill="transparent"
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ cursor: "grab" }}
          />

          {/* Leyenda con scrollbar custom */}
          <foreignObject
            x={innerW + 16}
            y={0}
            width={Math.max(180, margin.right - 24)}
            height={innerH}
          >
            <div className="h-full w-full overflow-y-auto pr-2 text-[11px] sm:text-xs scrollbar-vigia">
              <div className="font-semibold mb-2 text-white/90">Título Descripción</div>
              <ul className="space-y-2">
                {seriesNames.map(name => (
                  <li key={name} className="flex items-center gap-2">
                    <button
                      onClick={() => toggle(name)}
                      className="h-3 w-3 rounded-sm ring-1 ring-white/40"
                      style={{ background: hidden.has(name) ? "transparent" : colors(name) }}
                      aria-label={`Alternar ${name}`}
                      title={hidden.has(name) ? "Mostrar" : "Ocultar"}
                    />
                    <span className={`leading-snug ${hidden.has(name) ? "opacity-50" : ""}`}>
                      {name}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-[10px] text-white/60">
                • Arrastra para mover · Rueda/pinch para hacer zoom · Doble-click para resetear
              </div>
            </div>
          </foreignObject>
        </g>

        {/* Tooltip flotante (usa coords absolutas del SVG) */}
        {hoverMonth != null && mousePos && (
          <foreignObject
            x={Math.min(mousePos.x + 12, width - 220)}
            y={Math.max(mousePos.y - 140, 0)}
            width={208}
            height={188}
          >
            <div className="rounded-xl border border-white/10 bg-black/80 p-3 text-[11px] sm:text-xs text-white/90 backdrop-blur scrollbar-vigia">
              <div className="mb-2 font-semibold">
                Mes: <span className="tabular-nums">{String(hoverMonth)}</span>
              </div>
              <div className="max-h-36 overflow-y-auto pr-1 scrollbar-vigia">
                {tipRows.map(r => (
                  <div key={r.name} className="flex items-center justify-between gap-3">
                    <span className="truncate">{r.name}</span>
                    <span className="tabular-nums">{d3.format(".2f")(r.v)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
};
