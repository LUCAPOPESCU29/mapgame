import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";

interface NumberTickerProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function NumberTicker({ value, className, prefix = "", suffix = "" }: NumberTickerProps) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => `${prefix}${Math.round(v)}${suffix}`);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      motionVal.set(value);
    }
  }, [motionVal, value]);

  return <motion.span className={className}>{display}</motion.span>;
}
