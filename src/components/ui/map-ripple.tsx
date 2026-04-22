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

      // Clean up after animation ends (3 rings × 0.15s stagger + 0.8s duration + buffer)
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1400);

      onAreaClick?.(e);
    },
    [onAreaClick]
  );

  return (
    <div className={`relative ${className ?? ""}`} onMouseDown={handleClick}>
      {children}

      <AnimatePresence>
        {ripples.map((ripple) =>
          [0, 1, 2].map((ring) => (
            <motion.div
              key={`${ripple.id}-${ring}`}
              className="absolute pointer-events-none rounded-full border border-gold/60"
              style={{
                left: ripple.x,
                top: ripple.y,
                translateX: "-50%",
                translateY: "-50%",
              }}
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ width: 160, height: 160, opacity: 0 }}
              exit={{}}
              transition={{
                duration: 0.8,
                delay: ring * 0.15,
                ease: "easeOut",
              }}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
