/* =============================
   Chart 1: Area/Line + Tooltip
   ============================= */

import * as d3 from "d3";
import * as utils from "./Utils";
import { useState } from "react"; // Añadir esta importación

// Definir el tipo para los datos
interface DataPoint {
  date: Date;
  value: number;
}

interface AreaLineChartProps {
  data: DataPoint[];
}

export const AreaLineChart: React.FC<AreaLineChartProps> = ({ data }) => {
  const { ref, rect } = utils.useMeasure<HTMLDivElement>();
  const width = Math.max(320, rect.width);
  const height = 240;
  const margin = { top: 12, right: 16, bottom: 28, left: 40 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  // Verificar que hay datos antes de calcular
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date) as [Date, Date])
    .range([0, innerW]);
  
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)!])
    .nice()
    .range([innerH, 0]);

  const area = d3
    .area<DataPoint>()
    .x(d => x(d.date))
    .y0(innerH)
    .y1(d => y(d.value))
    .curve(d3.curveMonotoneX);

  const line = d3
    .line<DataPoint>()
    .x(d => x(d.date))
    .y(d => y(d.value))
    .curve(d3.curveMonotoneX);

  const [hover, setHover] = useState<{ x: number; d: DataPoint } | null>(null);
  const bisect = d3.bisector<DataPoint, Date>(d => d.date).center;

  function onMove(e: React.MouseEvent<SVGRectElement>) {
    const pt = e.nativeEvent.offsetX - margin.left;
    const date = x.invert(pt);
    const idx = bisect(data, date);
    const d = data[idx];
    if (!d) return setHover(null);
    setHover({ x: x(d.date), d });
  }

  return (
    <div ref={ref} className="w-full">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopOpacity={0.35} className="[stop-color:theme(colors.blue.500)] dark:[stop-color:theme(colors.blue.400)]" />
            <stop offset="100%" stopOpacity={0} className="[stop-color:theme(colors.blue.500)] dark:[stop-color:theme(colors.blue.400)]" />
          </linearGradient>
        </defs>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <utils.YAxis scale={y} x={0} />
          <utils.XAxis scale={x} y={innerH} />

          {/* Area */}
          <path d={area(data) ?? undefined} fill="url(#areaGrad)" />
          {/* Line */}
          <path d={line(data) ?? undefined} className="stroke-blue-500 dark:stroke-blue-400" fill="none" strokeWidth={2} />

          {/* Hover capture */}
          <rect width={innerW} height={innerH} fill="transparent" onMouseMove={onMove} onMouseLeave={() => setHover(null)} />

          {/* Tooltip */}
          {hover && (
            <g transform={`translate(${hover.x},0)`}>
              <line y1={0} y2={innerH} className="stroke-blue-400/40" />
              <circle cy={y(hover.d.value)} r={4} className="fill-white dark:fill-zinc-900 stroke-blue-500 dark:stroke-blue-400" />
              <foreignObject x={8} y={Math.max(0, y(hover.d.value) - 24)} width={160} height={48}>
                <div className="px-2 py-1 text-xs rounded-lg bg-white/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-200 shadow border border-zinc-200/70 dark:border-zinc-700">
                  <div className="font-medium">{d3.timeFormat("%b %Y")(hover.d.date)}</div>
                  <div className="opacity-80">{hover.d.value}</div>
                </div>
              </foreignObject>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};