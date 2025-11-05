import * as d3 from "d3";

// Si ya tienes esto en otro archivo, puedes usarlo igual:
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

type TopInversion = { Institucion: string; "Monto adjudicado en colones": number };
type TopInstitucionCount = { Institucion: string; Cantidad: number };
type EgresoRow = { month: number; series: string; value: number }; // /egresos-linea-totales

import {useEffect, useMemo, useRef,  useState } from "react";
import {
  useMeasure,
  GlassCard,
  Badge,
  CTA,
  NavLink,
  MobileLink,
  FeatureCard,
  TechLegend,
  Card,
  FullBleedSection,
} from "./components/Utils";
import TopInversionesChart from "./components/TopInversionesChart";
import { TeamMemberCard, type TeamMember } from "./components/TeamMemberCard";
import AuroraBackground from "./components/AuroraBackground";

// 🔹 Nuevo: panel que hace fetch a /egresos-series y /egresos-linea-data
import MultiPercentPanel from "./components/MultiPercentPanel";
import { IframeCard } from "./components/IFrameCard";

function Logo() {
  return <img className="h-20 w-auto p-2" src="./assets/vigia_logo.svg" alt="VIGÍA" />;
}

const teamOne: TeamMember[] = [
  {
    name: "Allison Romero Jimenez",
    title: "Cybersecurity Analyst",
    role: "Lead Data Analyst",
    image: "/team/Allison_pfp.webp",
    linkedin: "https://www.linkedin.com/in/allison-romero-jimenez-849aa3239/?originalSubdomain=cr",
  },
  {
    name: "Emanuel Mena Araya",
    title: "Estudiante de Ingeniería de Software",
    role: "Desarrollador de Frontend",
    image: "/team/Emanuel_pfp.webp",
    linkedin: "https://www.linkedin.com/in/emanuel-mena-araya/",
  },
  {
    name: "Gabriela Urbina Hernández ",
    title: "Estudiante de Ingeniería de Software",
    role: "Coordinadora",
    image: "/team/Gabriela_pfp.webp",
    linkedin: "https://www.linkedin.com/in/gabriela-urbina-hern%C3%A1ndez-41a056200/",
  },
];

