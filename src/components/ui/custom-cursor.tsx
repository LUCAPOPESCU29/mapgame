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

    // Hide default cursor on container
    el.style.cursor = "none";

    function onMove(e: MouseEvent) {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    }

    function onEnter() {
      setVisible(true);
    }

    function onLeave() {
      setVisible(false);
    }

    function onDown() {
      setClicking(true);
    }

    function onUp() {
      setClicking(false);
    }

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
            x,
            y,
            position: "fixed",
            top: 0,
            left: 0,
            translateX: "-50%",
            translateY: "-50%",
            pointerEvents: "none",
            zIndex: 9999,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: clicking ? 1.5 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ scale: { type: "spring", stiffness: 400, damping: 20 } }}
        >
          {/* Main ring */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Circle */}
            <circle cx="10" cy="10" r="8" stroke="#C9A84C" strokeWidth="1" />
            {/* Center dot */}
            <circle cx="10" cy="10" r="1.5" fill="#C9A84C" />
            {/* N tick */}
            <line x1="10" y1="1" x2="10" y2="4" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" />
            {/* S tick */}
            <line x1="10" y1="16" x2="10" y2="19" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" />
            {/* E tick */}
            <line x1="16" y1="10" x2="19" y2="10" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" />
            {/* W tick */}
            <line x1="1" y1="10" x2="4" y2="10" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(cursor, document.body);
}
