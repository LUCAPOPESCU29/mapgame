import { useMemo } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  left: string;
  top: string;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

export function GlowingStars() {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 2,
      color: i % 7 === 0 ? "#C9A84C" : i % 5 === 0 ? "#e2c97e" : "#f5e8c4",
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 4,
    }));
  }, []);

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
            boxShadow:
              star.color === "#C9A84C"
                ? `0 0 ${star.size * 3}px ${star.size}px rgba(201,168,76,0.6)`
                : `0 0 ${star.size * 2}px ${star.size * 0.5}px rgba(245,232,196,0.3)`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
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
