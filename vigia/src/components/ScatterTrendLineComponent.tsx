import React, { useMemo} from "react"
import * as utils from "./Utils"
import * as d3 from "d3"

/* =============================
   Chart 3: Scatter + Trendline
   ============================= */
interface ScatterData{
  x: number; 
  y: number 
}
interface ScatterTrendProps {
  data: ScatterData[];
}

export const ScatterTrend: React.FC<ScatterTrendProps> = ({ data }) => {
  const { ref, rect } = utils.useMeasure<HTMLDivElement>();
  const width = Math.max(320, rect.width);
  const height = 240;
  const margin = { top: 12, right: 16, bottom: 28, left: 40 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const x = d3.scaleLinear().domain(d3.extent(data, d => d.x) as [number, number]).nice().range([0, innerW]);
  const y = d3.scaleLinear().domain(d3.extent(data, d => d.y) as [number, number]).nice().range([innerH, 0]);

  // Least squares
  const { m, b } = useMemo(() => {
    const n = data.length;
    const sumX = d3.sum(data, d => d.x);
    const sumY = d3.sum(data, d => d.y);
    const sumXY = d3.sum(data, d => d.x * d.y);
    const sumXX = d3.sum(data, d => d.x * d.x);
    const denom = n * sumXX - sumX * sumX;
    const m = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
    const b = (sumY - m * sumX) / n;
    return { m, b };
  }, [data]); // ← Agrega data como dependencia

  const trend = [x.domain()[0], x.domain()[1]].map(xv => ({ x: xv, y: m * xv + b }));

  return (
    <div ref={ref} className="w-full">
      <svg width={width} height={height} className="overflow-visible">
        <g transform={`translate(${margin.left},${margin.top})`}>
          <utils.YAxis scale={y} x={0} />
          <utils.XAxis scale={x} y={innerH} />

          {/* Points */}
          {data.map((p, i) => (
            <circle key={i} cx={x(p.x)} cy={y(p.y)} r={3.5} className="fill-zinc-500/70 dark:fill-zinc-300/80" />
          ))}

          {/* Trend line */}
          <path
            d={d3.line<{ x: number; y: number }>()
              .x(d => x(d.x))
              .y(d => y(d.y))(trend) ?? undefined}
            className="stroke-emerald-500 dark:stroke-emerald-400"
            fill="none"
            strokeWidth={2}
          />
        </g>
      </svg>
    </div>
  );
};