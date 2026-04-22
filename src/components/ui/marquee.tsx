import React from "react";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
}

export function Marquee({
  children,
  className,
  speed = 40,
  pauseOnHover = true,
  direction = "left",
}: MarqueeProps) {
  // Estimate duration from speed. We use a fixed content width proxy of 2000px.
  const duration = Math.round(2000 / speed);

  const trackStyle: React.CSSProperties = {
    display: "flex",
    width: "max-content",
    animationName: "marquee-scroll",
    animationDuration: `${duration}s`,
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationDirection: direction === "right" ? "reverse" : "normal",
  };

  return (
    <div
      className={`overflow-hidden ${className ?? ""}`}
      style={{ whiteSpace: "nowrap" }}
    >
      <div
        className={pauseOnHover ? "marquee-track" : undefined}
        style={pauseOnHover ? undefined : trackStyle}
      >
        <span style={{ display: "inline-block" }}>{children}</span>
        <span style={{ display: "inline-block" }}>{children}</span>
      </div>
    </div>
  );
}