const teamTwo: TeamMember[] = [
  {
    name: "María Jesús Rodríguez",
    title: "Estudiante TICs",
    role: "Analisis de Datos",
    image: "/team/Maria_pfp.webp",
    linkedin: "https://www.linkedin.com/in/mar%C3%ADa-jes%C3%BAs-rodr%C3%ADguez-molina-/",
  },
  {
    name: "Melina Soto Badilla",
    title: "Tecnica en Redes",
    role: "Integración de APIs",
    image: "/team/Melina_pfp.webp",
    linkedin: "https://www.linkedin.com/in/melina-soto-09088a303/",
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-300/40 selection:text-white">
      {/* Fondo con degradados dinámicos (blurred blobs) */}
      <div className="pointer-events-none fixed inset-0 -z-10 fx-blobs">
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(89,227,230,0.25),transparent_60%)] blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(234,99,140,0.25),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(182,36,79,0.25),transparent_60%)] blur-3xl" />
      </div>

      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Introducción */}
        <FullBleedSection id="introduccion" bg="bg-black" className="py-0">
          <div className="relative min-h-[80vh] w-full">
            <AuroraBackground />
            <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-4 sm:px-6 text-center">
              <Badge>Propuesta de solución</Badge>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Donde la verdad no se negocia
              </h1>
              <p className="mt-5 max-w-2xl text-zinc-200/90">
                Transparencia, datos abiertos y visualizaciones en tiempo real para combatir la corrupción.
              </p>

              <div className="mt-10 grid w-full max-w-3xl gap-6 sm:grid-cols-2">
                <GlassCard>
                  <h3 className="text-lg font-semibold">Dolor actual</h3>
                  <p className="mt-2 text-zinc-300">
                    Enumera 2–3 puntos clave del problema: ineficiencias, costos, tiempos, riesgos o brechas de accesibilidad.
                  </p>
                </GlassCard>
                <GlassCard>
                  <h3 className="text-lg font-semibold">Objetivo</h3>
                  <p className="mt-2 text-zinc-300">
                    Define el resultado deseado y los indicadores de éxito (KPIs) que demostrarán el impacto de la solución.
                  </p>
                </GlassCard>
              </div>
            </div>
          </div>
        </FullBleedSection>

        {/* Solución */}
        <FullBleedSection id="solucion" bg="bg-[#1e293b]" className="py-20 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="sm:flex sm:items-end sm:justify-between">
              <div>
                <Badge color="pink">La solución</Badge>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Arquitectura y funcionalidades clave
                </h2>
                <p className="mt-3 max-w-2xl text-zinc-300">
                  Describe cómo funciona tu solución, su arquitectura a alto nivel y las tecnologías empleadas.
                </p>
              </div>
              <TechLegend />
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <FeatureCard title="Módulo A" desc="Explica la funcionalidad principal y el beneficio directo para el usuario." />
              <FeatureCard title="Módulo B" desc="Resalta seguridad, rendimiento y/o accesibilidad, según corresponda." />
              <FeatureCard title="Módulo C" desc="Incluye métricas o KPIs que evidencien impacto o mejoras." />
            </div>

            <GlassCard className="mt-8">
              <h3 className="text-lg font-semibold">Flujo de uso</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-zinc-300">
                <li>Usuario inicia sesión o se identifica (si aplica).</li>
                <li>Realiza acción principal (buscar, solicitar, cargar, etc.).</li>
                <li>Sistema procesa y presenta resultado con feedback claro.</li>
                <li>Se registran métricas/KPIs para evaluación continua.</li>
              </ol>
            </GlassCard>
          </div>
        </FullBleedSection>

        {/* =========================
            GRÁFICOS
           ========================= */}
        <FullBleedSection id="graficos" className="py-20 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="sm:flex sm:items-end sm:justify-between">
              <div>
                <Badge color="cyan">Gráficos</Badge>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Visualizaciones clave (D3 + React)
                </h2>
                <p className="mt-3 max-w-2xl text-zinc-300">
                  Componentes reutilizables conectados a la API FastAPI.
                </p>
              </div>
            </div>

            <div>
              <Card title="Top 5 instituciones por inversión" subtitle="Datos de /top-inversiones (FastAPI)">
                <div className="pt-2">
                  <TopInversionesChart />
                </div>
              </Card>

              <Card
                title="Distribución porcentual mensual"
                subtitle="Multi-línea por Título de Descripción (0–100%) · fuente: /egresos-linea-data"
              >
                <MultiPercentPanel />
              </Card>
            </div>

            <div>
      <IframeCard
        title="Mapa de Licitaciones CR"
        src="/data/mapa_cantones_CR.html"
        className="mt-6"
      />
    </div>
          </div>
        </FullBleedSection>

        {/* Créditos */}
        <FullBleedSection id="creditos" className="py-20 sm:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <Badge color="cyan">Créditos & Agradecimientos</Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Equipo, mentores y recursos
            </h2>
            <p className="mt-3 text-zinc-300 max-w-2xl mx-auto">
              Agradecemos al equipo de desarrollo, mentores y colaboradores que hicieron posible este proyecto.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-1 lg:grid-cols-3 justify-items-center items-stretch mx-auto max-w-3xl">
            {teamOne.map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center items-stretch gap-y-6 gap-x-6">
            {teamTwo.map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>

          <div className="mt-12 mx-auto max-w-3xl">
            <GlassCard>
              <h3 className="text-lg font-semibold">Agradecimientos</h3>
              <p className="mt-2 text-zinc-300">
                Agradecimientos especiales a la Universidad CENFOTEC por haber apoyado al equipo con información, contactos y transporte para el evento.
              </p>
            </GlassCard>
          </div>
        </FullBleedSection>
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#introduccion" className="group inline-flex items-center gap-2">
          <Logo />
          <span className="text-sm font-semibold tracking-wide text-white/90 group-hover:text-white">
            Vigilancia Proactiva y Centinela de la Transparencia
          </span>
        </a>

        <nav className="hidden items-center gap-1 sm:flex">
          <NavLink href="#introduccion">Introducción</NavLink>
          <NavLink href="#solucion">Solución</NavLink>
          <NavLink href="#graficos">Gráficos</NavLink>
          <NavLink href="#creditos">Créditos</NavLink>
          <CTA href="#solucion">Ver demo</CTA>
        </nav>

        <button
          aria-label="Abrir menú"
          className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
          onClick={() => setOpen(!open)}
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-white/10 bg-zinc-900/60 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="grid gap-2">
              <MobileLink href="#introduccion" onClick={() => setOpen(false)}>Introducción</MobileLink>
              <MobileLink href="#solucion" onClick={() => setOpen(false)}>Solución</MobileLink>
              <MobileLink href="#graficos" onClick={() => setOpen(false)}>Gráficos</MobileLink>
              <MobileLink href="#creditos" onClick={() => setOpen(false)}>Créditos</MobileLink>
              <CTA href="#solucion" className="mt-2 w-full text-center">Ver demo</CTA>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-zinc-400">© {new Date().getFullYear()} Vigia</p>
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <a className="hover:text-white" href="#introduccion">Introducción</a>
          <span className="opacity-40">•</span>
          <a className="hover:text-white" href="#solucion">Solución</a>
          <span className="opacity-40">•</span>
          <a className="hover:text-white" href="#graficos">Gráficos</a>
          <span className="opacity-40">•</span>
          <a className="hover:text-white" href="#creditos">Créditos</a>
        </div>
      </div>
    </footer>
  );
}

