import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useEffect } from "react";

interface TracingBeamProps {
  active: boolean;
  progress: number;
  className?: string;
}

export function TracingBeam({ active, progress, className }: TracingBeamProps) {
  const BEAM_HEIGHT = 400; // px — typical panel content height

  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, { stiffness: 80, damping: 20 });

  const lineHeight = useTransform(smoothProgress, (v) => `${v * BEAM_HEIGHT}px`);
  const dotY = useTransform(smoothProgress, (v) => v * BEAM_HEIGHT);

  useEffect(() => {
    rawProgress.set(active ? progress : progress);
  }, [progress, active, rawProgress]);

  return (
    <div
      className={`relative flex-shrink-0 ${className ?? ""}`}
      style={{ width: 20, minHeight: BEAM_HEIGHT }}
      aria-hidden
    >
      {/* Track line */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-px"
        style={{ height: BEAM_HEIGHT, background: "rgba(201,168,76,0.08)" }}
      />

      {/* Growing filled beam */}
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-px origin-top"
        style={{
          height: lineHeight,
          background: "linear-gradient(to bottom, rgba(201,168,76,0.0) 0%, rgba(201,168,76,0.6) 100%)",
        }}
      />

      {/* Glowing head dot */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
        style={{
          y: dotY,
          translateX: "-50%",
          background: "radial-gradient(circle, #fff8e0 0%, #C9A84C 60%, transparent 100%)",
          boxShadow: "0 0 8px 3px rgba(201,168,76,0.6)",
          opacity: active ? 1 : 0.4,
        }}
        animate={active ? { boxShadow: ["0 0 8px 3px rgba(201,168,76,0.6)", "0 0 14px 6px rgba(201,168,76,0.9)", "0 0 8px 3px rgba(201,168,76,0.6)"] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
