// components/IframeCard.tsx
import {useEffect, useRef, useState } from "react";
import { FiMaximize2, FiExternalLink, FiRefreshCw } from "react-icons/fi";

type Props = {
  title: string;
  src: string; // ej: "/mapa_licitaciones_CR_filtrado.html"
  className?: string;
};

export function IframeCard({ title, src, className }: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [key, setKey] = useState(0); // para “recargar”

  return (
    <div className={`rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm ${className ?? ""}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100/80 dark:border-zinc-800">
        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="Recargar"
            onClick={() => setKey(k => k + 1)}
          >
            <FiRefreshCw />
          </button>
          <a
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            href={src}
            target="_blank"
            rel="noreferrer"
            title="Abrir en pestaña nueva"
          >
            <FiExternalLink />
          </a>
          <button
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="Pantalla completa"
            onClick={() => iframeRef.current?.requestFullscreen?.()}
          >
            <FiMaximize2 />
          </button>
        </div>
      </div>

      {/* Contenedor responsivo con relación 16:9 (ajustable) */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          key={key}
          ref={iframeRef}
          title={title}
          src={src}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer"
          fetchPriority="low"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}


export function AutoHeightIframeCard({ title, src }: { title: string; src: string }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState(600); // altura inicial

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e?.data?.type === "IFRAME_HEIGHT" && typeof e.data.height === "number") {
        // límite para no romper el layout
        const max = Math.min(e.data.height, 2000);
        setHeight(max);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100/80 dark:border-zinc-800">
        <div className="font-semibold">{title}</div>
        <a className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" href={src} target="_blank" rel="noreferrer">
          <FiExternalLink />
        </a>
      </div>
      <iframe
        ref={iframeRef}
        title={title}
        src={src}
        style={{ width: "100%", height }}
        className="block"
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}

