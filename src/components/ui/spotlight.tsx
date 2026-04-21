import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface SpotlightProps {
  className?: string;
  size?: number;
  color?: string;
}

export function Spotlight({
  className = "",
  size = 400,
  color = "rgba(201,168,76,0.06)",
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    function handleMouseMove(e: globalThis.MouseEvent) {
      const rect = parent!.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - size / 2);
      mouseY.set(e.clientY - rect.top - size / 2);
    }

    parent.addEventListener("mousemove", handleMouseMove);
    return () => parent.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, size]);

  return (
    <div ref={containerRef} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
          x: springX,
          y: springY,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
