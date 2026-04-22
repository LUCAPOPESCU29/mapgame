import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RippleInstance {
  id: number;
  x: number;
  y: number;
}

interface MapRippleProps {
  children: React.ReactNode;
  className?: string;
  onAreaClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function MapRipple({ children, className, onAreaClick }: MapRippleProps) {
  const [ripples, setRipples] = useState<RippleInstance[]>([]);
  const counterRef = React.useRef(0);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = ++counterRef.current;

      setRipples((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1600);

      onAreaClick?.(e);
    },
    [onAreaClick]
  );

  const rings = [
    { delay: 0,    size: 80,  opacity: 0.9, border: "2px solid rgba(201,168,76,0.9)" },
    { delay: 0.15, size: 160, opacity: 0.6, border: "1.5px solid rgba(201,168,76,0.6)" },
    { delay: 0.3,  size: 260, opacity: 0.3, border: "1px solid rgba(201,168,76,0.3)" },
  ];

  return (
    <div className={`relative ${className ?? ""}`} onMouseDown={handleClick}>
      {children}

      <AnimatePresence>
        {ripples.map((ripple) =>
          rings.map((ring, i) => (
            <motion.div
              key={`${ripple.id}-${i}`}
              className="absolute pointer-events-none rounded-full"
              style={{
                left: ripple.x,
                top: ripple.y,
                translateX: "-50%",
                translateY: "-50%",
                border: ring.border,
                boxShadow: i === 0 ? "0 0 12px 2px rgba(201,168,76,0.4)" : "none",
              }}
              initial={{ width: 0, height: 0, opacity: ring.opacity }}
              animate={{ width: ring.size, height: ring.size, opacity: 0 }}
              exit={{}}
              transition={{ duration: 0.9, delay: ring.delay, ease: "easeOut" }}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
