import { useState } from "react";
import {
  GlassCard,
  Badge,
  CTA,
  NavLink,
  MobileLink,
  FeatureCard,
  TechLegend,
  usePrefersDark,
} from "./components/Utils";

// Paleta (sugerido en index.css):
// :root{ --clr-navy:#04244D; --clr-cyan:#59E3E6; --clr-white:#FFFFFF; --clr-crimson:#B6244F; --clr-pink:#EA638C; }
// html { scroll-behavior: smooth; }

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
        <section id="introduccion" className="scroll-mt-24 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge>Propuesta de solución</Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Solución tecnológica moderna a un problema real
            </h1>
            <p className="mt-5 text-zinc-300">
              Presenta brevemente el problema y el contexto. Explica por qué importa,
              a quién afecta y qué objetivo persigue esta propuesta. Mantén un lenguaje
              accesible y directo. (Sustituye este texto con tu caso.)
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <GlassCard>
              <h3 className="text-lg font-semibold">Dolor actual</h3>
              <p className="mt-2 text-zinc-300">
                Enumera 2–3 puntos clave del problema: ineficiencias, costos,
                tiempos, riesgos o brechas de accesibilidad.
              </p>
            </GlassCard>
            <GlassCard>
              <h3 className="text-lg font-semibold">Objetivo</h3>
              <p className="mt-2 text-zinc-300">
                Define el resultado deseado y los indicadores de éxito (KPIs) que
                demostrarán el impacto de la solución.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Solución */}
        <section id="solucion" className="scroll-mt-24 py-16 sm:py-24">
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
        </section>

        {/* Créditos */}
        <section id="creditos" className="scroll-mt-24 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <Badge color="cyan">Créditos & Agradecimientos</Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Equipo, mentores y recursos
            </h2>
            <p className="mt-3 text-zinc-300">
              Agradece a las personas, organizaciones y herramientas que hicieron
              posible el proyecto. Añade enlaces a repositorios o datasets si aplica.
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <GlassCard>
                <h3 className="text-lg font-semibold">Equipo</h3>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-zinc-300">
                  <li>Nombre 1 — Rol</li>
                  <li>Nombre 2 — Rol</li>
                  <li>Nombre 3 — Rol</li>
                </ul>
              </GlassCard>
              <GlassCard>
                <h3 className="text-lg font-semibold">Mentores/Apoyo</h3>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-zinc-300">
                  <li>Entidad/Persona — Apoyo específico</li>
                  <li>Herramienta/Librería — Uso en el proyecto</li>
                </ul>
              </GlassCard>
            </div>
          </div>
        </section>
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
        <p className="text-sm text-zinc-400">© {new Date().getFullYear()} Tu Proyecto</p>
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <a className="hover:text-white" href="#introduccion">Introducción</a>
          <span className="opacity-40">•</span>
          <a className="hover:text-white" href="#solucion">Solución</a>
          <span className="opacity-40">•</span>
          <a className="hover:text-white" href="#creditos">Créditos</a>
        </div>
      </div>
    </footer>
  );
}

function Logo() {
  const isDark = usePrefersDark(); // Hook reutilizable del Utils
  const darkLogo = "/assets/logo_vigia.svg";
  const lightLogo = "/assets/logo_vigia-light.svg"; // renombrado sin espacios
  return <img className="h-20 w-auto p-2" src={isDark ? darkLogo : lightLogo} alt="VIGÍA" />;
}
