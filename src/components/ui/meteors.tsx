import { motion } from "framer-motion";
import { useMemo } from "react";

interface MeteorConfig {
  id: number;
  top: string;
  left: string;
  delay: number;
  duration: number;
  size: number;
}

export function Meteors({ count = 15 }: { count?: number }) {
  const meteors = useMemo<MeteorConfig[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: `${Math.random() * 60}%`,
      left: `${Math.random() * 80}%`,
      delay: Math.random() * 8,
      duration: 2.5 + Math.random() * 3,
      size: 60 + Math.random() * 120,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((m) => (
        <motion.div
          key={m.id}
          className="absolute"
          style={{ top: m.top, left: m.left }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], x: m.size * 1.5, y: m.size * 1.5 }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            repeatDelay: 4 + Math.random() * 6,
            ease: "easeIn",
          }}
        >
          {/* Meteor line */}
          <div
            style={{
              width: `${m.size}px`,
              height: "1px",
              background: "linear-gradient(90deg, rgba(201,168,76,0.9), rgba(201,168,76,0.3), transparent)",
              transform: "rotate(45deg)",
              transformOrigin: "left center",
              boxShadow: "0 0 4px rgba(201,168,76,0.4)",
            }}
          />
          {/* Meteor head */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "-2px",
              width: "3px",
              height: "3px",
              borderRadius: "50%",
              background: "#e2c97e",
              boxShadow: "0 0 6px 2px rgba(201,168,76,0.7)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
