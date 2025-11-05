import * as d3 from "d3";
import React, { useMemo, useState } from "react";

interface DonutDataProps {
  data: { name: string; value: number }[];
}

/* =============================
   Chart 4: Donut + Legend + %
   ============================= */
export const DonutChart: React.FC<DonutDataProps> = ({ data }) => {
  const size = 240;
  const radius = size / 2;
  const innerR = radius - 34;

  const total = useMemo(() => d3.sum(data, d => d.value) || 0, [data]);
  const pct = (v: number) => (total === 0 ? 0 : (v / total) * 100);
  const fmtPct = (v: number) => `${Math.round(v)}%`;

  const color = d3
    .scaleOrdinal<string, string>()
    .domain(data.map(d => d.name))
    .range([
      "oklch(64% .18 255)", // blue
      "oklch(70% .17 150)", // green
      "oklch(69% .19 30)",  // orange
      "oklch(72% .12 320)", // pink/purple
    ]);

  const arcGen = d3
    .arc<d3.PieArcDatum<(typeof data)[number]>>()
    .innerRadius(innerR)
    .outerRadius(radius - 6)
    .cornerRadius(8)
    .padAngle(0.02);

  // radio para colocar etiquetas dentro del anillo
  const labelArc = d3
    .arc<d3.PieArcDatum<(typeof data)[number]>>()
    .innerRadius((innerR + radius) / 2)
    .outerRadius((innerR + radius) / 2);

  const pie = d3.pie<(typeof data)[number]>().value(d => d.value).sort(null);
  const arcs = pie(data);

  const [hoverName, setHoverName] = useState<string | null>(null);
  const hoveredDatum = hoverName ? data.find(d => d.name === hoverName) : null;

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 place-items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Distribución porcentual por categoría"
      >
        <g transform={`translate(${radius},${radius})`}>
          {/* Arcos */}
          {arcs.map(a => (
            <path
              key={a.data.name}
              d={arcGen(a) ?? undefined}
              fill={color(a.data.name)}
              className="transition-opacity"
              opacity={hoverName && hoverName !== a.data.name ? 0.6 : 0.95}
              onPointerEnter={() => setHoverName(a.data.name)}
              onPointerLeave={() => setHoverName(null)}
            >
              <title>
                {a.data.name} • {fmtPct(pct(a.data.value))} ({a.data.value})
              </title>
            </path>
          ))}

          {/* Porcentajes dentro del anillo (oculta si < 5%) */}
          {arcs.map(a => {
            const p = pct(a.data.value);
            if (p < 5) return null; // evita solapes en segmentos muy pequeños
            const [x, y] = labelArc.centroid(a);
            return (
              <text
                key={`lbl-${a.data.name}`}
                x={x}
                y={y}
                textAnchor="middle"
                dy="0.35em"
                className="fill-zinc-900 dark:fill-zinc-100"
                style={{ fontSize: 11, fontWeight: 600 }}
              >
                {fmtPct(p)}
              </text>
            );
          })}

          {/* Centro: total o porcentaje en hover */}
          <text
            textAnchor="middle"
            className="fill-zinc-800 dark:fill-zinc-100"
            dy={4}
          >
            {hoveredDatum ? (
              <>
                <tspan className="text-xl font-semibold">
                  {fmtPct(pct(hoveredDatum.value))}
                </tspan>
                <tspan x={0} dy={16} className="text-xs opacity-80">
                  {hoveredDatum.name}
                </tspan>
              </>
            ) : (
              <>
                <tspan className="text-xl font-semibold">
                  {total.toLocaleString("es-CR")}
                </tspan>
                <tspan x={0} dy={16} className="text-xs opacity-80">
                  Total
                </tspan>
              </>
            )}
          </text>
        </g>
      </svg>

      {/* Leyenda con porcentaje */}
      <div className="w-full max-w-xs">
        <ul className="space-y-2">
          {data.map(d => (
            <li
              key={d.name}
              className="flex items-center justify-between rounded-xl border border-zinc-200/70 dark:border-zinc-800 px-3 py-2"
              onPointerEnter={() => setHoverName(d.name)}
              onPointerLeave={() => setHoverName(null)}
              style={{
                opacity: hoverName && hoverName !== d.name ? 0.6 : 1,
                transition: "opacity 120ms",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded"
                  style={{ background: color(d.name) }}
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-200">
                  {d.name}
                </span>
              </div>
              <span className="text-sm tabular-nums text-zinc-600 dark:text-zinc-300">
                {d.value} &nbsp;·&nbsp; {fmtPct(pct(d.value))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
