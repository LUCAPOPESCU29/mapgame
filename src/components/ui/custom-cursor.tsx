import { useEffect, useState, type RefObject } from "react";
import { useMotionValue, useSpring, motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";

interface CustomCursorProps {
  containerRef: RefObject<HTMLElement | null>;
}

export function CustomCursor({ containerRef }: CustomCursorProps) {
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { stiffness: 400, damping: 28 });
  const y = useSpring(rawY, { stiffness: 400, damping: 28 });
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.style.cursor = "none";

    const onMove = (e: MouseEvent) => { rawX.set(e.clientX); rawY.set(e.clientY); };
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseup", onUp);

    return () => {
      el.style.cursor = "";
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mouseup", onUp);
    };
  }, [containerRef, rawX, rawY]);

  const cursor = (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={{
            x, y,
            position: "fixed",
            top: 0, left: 0,
            translateX: "-50%",
            translateY: "-50%",
            pointerEvents: "none",
            zIndex: 9999,
            filter: "drop-shadow(0 0 6px rgba(201,168,76,0.8))",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: clicking ? 0.75 : 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ scale: { type: "spring", stiffness: 400, damping: 20 } }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            {/* Outer ring */}
            <circle cx="20" cy="20" r="16" stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.8"/>
            {/* Inner ring */}
            <circle cx="20" cy="20" r="4" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.6"/>
            {/* Center dot */}
            <circle cx="20" cy="20" r="1.5" fill="#C9A84C"/>
            {/* N tick — long */}
            <line x1="20" y1="2" x2="20" y2="8" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
            {/* S tick */}
            <line x1="20" y1="32" x2="20" y2="38" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
            {/* E tick */}
            <line x1="32" y1="20" x2="38" y2="20" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
            {/* W tick */}
            <line x1="2" y1="20" x2="8" y2="20" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Diagonal tick marks (smaller) */}
            <line x1="31" y1="9" x2="28.5" y2="11.5" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round"/>
            <line x1="9" y1="9" x2="11.5" y2="11.5" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round"/>
            <line x1="31" y1="31" x2="28.5" y2="28.5" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round"/>
            <line x1="9" y1="31" x2="11.5" y2="28.5" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round"/>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(cursor, document.body);
}
