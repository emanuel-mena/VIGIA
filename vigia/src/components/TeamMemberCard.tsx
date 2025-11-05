import { GlassCard } from "./Utils";
import { useState } from "react";

export interface TeamMember {
  name: string;
  title: string;
  role: string;
  image: string;
  linkedin: string;
}

/** Placeholder en base64 por si falta imagen */
const PLACEHOLDER_BASE64 =
  "data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMzMzMzMzIiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMjgiIGN5PSI5NiIgcj0iNjQiLz48cGF0aCBkPSJNMjMyIDI0OGgtMjA4Yy00LjQgMC04LTIuNi04LTh2LTE2YzAtMjggNTYtNTYgMTA4LTU2czEwOCAyOCAxMDggNTZ2MTZjMCA1LjQtMy42IDgtOCA4eiIvPjwvc3ZnPg==";

export const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const [imgSrc, setImgSrc] = useState(member.image || PLACEHOLDER_BASE64);
  const handleError = () => setImgSrc(PLACEHOLDER_BASE64);

  return (
    <GlassCard
      className="
    flex h-full w-full max-w-[16rem] flex-col items-center text-center p-5
    transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10"
    >

      {/* Bloque superior fijo y centrado */}
      <div className="flex w-full flex-col items-center">
        <img
          src={imgSrc}
          onError={handleError}
          alt={member.name}
          className="h-32 w-32 rounded-full object-cover ring-2 ring-white/10 mb-4 bg-zinc-800"
        />

        {/* Nombre: reserva para hasta 2 líneas aprox */}
        <h3 className="text-lg font-semibold text-white leading-tight line-clamp-2 min-h-[2.5rem]">
          {member.name}
        </h3>

        {/* Título: 1–2 líneas */}
        <p className="text-sm text-zinc-400 leading-tight line-clamp-2 min-h-[1.75rem]">
          {member.title}
        </p>

        {/* Rol: 1–2 líneas */}
        <p className="mt-2 text-zinc-300 leading-tight line-clamp-2 min-h-[2rem]">
          {member.role}
        </p>
      </div>

      {/* Empuja el botón al fondo: todas las tarjetas igual de altas visualmente */}
      <a
        href={member.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-100 transition-colors"
      >
        <i className="bi bi-linkedin text-lg"></i>
        <span>LinkedIn</span>
      </a>
    </GlassCard>
  );
};
