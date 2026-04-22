import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WordRotateProps {
  words: string[];
  className?: string;
  interval?: number;
}

export function WordRotate({ words, className, interval = 2000 }: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className="inline-block overflow-hidden align-bottom" style={{ verticalAlign: "bottom" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className={`inline-block ${className ?? ""}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
