"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react";
import { Lightbulb, Globe, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const PLACEHOLDERS = [
  "Why did the Roman Empire fall?",
  "Who were the Viking chieftains?",
  "What caused the Black Death?",
  "How did the Renaissance begin?",
  "Tell me about the Crusades…",
  "What was daily life in medieval Europe?",
  "How did Carthage challenge Rome?",
  "Who were the Byzantine emperors?",
];

interface AIChatInputProps {
  onSend: (message: string, think: boolean, deepSearch: boolean) => void;
  disabled?: boolean;
  thinkActive: boolean;
  deepSearchActive: boolean;
  onThinkToggle: () => void;
  onDeepSearchToggle: () => void;
}

const AIChatInput = ({
  onSend,
  disabled = false,
  thinkActive,
  deepSearchActive,
  onThinkToggle,
  onDeepSearchToggle,
}: AIChatInputProps) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive || inputValue) return;
    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setShowPlaceholder(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [isActive, inputValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        if (!inputValue) setIsActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue]);

  const handleSend = () => {
    if (!inputValue.trim() || disabled) return;
    onSend(inputValue.trim(), thinkActive, deepSearchActive);
    setInputValue("");
    setIsActive(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const placeholderLetterVariants = {
    initial: { opacity: 0, filter: "blur(12px)", y: 10 },
    animate: {
      opacity: 1, filter: "blur(0px)", y: 0,
      transition: { opacity: { duration: 0.25 }, filter: { duration: 0.4 }, y: { type: "spring" as const, stiffness: 80, damping: 20 } },
    },
    exit: {
      opacity: 0, filter: "blur(12px)", y: -10,
      transition: { opacity: { duration: 0.2 }, filter: { duration: 0.3 }, y: { type: "spring" as const, stiffness: 80, damping: 20 } },
    },
  };

  return (
    <motion.div
      ref={wrapperRef}
      className="w-full"
      animate={isActive || inputValue ? "expanded" : "collapsed"}
      initial="collapsed"
      variants={{
        collapsed: { height: 60 },
        expanded: { height: 116 },
      }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      style={{ overflow: "hidden", borderRadius: 20, background: "rgba(26,20,12,0.95)", border: "1px solid rgba(201,168,76,0.2)" }}
      onClick={() => { setIsActive(true); inputRef.current?.focus(); }}
    >
      <div className="flex flex-col items-stretch w-full h-full">

        {/* Input row */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsActive(true)}
              disabled={disabled}
              className="w-full border-0 outline-none bg-transparent text-parchment-100 font-garamond text-sm py-1 placeholder:text-transparent disabled:opacity-50"
              style={{ position: "relative", zIndex: 1 }}
            />
            {/* Animated placeholder */}
            <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center">
              <AnimatePresence mode="wait">
                {showPlaceholder && !isActive && !inputValue && (
                  <motion.span
                    key={placeholderIndex}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-parchment-700 font-garamond text-sm select-none"
                    style={{ whiteSpace: "nowrap", overflow: "hidden" }}
                    variants={{ initial: {}, animate: { transition: { staggerChildren: 0.025 } }, exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } } }}
                    initial="initial" animate="animate" exit="exit"
                  >
                    {PLACEHOLDERS[placeholderIndex].split("").map((char, i) => (
                      <motion.span key={i} variants={placeholderLetterVariants} style={{ display: "inline-block" }}>
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); handleSend(); }}
            disabled={!inputValue.trim() || disabled}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gold hover:bg-gold-light transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={14} className="text-ink" />
          </button>
        </div>

        {/* Expanded controls */}
        <motion.div
          className="w-full flex justify-between items-center px-3 pb-2"
          variants={{
            hidden: { opacity: 0, y: 16, pointerEvents: "none" as const },
            visible: { opacity: 1, y: 0, pointerEvents: "auto" as const, transition: { duration: 0.25, delay: 0.06 } },
          }}
          initial="hidden"
          animate={isActive || inputValue ? "visible" : "hidden"}
        >
          <div className="flex gap-2">
            {/* Think toggle */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onThinkToggle(); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-cinzel transition-all ${
                thinkActive
                  ? "bg-amber-500/15 border border-amber-400/40 text-amber-300"
                  : "bg-white/5 border border-white/10 text-parchment-600 hover:border-gold/30 hover:text-parchment-400"
              }`}
            >
              <Lightbulb size={12} className={thinkActive ? "fill-amber-400 text-amber-400" : ""} />
              Think
            </button>

            {/* Deep Search toggle */}
            <motion.button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDeepSearchToggle(); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-cinzel transition-all overflow-hidden whitespace-nowrap ${
                deepSearchActive
                  ? "bg-blue-500/15 border border-blue-400/40 text-blue-300"
                  : "bg-white/5 border border-white/10 text-parchment-600 hover:border-gold/30 hover:text-parchment-400"
              }`}
              initial={false}
              animate={{ width: deepSearchActive ? 110 : 36 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
            >
              <Globe size={12} className="flex-shrink-0" />
              <motion.span
                initial={false}
                animate={{ opacity: deepSearchActive ? 1 : 0 }}
                transition={{ duration: 0.15 }}
              >
                Deep Search
              </motion.span>
            </motion.button>
          </div>

          {/* Powered by Groq */}
          <div className="flex items-center gap-1 opacity-50">
            <span className="font-cinzel text-[9px] text-parchment-600 tracking-wider">Powered by</span>
            <span className="font-cinzel text-[9px] font-bold text-parchment-500">GROQ</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export { AIChatInput };
