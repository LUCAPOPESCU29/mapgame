import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface AnimatedBeamCardProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedBeamCard({ children, className = "" }: AnimatedBeamCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-4deg", "4deg"]);

  const beamX = useTransform(springX, [-0.5, 0.5], ["-30%", "130%"]);
  const beamY = useTransform(springY, [-0.5, 0.5], ["-30%", "130%"]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-xl border border-gold/25 bg-ink-light overflow-hidden ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Ambient glow border */}
      <div className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, transparent 50%, rgba(201,168,76,0.04) 100%)",
        }}
      />

      {/* Moving beam highlight */}
      <motion.div
        className="pointer-events-none absolute rounded-full blur-xl opacity-20"
        style={{
          width: "40%",
          height: "40%",
          background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)",
          left: beamX,
          top: beamY,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Top edge shimmer */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Animated beam sweep */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        <motion.div
          className="absolute top-0 h-full w-[60%] opacity-10"
          style={{
            background: "linear-gradient(105deg, transparent 0%, rgba(201,168,76,0.6) 50%, transparent 100%)",
          }}
          animate={{ left: ["-60%", "160%"] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
        />
      </div>

      {/* Parchment noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
