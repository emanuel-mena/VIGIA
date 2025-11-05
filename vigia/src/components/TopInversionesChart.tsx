// src/components/TopInversionesChart.tsx
import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchTopInversiones } from "../api";
import type { TopInversion } from "../api";


// Utilidad: formato en colones
const fmtCRC = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
  maximumFractionDigits: 0,
});

type Datum = { name: string; value: number };

export default function TopInversionesChart() {
  const [data, setData] = useState<Datum[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // contenedor y svg refs
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // fetch
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchTopInversiones()
      .then((rows: TopInversion[]) => {
        if (!alive) return;
        const mapped: Datum[] = rows
          .map(r => ({
            name: r.Institucion,
            value: Number(r["Monto adjudicado en colones"] ?? 0),
          }))
          .filter(d => Number.isFinite(d.value))
          .sort((a, b) => d3.descending(a.value, b.value));
        setData(mapped);
      })
      .catch(e => setErr(e.message || "Error"))
      .finally(() => setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // redibujo con ResizeObserver
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading, err]);

  const draw = () => {
    if (!svgRef.current || !wrapRef.current || !data || data.length === 0) return;

    const node = svgRef.current;
    const { width: W } = node.getBoundingClientRect();
    const H = Math.max(260, 56 * data.length); // alto dinámico según barras

    const margin = { top: 10, right: 24, bottom: 32, left: 12 };
    // calculamos el espacio necesario para etiquetas de la izquierda (nombres)
    const longest = d3.max(data, d => d.name.length) ?? 12;
    const extraLeft = Math.min(320, Math.max(80, longest * 7)); // heurística
    const left = margin.left + extraLeft;

    const innerW = Math.max(100, W - left - margin.right);
    const innerH = Math.max(100, H - margin.top - margin.bottom);

    node.setAttribute("width", String(W));
    node.setAttribute("height", String(H));

    const svg = d3.select(node);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${left},${margin.top})`);

    // escalas
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.value)!])
      .nice()
      .range([0, innerW]);

    const y = d3
      .scaleBand<string>()
      .domain(data.map(d => d.name))
      .range([0, innerH])
      .padding(0.25);

    // eje X
    const xAxis = d3.axisBottom(x).ticks(5).tickFormat(v => fmtCRC.format(Number(v)));
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(xAxis as any)
      .call(g => g.selectAll(".domain").attr("opacity", 0.2))
      .call(g => g.selectAll("line").attr("opacity", 0.2));

    // guías horizontales ligeras
    g.append("g")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.08)
      .selectAll("line")
      .data(y.domain())
      .join("line")
      .attr("x1", 0)
      .attr("x2", innerW)
      .attr("y1", d => (y(d) ?? 0) + (y.bandwidth() / 2))
      .attr("y2", d => (y(d) ?? 0) + (y.bandwidth() / 2));

    // barras
    const bars = g
      .selectAll("rect.bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", d => y(d.name)!)
      .attr("width", 0)
      .attr("height", y.bandwidth())
      .attr("rx", Math.min(10, y.bandwidth() / 2))
      .attr("fill", "currentColor")
      .attr("opacity", 0.9);

    bars
      .transition()
      .duration(750)
      .attr("width", d => x(d.value));

    // etiquetas de valor
    g.selectAll("text.value")
      .data(data)
      .join("text")
      .attr("class", "value")
      .attr("x", d => x(d.value) + 8)
      .attr("y", d => (y(d.name) ?? 0) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("fill", "currentColor")
      .attr("opacity", 0.9)
      .style("font-size", 12)
      .text(d => fmtCRC.format(d.value));

    // etiquetas de nombre (a la izquierda, fuera del área, con ellipsis)
    const nameLayer = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    nameLayer
      .selectAll("text.label")
      .data(data)
      .join("text")
      .attr("class", "label")
      .attr("x", extraLeft - 12)
      .attr("y", d => (y(d.name) ?? 0) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("fill", "currentColor")
      .style("font-size", 12)
      .style("opacity", 0.95)
      .text(d => d.name.length > 60 ? d.name.slice(0, 57) + "…" : d.name);
  };

  const content = useMemo(() => {
    if (loading) return <p className="text-zinc-300">Cargando datos…</p>;
    if (err) return <p className="text-red-300">Error: {err}</p>;
    if (!data || data.length === 0) return <p className="text-zinc-300">Sin datos.</p>;
    return <svg ref={svgRef} className="w-full h-auto text-cyan-300/90" role="img" aria-label="Top inversiones" />;
  }, [loading, err, data]);

  return (
    <div ref={wrapRef} className="w-full">
      {content}
    </div>
  );
}
