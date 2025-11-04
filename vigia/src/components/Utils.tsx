import React, { useEffect, useState } from "react";

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
