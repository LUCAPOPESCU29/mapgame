import { type ReactNode, type CSSProperties } from "react";

interface ShineBorderProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  duration?: string;
  color?: string;
}

export function ShineBorder({
  children,
  className = "",
  borderWidth = 1.5,
  duration = "14s",
  color = "#C9A84C",
}: ShineBorderProps) {
  const style: CSSProperties = {
    "--shine-color": color,
    "--border-width": `${borderWidth}px`,
    "--duration": duration,
    position: "relative",
    borderRadius: "inherit",
    padding: `${borderWidth}px`,
    background: `conic-gradient(from var(--shine-angle, 0deg), transparent 0%, ${color}80 20%, transparent 40%)`,
    animation: `border-spin ${duration} linear infinite`,
  } as CSSProperties;

  return (
    <div style={style} className={`relative ${className}`}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: `conic-gradient(from var(--angle, 0deg), transparent 0%, ${color}60 20%, ${color}20 30%, transparent 50%, ${color}60 70%, transparent 100%)`,
          animation: `border-spin ${duration} linear infinite`,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: `calc(inherit - ${borderWidth}px)`,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
