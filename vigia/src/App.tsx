import { percentRows } from "./data/percentRows";

import { useMemo, useState } from "react";
import {
  GlassCard,
  Badge,
  CTA,
  NavLink,
  MobileLink,
  FeatureCard,
  TechLegend,
  Card, FullBleedSection,
} from "./components/Utils";

// src/api.ts
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export type TopInversion = {
  Institucion: string;
  "Monto adjudicado en colones": number;
};

import { MultiPercentLineChart } from "./components/MultiPercentLineChart";


export async function fetchTopInversiones(): Promise<TopInversion[]> {
  const res = await fetch(`${API_BASE}/top-inversiones`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}


/**import { AreaLineChart } from "./components/AreaLineComponent";
import { GroupedBars } from "./components/GroupedBarChartComponent";
import { ScatterTrend } from "./components/ScatterTrendLineComponent";
import { DonutChart } from "./components/DonutChartComponent";*/
import TopInversionesChart from './components/TopInversionesChart';
import { TeamMemberCard, type TeamMember } from "./components/TeamMemberCard";
import AuroraBackground from "./components/AuroraBackground";


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

const teamTwo: TeamMember[] = [{
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
},]

// Paleta (sugerido en index.css):
// :root{ --clr-navy:#04244D; --clr-cyan:#59E3E6; --clr-white:#FFFFFF; --clr-crimson:#B6244F; --clr-pink:#EA638C; }
// html { scroll-behavior: smooth; }

export default function App() {
  /** =========================
   *  Datos de ejemplo (mock)
   *  ========================= */
  // Serie temporal (12 meses)
  /**const seriesA = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        date: new Date(2025, i, 1),
        value: Math.round(40 + 20 * Math.sin(i / 1.8) + Math.random() * 8),
      })),
    []
  );

  // Barras agrupadas (dos grupos por categoría)
  const categories = useMemo(
    () => [
      { label: "Q1", group: "2024", value: 120 },
      { label: "Q1", group: "2025", value: 148 },
      { label: "Q2", group: "2024", value: 160 },
      { label: "Q2", group: "2025", value: 175 },
      { label: "Q3", group: "2024", value: 142 },
      { label: "Q3", group: "2025", value: 168 },
      { label: "Q4", group: "2024", value: 180 },
      { label: "Q4", group: "2025", value: 196 },
    ],
    []
  );

  // Dispersión + recta de tendencia
  const scatterPoints = useMemo(
    () =>
      Array.from({ length: 40 }, () => {
        const x = Math.random() * 100;
        // relación positiva con ruido
        const y = x * 0.8 + 10 + (Math.random() - 0.5) * 20;
        return { x, y };
      }),
    []
  );

  // Donut
  const donutData = useMemo(
    () => [
      { name: "Android", value: 58 },
      { name: "iOS", value: 34 },
      { name: "Web", value: 20 },
      { name: "Otros", value: 8 },
    ],
    []
  );*/

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
            {/* Fondo AURORA: detrás del contenido, NO z negativo */}
            <AuroraBackground />

            {/* Contenido centrado, encima del fondo */}
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
                  Describe cómo funciona tu solución, su arquitectura a alto nivel
                  y las tecnologías empleadas. Luego, lista las funcionalidades
                  destacadas y su valor.
                </p>
              </div>
              <TechLegend />
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <FeatureCard
                title="Módulo A"
                desc="Explica la funcionalidad principal y el beneficio directo para el usuario."
              />
              <FeatureCard
                title="Módulo B"
                desc="Resalta seguridad, rendimiento y/o accesibilidad, según corresponda."
              />
              <FeatureCard
                title="Módulo C"
                desc="Incluye métricas o KPIs que evidencien impacto o mejoras."
              />
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
            NUEVA SECCIÓN: GRÁFICOS
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
                  Un set de componentes reutilizables para mostrar series temporales,
                  comparativas por categoría, correlaciones con tendencia y reparto por
                  segmentos.
                </p>
              </div>
            </div>

            {/*<div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card title="Revenue over time" subtitle="Area + Line con tooltip">
                <AreaLineChart data={seriesA} />
              </Card>

              <Card title="Performance por categoría" subtitle="Barras agrupadas con leyenda">
                <GroupedBars data={categories} />
              </Card>

              <Card title="Correlación" subtitle="Dispersión con recta de tendencia">
                <ScatterTrend data={scatterPoints} />
              </Card>

              <Card title="Participación de plataforma" subtitle="Donut + leyenda">
                <DonutChart data={donutData} />
              </Card>
            </div>*/}

            <div>
              <Card title="Top 5 instituciones por inversión" subtitle="Datos de /top-inversiones (FastAPI)">
                <div className="pt-2">
                  <TopInversionesChart />
                </div>
              </Card>

              <Card title="Distribución porcentual mensual" subtitle="Multi-línea por institución (0-100%)">
                <MultiPercentLineChart data={percentRows} />
              </Card>

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
          <NavLink href="#graficos">Gráficos</NavLink>{/* nuevo */}
          <NavLink href="#creditos">Créditos</NavLink>
          <CTA href="#solucion">Ver demo</CTA>
        </nav>

        <button
          aria-label="Abrir menú"
          className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
          onClick={() => setOpen(!open)}
        >
          {/* Icono accesible (decorativo) */}
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-white/10 bg-zinc-900/60 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="grid gap-2">
              <MobileLink href="#introduccion" onClick={() => setOpen(false)}>
                Introducción
              </MobileLink>
              <MobileLink href="#solucion" onClick={() => setOpen(false)}>
                Solución
              </MobileLink>
              <MobileLink href="#graficos" onClick={() => setOpen(false)}>
                Gráficos
              </MobileLink>
              <MobileLink href="#creditos" onClick={() => setOpen(false)}>
                Créditos
              </MobileLink>
              <CTA href="#solucion" className="mt-2 w-full text-center">
                Ver demo
              </CTA>
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

function Logo() {
  return <img className="h-20 w-auto p-2" src='./assets/vigia_logo.svg' alt="VIGÍA" />;
}
