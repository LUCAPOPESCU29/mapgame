import { useMemo } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  left: string;
  top: string;
  size: number;
  color: string;
  glowColor: string;
  glowSize: number;
  delay: number;
  duration: number;
}

export function GlowingStars({ count = 70 }: { count?: number }) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const isGold = i % 5 === 0;
      const isBright = i % 8 === 0;
      const size = isBright ? 3 + Math.random() * 2 : 1.5 + Math.random() * 2;
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size,
        color: isGold ? "#C9A84C" : isBright ? "#e2c97e" : "#f5e8c4",
        glowColor: isGold ? "rgba(201,168,76,0.9)" : "rgba(245,232,196,0.5)",
        glowSize: isBright ? size * 6 : size * 3,
        delay: Math.random() * 5,
        duration: 1.5 + Math.random() * 3.5,
      };
    });
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            background: star.color,
            boxShadow: `0 0 ${star.glowSize}px ${star.glowSize / 2}px ${star.glowColor}`,
          }}
          animate={{
            opacity: [0, 1, 0.3, 1, 0],
            scale: [0.5, 1.4, 0.8, 1.2, 0.5],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
