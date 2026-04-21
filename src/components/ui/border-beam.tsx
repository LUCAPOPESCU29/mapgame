interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

export function BorderBeam({
  size = 200,
  duration = 8,
  delay = 0,
  colorFrom = "#C9A84C",
  colorTo = "transparent",
  className = "",
}: BorderBeamProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 rounded-[inherit] ${className}`}
      style={{ overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          border: "1px solid transparent",
          background: `linear-gradient(#0d0a06, #0d0a06) padding-box,
                       conic-gradient(from calc(var(--beam-angle, 0deg)), transparent 0%, ${colorFrom} 10%, ${colorTo} 20%, transparent 25%) border-box`,
          animationName: "border-spin",
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          mask: "none",
        }}
      />
      {/* Traveling glow dot */}
      <div
        style={{
          position: "absolute",
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(circle at center, ${colorFrom}30, transparent 70%)`,
          top: "-50%",
          left: "-50%",
          animationName: "border-beam-travel",
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