function ChartTopInversiones() {
  const { ref, rect } = useMeasure<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<TopInversion[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`${API_BASE}/top-inversiones`)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then((rows: TopInversion[]) => alive && setData(rows))
      .catch(e => alive && setErr(String(e)));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data) return;
    const width = Math.max(360, rect.width || 360);
    const height = 280;
    const margin = { top: 20, right: 16, bottom: 42, left: 80 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.Institucion))
      .range([0, innerW]).padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d["Monto adjudicado en colones"]) || 0]).nice()
      .range([innerH, 0]);

    const fmtMoney = d3.format("~s");

    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-20)")
      .attr("dx", "-0.5em")
      .attr("dy", "0.25em")
      .style("font-size", "11px");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${fmtMoney(Number(d))}` as any))
      .selectAll("text").style("font-size", "11px");

    g.selectAll("rect.bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.Institucion)!)
      .attr("y", d => y(d["Monto adjudicado en colones"]))
      .attr("width", x.bandwidth())
      .attr("height", d => innerH - y(d["Monto adjudicado en colones"]))
      .attr("fill", "url(#grad1)");

    // simple grad
    const defs = svg.append("defs");
    const grad = defs.append("linearGradient").attr("id", "grad1").attr("x1", "0").attr("x2", "0").attr("y1", "0").attr("y2", "1");
    grad.append("stop").attr("offset", "0%").attr("stop-color", "#59E3E6");
    grad.append("stop").attr("offset", "100%").attr("stop-color", "#EA638C");

    // grid
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerW).tickFormat(() => ""))
      .selectAll("line").attr("stroke", "rgba(255,255,255,.08)");

  }, [data, rect.width]);

  if (err) return <div className="text-red-400 text-sm">Error: {err}</div>;
  if (!data) return <div className="text-zinc-400 text-sm">Cargando…</div>;
  return <div ref={ref}><svg ref={svgRef} /></div>;
}

function ChartTopInstitucionesCount() {
  const { ref, rect } = useMeasure<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<TopInstitucionCount[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`${API_BASE}/top-instituciones`)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then((rows: TopInstitucionCount[]) => alive && setData(rows))
      .catch(e => alive && setErr(String(e)));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data) return;
    const width = Math.max(360, rect.width || 360);
    const height = 180;
    const margin = { top: 10, right: 16, bottom: 24, left: 140 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const y = d3.scaleBand()
      .domain(data.map(d => d.Institucion))
      .range([0, innerH]).padding(0.25);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Cantidad) || 0]).nice()
      .range([0, innerW]);

    g.append("g").call(d3.axisLeft(y)).selectAll("text").style("font-size", "11px");
    g.append("g").attr("transform", `translate(0,${innerH})`).call(d3.axisBottom(x).ticks(5)).selectAll("text").style("font-size", "11px");

    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("y", d => y(d.Institucion)!)
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", d => x(d.Cantidad))
      .attr("fill", "#59E3E6");
  }, [data, rect.width]);

  if (err) return <div className="text-red-400 text-sm">Error: {err}</div>;
  if (!data) return <div className="text-zinc-400 text-sm">Cargando…</div>;
  return <div ref={ref}><svg ref={svgRef} /></div>;
}

function ChartEgresosLineasTopN({ topN = 8 }: { topN?: number }) {
  const { ref, rect } = useMeasure<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [rows, setRows] = useState<EgresoRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`${API_BASE}/egresos-linea-totales`)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then((data: EgresoRow[]) => alive && setRows(data))
      .catch(e => alive && setErr(String(e)));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!svgRef.current || !rows) return;

    // Agrupa por serie y filtra Top N por suma total
    const bySeries = d3.rollups(
      rows,
      v => ({
        total: d3.sum(v, d => d.value),
        points: d3.rollups(v, vv => vv[0].value, d => d.month) // month->value
          .map(([m, val]) => ({ m: Number(m), v: Number(val) }))
          .sort((a,b)=>a.m-b.m),
      }),
      d => d.series
    );

    const top = bySeries
      .sort((a,b) => d3.descending(a[1].total, b[1].total))
      .slice(0, topN);

    // dominios
    const months = Array.from(new Set(rows.map(r => r.month))).sort((a,b)=>a-b);
    const yMax = d3.max(top.flatMap(([_, s]) => s.points.map(p => p.v))) || 0;

    const width = Math.max(360, rect.width || 360);
    const height = 300;
    const margin = { top: 18, right: 16, bottom: 32, left: 80 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([months[0], months[months.length-1]])
      .range([0, innerW]);

    const y = d3.scaleLinear().domain([0, yMax]).nice().range([innerH, 0]);

    const color = d3.scaleOrdinal<string, string>()
      .domain(top.map(([name]) => name))
      .range(d3.schemeTableau10);

    const line = d3.line<{m:number; v:number}>()
      .x(d => x(d.m))
      .y(d => y(d.v))
      .curve(d3.curveMonotoneX);

    const fmtMoney = d3.format("~s");

    g.append("g").attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(Math.min(10, months.length)).tickFormat(d=>String(d) as any))
      .selectAll("text").style("font-size", "11px");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d=>fmtMoney(Number(d)) as any))
      .selectAll("text").style("font-size", "11px");

    // grid
    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerW).tickFormat(()=>"" as any))
      .selectAll("line").attr("stroke", "rgba(255,255,255,.08)");

    // líneas
    g.selectAll("path.line")
      .data(top)
      .join("path")
      .attr("class","line")
      .attr("fill","none")
      .attr("stroke", ([name]) => color(name))
      .attr("stroke-width", 2)
      .attr("d", ([, s]) => line(s.points)!);

    // leyenda simple
    const legend = svg.append("g").attr("transform", `translate(${margin.left},${height-6})`);
    const items = legend.selectAll("g.litem").data(top).join("g")
      .attr("class","litem")
      .attr("transform", (_,i)=>`translate(${i*180},-8)`);

    items.append("rect").attr("width", 10).attr("height", 10).attr("rx",2)
      .attr("fill", ([name]) => color(name));
    items.append("text").attr("x", 14).attr("y", 9).text(([name])=>name)
      .style("font-size","11px").style("fill","#ddd");
  }, [rows, rect.width]);

  if (err) return <div className="text-red-400 text-sm">Error: {err}</div>;
  if (!rows) return <div className="text-zinc-400 text-sm">Cargando…</div>;
  return <div ref={ref}><svg ref={svgRef} /></div>;
}
