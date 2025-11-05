import * as d3 from "d3";
import React, { useRef, useEffect, useState } from "react";
/* =============================
   Axis components (React render)
   ============================= */

type ContinuousScale =
  | d3.ScaleLinear<number, number>
  | d3.ScaleTime<number, number>
  | d3.ScaleLogarithmic<number, number>;

export function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [rect, setRect] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      setRect({ width: cr.width, height: cr.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return { ref, rect };
}

export const Card: React.FC<React.PropsWithChildren<{ title: string; subtitle?: string }>> = ({ title, subtitle, children }) => (
  <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
    <div className="border-b border-zinc-100/80 dark:border-zinc-800 px-4 sm:px-6 py-10">
      <h3 className="text-zinc-900 dark:text-zinc-50 font-semibold text-base sm:text-lg">{title}</h3>
      {subtitle && <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">{subtitle}</p>}
    </div>
    <div className="p-4 sm:p-6">{children}</div>
  </div>
);

export const XAxis: React.FC<{
  scale: ContinuousScale;
  y: number;
  format?: (d: any) => string;
  ticks?: number;
}> = ({ scale, y, format}) => {
  const values = scale.domain();
  const f = format ?? (d => (d instanceof Date ? d3.timeFormat("%b")(d) : String(d)));
  return (
    <g transform={`translate(0,${y})`} className="text-zinc-400">
      <line x1={0} x2={(scale.range() as number[])[1]} y1={0} y2={0} className="stroke-zinc-200 dark:stroke-zinc-800" />
      {values.map((v: any, i: number) => (
        <g key={i} transform={`translate(${(scale as any)(v)},0)`}>
          <line y2={6} className="stroke-zinc-300 dark:stroke-zinc-700" />
          <text dy={16} className="text-[10px] sm:text-xs fill-zinc-500 dark:fill-zinc-400" textAnchor="middle">
            {f(v)}
          </text>
        </g>
      ))}
    </g>
  );
};

export const YAxis: React.FC<{
  scale: d3.ScaleLinear<number, number>;
  x: number;
  ticks?: number;
  format?: (n: number) => string;
}> = ({ scale, x, ticks = 5, format = d3.format("~s") }) => {
  const values = scale.ticks(ticks);
  return (
    <g transform={`translate(${x},0)`} className="text-zinc-400">
      <line y1={0} y2={(scale.range() as number[])[0]} className="stroke-zinc-200 dark:stroke-zinc-800" />
      {values.map((v : number, i : number) => (
        <g key={i} transform={`translate(0,${scale(v)})`}>
          <line x2={-6} className="stroke-zinc-300 dark:stroke-zinc-700" />
          <text x={-10} dy={"0.32em"} className="text-[10px] sm:text-xs fill-zinc-500 dark:fill-zinc-400" textAnchor="end">
            {format(v)}
          </text>
          <line x1={0} x2={(scale.range() as number[])[1]} className="stroke-zinc-100 dark:stroke-zinc-800" />
        </g>
      ))}
    </g>
  );
};


/* =========================
   Hooks
   ========================= */
export function usePrefersDark(defaultValue = false) {
  const [isDark, setIsDark] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setIsDark(!!mq.matches);
    apply();

    // Modern + legacy listeners
    mq.addEventListener?.("change", apply);
    // @ts-ignore
    mq.addListener?.(apply);

    return () => {
      mq.removeEventListener?.("change", apply);
      // @ts-ignore
      mq.removeListener?.(apply);
    };
  }, []);

  return isDark;
}

/* =========================
   UI Primitives
   ========================= */
export function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

export function Badge({
  children,
  color = "navy",
}: {
  children: React.ReactNode;
  color?: "navy" | "cyan" | "pink";
}) {
  const colorMap = {
    navy: "bg-[var(--clr-navy,#04244D)] text-white",
    cyan: "bg-[var(--clr-cyan,#59E3E6)] text-black",
    pink: "bg-[var(--clr-pink,#EA638C)] text-black",
  } as const;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-white/10 ${colorMap[color]}`}>
      {children}
    </span>
  );
}

export function CTA({
  href,
  className = "",
  children = "Comenzar",
}: {
  href: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-black 
      bg-gradient-to-r from-[var(--clr-cyan,_#59E3E6)] to-[var(--clr-pink,_#EA638C)]
      hover:from-cyan-200 hover:to-pink-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 ${className}`}
    >
      {children}
    </a>
  );
}

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-200 hover:text-white hover:bg-white/5 ring-1 ring-transparent hover:ring-white/10"
    >
      {children}
    </a>
  );
}

export function MobileLink({
  href,
  children,
  onClick,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`block rounded-xl px-3 py-2 text-sm font-medium text-zinc-200 hover:text-white hover:bg-white/5 ring-1 ring-transparent hover:ring-white/10 ${className}`}
    >
      {children}
    </a>
  );
}

/* =========================
   Composeables
   ========================= */
export function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <GlassCard>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-zinc-300">{desc}</p>
      <div className="mt-4 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--clr-cyan, #59E3E6)" }} />
        <span className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--clr-pink, #EA638C)" }} />
        <span className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--clr-crimson, #B6244F)" }} />
      </div>
    </GlassCard>
  );
}

export function TechLegend() {
  return (
    <div className="mt-6 shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-zinc-200 backdrop-blur">
      <p className="font-semibold">Colores del sistema</p>
      <div className="mt-2 grid grid-cols-5 items-end gap-2">
        <Swatch hex="#000000" label="Fondo" />
        <Swatch hex="var(--clr-navy, #04244D)" label="Navy" />
        <Swatch hex="var(--clr-cyan, #59E3E6)" label="Cyan" />
        <Swatch hex="var(--clr-white, #FFFFFF)" label="Texto" />
        <Swatch hex="var(--clr-pink, #EA638C)" label="Pink" />
      </div>
    </div>
  );
}

export function Swatch({ hex, label }: { hex: string; label: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto h-8 w-full rounded-md border border-white/10" style={{ background: hex }} />
      <div className="mt-1 text-[10px] text-zinc-300">{label}</div>
      <div className="text-[10px] text-zinc-500 break-all">{String(hex)}</div>
    </div>
  );
}
