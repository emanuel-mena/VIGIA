import * as d3 from "d3"

interface DonutDataProps{
    data: {
        name : string,
        value: number
    }[]
}

/* =============================
   Chart 4: Donut + Legend
   ============================= */
export const DonutChart: React.FC<DonutDataProps> = ({data}) => {
  const size = 240;
  const radius = size / 2;
  const innerR = radius - 34;
  const color = d3.scaleOrdinal<string, string>()
    .domain(data.map(d => d.name))
    .range([
      "oklch(64% .18 255)", // blue
      "oklch(70% .17 150)", // green
      "oklch(69% .19 30)", // orange
      "oklch(72% .12 320)", // pink/purple
    ]);

  const arcGen = d3.arc<d3.PieArcDatum<(typeof data)[number]>>()
    .innerRadius(innerR)
    .outerRadius(radius - 6)
    .cornerRadius(8)
    .padAngle(0.02);

  const pie = d3.pie<(typeof data)[number]>().value(d => d.value).sort(null);
  const arcs = pie(data);
  const total = d3.sum(data, d => d.value);

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 place-items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${radius},${radius})`}>
          {arcs.map(a => (
            <path key={a.data.name} d={arcGen(a) ?? undefined} fill={color(a.data.name)} />)
          )}
          <text
            textAnchor="middle"
            className="fill-zinc-800 dark:fill-zinc-100"
            dy={4}
          >
            <tspan className="text-xl font-semibold">{Math.round((data[1].value / total) * 100)}%</tspan>
            <tspan x={0} dy={18} className="text-xs opacity-70">Android share</tspan>
          </text>
        </g>
      </svg>

      <div className="w-full max-w-xs">
        <ul className="space-y-2">
          {data.map(d => (
            <li key={d.name} className="flex items-center justify-between rounded-xl border border-zinc-200/70 dark:border-zinc-800 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded" style={{ background: color(d.name) }} />
                <span className="text-sm text-zinc-700 dark:text-zinc-200">{d.name}</span>
              </div>
              <span className="text-sm tabular-nums text-zinc-600 dark:text-zinc-300">{d.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};