// src/components/TopInversionesChart.tsx
import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchTopInversiones } from "../api";
import type { TopInversion } from "../api";

// Formatos CRC
const fmtCRC = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
  maximumFractionDigits: 0,
});
const fmtCRCCompact = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
  notation: "compact",
  maximumFractionDigits: 1,
});

type Datum = { name: string; value: number };

const MOBILE_BREAK = 560;
const MAX_MOBILE_BARS = 12; // evita scroll vertical excesivo en móvil

export default function TopInversionesChart() {
  const [data, setData] = useState<Datum[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // refs
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);

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

  // ResizeObserver
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading, err]);

  // Tooltip helpers
  const showTip = (e: PointerEvent, d: Datum) => {
    const tip = tipRef.current;
    if (!tip) return;
    tip.style.display = "block";
    tip.innerHTML = `
      <div class="text-xs md:text-sm">
        <div class="font-medium">${escapeHtml(d.name)}</div>
        <div class="opacity-90">${fmtCRC.format(d.value)}</div>
      </div>`;
    const bounds = wrapRef.current!.getBoundingClientRect();
    const x = e.clientX - bounds.left + 10;
    const y = e.clientY - bounds.top + 10;
    tip.style.transform = `translate(${x}px, ${y}px)`;
  };
  const hideTip = () => {
    const tip = tipRef.current;
    if (tip) tip.style.display = "none";
  };

  const draw = () => {
    if (!svgRef.current || !wrapRef.current || !data || data.length === 0) return;

    const node = svgRef.current;
    const wrap = wrapRef.current;
    const { width: W } = wrap.getBoundingClientRect();
    const isMobile = W < MOBILE_BREAK;

    // En móvil: limitar cantidad de barras para evitar scroll eterno (ajustable)
    const rows = isMobile ? data.slice(0, MAX_MOBILE_BARS) : data;
    const formatValue = isMobile ? fmtCRCCompact : fmtCRC;

    // Dimensiones base
    const margin = isMobile
      ? { top: 8, right: 12, bottom: 48, left: 8 }
      : { top: 10, right: 24, bottom: 36, left: 16 };

    // Limpia
    const svg = d3.select(node);
    svg.selectAll("*").remove();

    // =========================
    // MODO VERTICAL (móvil)
    // =========================
    if (isMobile) {
      const barGap = 8;
      const minBarW = 32;
      const innerW = Math.max(180, W - margin.left - margin.right);
      const barW = Math.max(
        minBarW,
        Math.floor((innerW - barGap * (rows.length - 1)) / rows.length)
      );
      const H = 280; // alto fijo y compacto
      const innerH = H - margin.top - margin.bottom;

      node.setAttribute("width", String(W));
      node.setAttribute("height", String(H));
      svg.attr("class", "w-full h-auto text-cyan-300/90");

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleBand<string>()
        .domain(rows.map(d => d.name))
        .range([0, rows.length * (barW + barGap) - barGap]);

      // Asegura que las barras no se salgan
      const totalContentW = rows.length * (barW + barGap) - barGap;
      const leftPad = (innerW - totalContentW) / 2;

      const max = d3.max(rows, d => d.value)!;
      const y = d3.scaleLinear().domain([0, max]).nice().range([innerH, 0]);

      // Eje Y (valores)
      const yAxis = d3
        .axisLeft(y)
        .ticks(4)
        .tickFormat(v => formatValue.format(Number(v)));
      g.append("g")
        .call(yAxis as any)
        .call(g => g.selectAll(".domain").attr("opacity", 0.2))
        .call(g => g.selectAll("line").attr("opacity", 0.15))
        .selectAll("text")
        .attr("font-size", 10);

      // Grid horizontal ligero
      g.append("g")
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.08)
        .selectAll("line")
        .data(y.ticks(4))
        .join("line")
        .attr("x1", 0)
        .attr("x2", innerW)
        .attr("y1", d => y(d))
        .attr("y2", d => y(d));

      // Barras
      const bars = g
        .append("g")
        .attr("transform", `translate(${leftPad},0)`)
        .selectAll("rect.bar")
        .data(rows)
        .join("rect")
        .attr("class", "bar")
        .attr("x", (_d, i) => i * (barW + barGap))
        .attr("y", innerH)
        .attr("width", barW)
        .attr("height", 0)
        .attr("rx", 8)
        .attr("fill", "currentColor")
        .attr("opacity", 0.9)
        .on("pointerenter", function (_ev, d) {
          (this as SVGRectElement).setAttribute("opacity", "1");
        })
        .on("pointerleave", function () {
          (this as SVGRectElement).setAttribute("opacity", "0.9");
          hideTip();
        })
        .on("pointermove", (ev: PointerEvent, d) => showTip(ev, d));

      bars
        .transition()
        .duration(700)
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value));

      // Valores encima de cada barra (compactos)
      g.append("g")
        .attr("transform", `translate(${leftPad},0)`)
        .selectAll("text.value")
        .data(rows)
        .join("text")
        .attr("class", "value")
        .attr("x", (_d, i) => i * (barW + barGap) + barW / 2)
        .attr("y", d => y(d.value) - 6)
        .attr("text-anchor", "middle")
        .attr("fill", "currentColor")
        .style("font-size", 10)
        .style("opacity", 0.95)
        .text(d => formatValue.format(d.value));

      // Etiquetas X (rotadas con elipsis)
      g.append("g")
        .attr("transform", `translate(${leftPad},${innerH + 2})`)
        .selectAll("text.label")
        .data(rows)
        .join("text")
        .attr("class", "label")
        .attr("x", (_d, i) => i * (barW + barGap) + barW / 2)
        .attr("y", 0)
        .attr("text-anchor", "end")
        .attr("fill", "currentColor")
        .style("font-size", 10)
        .attr("transform", (_d, i) => `translate(0,0) rotate(-35, ${i * (barW + barGap) + barW / 2}, 0)`)
        .text(d => ellipsis(d.name, 18));

      return;
    }

    // =========================
    // MODO HORIZONTAL (desktop/tablet)
    // =========================
    const longest = d3.max(data, d => d.name.length) ?? 12;
    const extraLeft = Math.min(300, Math.max(80, longest * 7)); // heurística
    const left = margin.left + extraLeft;

    const H = Math.max(260, 50 * data.length);
    const innerW = Math.max(100, W - left - margin.right);
    const innerH = Math.max(100, H - margin.top - margin.bottom);

    node.setAttribute("width", String(W));
    node.setAttribute("height", String(H));
    svg.attr("class", "w-full h-auto text-cyan-300/90");

    const g = svg.append("g").attr("transform", `translate(${left},${margin.top})`);

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

    const xAxis = d3.axisBottom(x).ticks(5).tickFormat(v => fmtCRC.format(Number(v)));
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(xAxis as any)
      .call(g => g.selectAll(".domain").attr("opacity", 0.2))
      .call(g => g.selectAll("line").attr("opacity", 0.2))
      .selectAll("text")
      .attr("font-size", 11);

    // guías horizontales
    g.append("g")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.08)
      .selectAll("line")
      .data(y.domain())
      .join("line")
      .attr("x1", 0)
      .attr("x2", innerW)
      .attr("y1", d => (y(d) ?? 0) + y.bandwidth() / 2)
      .attr("y2", d => (y(d) ?? 0) + y.bandwidth() / 2);

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
      .attr("opacity", 0.9)
      .on("pointerenter", function (_ev, d) {
        (this as SVGRectElement).setAttribute("opacity", "1");
      })
      .on("pointerleave", function () {
        (this as SVGRectElement).setAttribute("opacity", "0.9");
        hideTip();
      })
      .on("pointermove", (ev: PointerEvent, d) => showTip(ev, d));

    bars.transition().duration(750).attr("width", d => x(d.value));

    // valores
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

    // nombres a la izquierda (con elipsis suave)
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
      .text(d => ellipsis(d.name, 60));
  };

  const content = useMemo(() => {
    if (loading) return <p className="text-zinc-300">Cargando datos…</p>;
    if (err) return <p className="text-red-300">Error: {err}</p>;
    if (!data || data.length === 0) return <p className="text-zinc-300">Sin datos.</p>;
    return (
      <div className="relative">
        <svg
          ref={svgRef}
          className="w-full h-auto text-cyan-300/90"
          role="img"
          aria-label="Top inversiones"
        />
        {/* Tooltip */}
        <div
          ref={tipRef}
          className="pointer-events-none absolute z-10 hidden rounded-lg border border-white/10 bg-zinc-900/90 text-white shadow-xl px-3 py-2"
          style={{ display: "none" }}
        />
      </div>
    );
  }, [loading, err, data]);

  return (
    <div ref={wrapRef} className="w-full select-none touch-pan-y">
      {content}
      {/* Nota pequeña visible solo en móvil cuando se recorta la lista */}
      {data && data.length > MAX_MOBILE_BARS && (
        <p className="mt-2 text-[11px] text-zinc-400 sm:hidden">
          Mostrando primeras {MAX_MOBILE_BARS} instituciones en móvil.
        </p>
      )}
    </div>
  );
}

/* =============================
   Utilidades
   ============================= */
function ellipsis(s: string, max: number) {
  if (s.length <= max) return s;
  return s.slice(0, Math.max(0, max - 1)).trimEnd() + "…";
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
