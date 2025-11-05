import * as utils from "./Utils";
import * as d3 from "d3";
import React from "react";

interface CategoryData {
  label: string;
  group: string;
  value: number;
}

interface GroupedBarsProps {
  data: CategoryData[];
}

/* =============================
   Chart 2: Grouped Bar Chart
   ============================= */
export const GroupedBars: React.FC<GroupedBarsProps> = ({ data }) => {
  const { ref, rect } = utils.useMeasure<HTMLDivElement>();
  const width = Math.max(320, rect.width);
  const height = 240;

  const margin = { top: 12, right: 16, bottom: 28, left: 40 };
  const innerW = width - margin.left - margin.right;
  const innerH: number = height - margin.top - margin.bottom;

  const labels = Array.from(new Set(data.map((d) => d.label)));
  const groups = Array.from(new Set(data.map((d) => d.group)));

  // Escalas
  const x0: d3.ScaleBand<string> = d3
    .scaleBand<string>()
    .domain(labels)
    .range([0, innerW])
    .padding(0.2);

  const x1: d3.ScaleBand<string> = d3
    .scaleBand<string>()
    .domain(groups)
    .range([0, x0.bandwidth()])
    .padding(0.12);

  const y: d3.ScaleLinear<number, number> = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)!])
    .nice()
    .range([innerH, 0]);

  const color = d3
    .scaleOrdinal<string, string>()
    .domain(groups)
    .range([
      "oklch(64% .18 255)", // blue-ish
      "oklch(70% .17 150)", // green-ish
    ]);

  return (
    <div ref={ref} className="w-full">
      <svg width={width} height={height} className="overflow-visible">
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Ejes */}
          <utils.YAxis scale={y} x={0} />
          {/* XAxis ahora acepta band/point sin error */}
          <utils.XAxis scale={x0} y={innerH} />

          {/* Barras */}
          {labels.map((label) => (
            <g key={label} transform={`translate(${x0(label)},0)`}>
              {groups.map((g) => {
                const d = data.find((c) => c.label === label && c.group === g);
                const v = d?.value ?? 0;
                return (
                  <rect
                    key={g}
                    x={x1(g)}
                    y={y(v)}
                    width={x1.bandwidth()}
                    height={innerH - y(v)}
                    fill={color(g)}
                    rx={6}
                  />
                );
              })}
            </g>
          ))}

          {/* Leyenda */}
          <g
            transform={`translate(${innerW - 100},0)`}
            className="text-[10px] sm:text-xs"
          >
            {groups.map((g, i) => (
              <g key={g} transform={`translate(0,${i * 18})`}>
                <rect width={12} height={12} rx={3} fill={color(g)} />
                <text
                  x={16}
                  y={10}
                  className="fill-zinc-600 dark:fill-zinc-300"
                >
                  {g}
                </text>
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
};
