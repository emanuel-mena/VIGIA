// src/components/AuroraBackground.tsx
export default function AuroraBackground() {
  return (
    <div className="aurora">
      {/* Blob 1: cyan → pink */}
      <span
        className="aurora__layer"
        style={{
          top: "-10%",
          left: "-10%",
          background:
            "radial-gradient(45% 45% at 50% 50%, rgba(89,227,230,0.2), transparent 60%), radial-gradient(60% 60% at 60% 40%, rgba(234,99,140,0.35), transparent 70%)",
          animationDelay: "0s",
        }}
      />
      {/* Blob 2: pink → crimson */}
      <span
        className="aurora__layer"
        style={{
          bottom: "-20%",
          right: "-15%",
          background:
            "radial-gradient(45% 45% at 40% 60%, rgba(234,99,140,0.55), transparent 60%), radial-gradient(60% 60% at 70% 50%, rgba(182,36,79,0.45), transparent 70%)",
          animationDelay: "3s",
        }}
      />
      {/* Blob 3: navy → cyan */}
      <span
        className="aurora__layer"
        style={{
          top: "10%",
          right: "5%",
          background:
            "radial-gradient(45% 45% at 50% 50%, rgba(4,36,77,0.45), transparent 60%), radial-gradient(60% 60% at 30% 50%, rgba(89,227,230,0.5), transparent 70%)",
          animationDelay: "6s",
        }}
      />

      {/* Velo suave */}
      <span className="aurora__veil" />
    </div>
  );
}
