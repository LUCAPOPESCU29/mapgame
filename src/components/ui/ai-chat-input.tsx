"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PLACEHOLDERS = [
  "Why did the Roman Empire fall?",
  "Who were the Viking chieftains?",
  "What caused the Black Death?",
  "How did the Renaissance begin?",
  "Tell me about the Crusades...",
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

type IconProps = {
  className?: string;
};

function FlameIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M12.45 3.7c.35 2.9-1.45 4.15-3.1 5.95-1.17 1.27-2.1 2.65-2.1 4.65 0 3.05 2.25 5.45 4.75 5.45s4.75-2.4 4.75-5.45c0-2.75-1.6-4.65-4.3-10.6Z" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.1 16.65c1.02-.35 1.75-1.15 1.75-2.25 0-1.05-.62-1.85-1.52-3.2-.28 1.25-1.28 1.9-2.03 2.78-.42.5-.65 1.02-.65 1.62 0 1.2.98 2.15 2.45 1.05Z" fill="currentColor" opacity=".45" />
    </svg>
  );
}

function LensIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="10.7" cy="10.7" r="5.35" stroke="currentColor" strokeWidth="1.7" />
      <path d="m15.05 15.05 3.9 3.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8.3 10.7h4.8M10.7 8.3v4.8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

function SendIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M4.75 12 19.25 5.75l-4.45 12.5-3.05-5.45L4.75 12Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m11.75 12.8 3.05 5.45" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
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
  const active = isActive || Boolean(inputValue);
  const canSend = Boolean(inputValue.trim()) && !disabled;

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
    if (!canSend) return;
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
      className="relative w-full cursor-text overflow-hidden"
      animate={active ? "expanded" : "collapsed"}
      initial="collapsed"
      variants={{
        collapsed: { height: 76 },
        expanded: { height: 134 },
      }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      style={{
        borderRadius: 24,
        background: "linear-gradient(180deg, rgba(32,25,15,0.94), rgba(18,14,8,0.97))",
        border: "1px solid rgba(201,168,76,0.22)",
        boxShadow: "inset 0 1px 0 rgba(245,232,196,0.075), 0 14px 38px rgba(0,0,0,0.32)",
      }}
      onClick={() => { setIsActive(true); inputRef.current?.focus(); }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(245,232,196,0.16), transparent)" }}
      />
      <AnimatePresence>
        {disabled && (
          <motion.div
            className="absolute bottom-0 left-0 h-px w-1/2 bg-gold/70"
            initial={{ x: "-120%", opacity: 0 }}
            animate={{ x: "220%", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      <div className="flex h-full w-full flex-col items-stretch">

        <div className="px-3.5 pb-2 pt-3">
          <label
            htmlFor="historicus-chat-input"
            className="mb-1.5 block font-cinzel text-[8px] uppercase tracking-[0.28em] text-gold/50"
          >
            Ask Historicus
          </label>

          <div className="flex items-center gap-2.5">
            <div className="relative min-w-0 flex-1">
            <input
              id="historicus-chat-input"
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsActive(true)}
              disabled={disabled}
              aria-label="Ask Historicus"
              className="w-full border-0 bg-transparent py-1 font-garamond text-[15px] leading-6 text-parchment-100 outline-none placeholder:text-transparent disabled:opacity-50"
              style={{ position: "relative", zIndex: 1 }}
            />
            <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center overflow-hidden">
              <AnimatePresence mode="wait">
                {showPlaceholder && !isActive && !inputValue && (
                  <motion.span
                    key={placeholderIndex}
                    className="absolute left-0 top-1/2 -translate-y-1/2 select-none font-garamond text-[15px] text-parchment-700"
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

          <motion.button
            onClick={(e) => { e.stopPropagation(); handleSend(); }}
            disabled={!canSend}
            aria-label="Send message"
            className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gold/25 bg-gold text-ink transition-all hover:bg-gold-light disabled:cursor-not-allowed disabled:border-gold/10 disabled:bg-white/[0.055] disabled:text-parchment-700"
            whileHover={canSend ? { y: -1, scale: 1.03 } : undefined}
            whileTap={canSend ? { scale: 0.94 } : undefined}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {canSend && <span className="absolute inset-0 opacity-50 beam-gradient" />}
            <SendIcon className="relative h-4 w-4" />
          </motion.button>
          </div>
        </div>

        <motion.div
          className="flex w-full items-center justify-between gap-2 px-3.5 pb-3"
          variants={{
            hidden: { opacity: 0, y: 16, pointerEvents: "none" as const },
            visible: { opacity: 1, y: 0, pointerEvents: "auto" as const, transition: { duration: 0.25, delay: 0.06 } },
          }}
          initial="hidden"
          animate={active ? "visible" : "hidden"}
        >
          <div className="flex min-w-0 gap-2">
            <motion.button
              type="button"
              onClick={(e) => { e.stopPropagation(); onThinkToggle(); }}
              aria-pressed={thinkActive}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-cinzel text-[10px] uppercase tracking-[0.12em] transition-all active:scale-[0.98] ${
                thinkActive
                  ? "border-gold/40 bg-gold/15 text-gold"
                  : "border-white/10 bg-white/[0.04] text-parchment-600 hover:border-gold/30 hover:text-parchment-400"
              }`}
              whileTap={{ scale: 0.96 }}
            >
              <FlameIcon className="h-3 w-3 flex-shrink-0" />
              Think
            </motion.button>

            <motion.button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDeepSearchToggle(); }}
              aria-pressed={deepSearchActive}
              className={`inline-flex items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full border px-3 py-1.5 font-cinzel text-[10px] uppercase tracking-[0.12em] transition-all active:scale-[0.98] ${
                deepSearchActive
                  ? "border-gold/30 bg-gold/10 text-gold"
                  : "border-white/10 bg-white/[0.04] text-parchment-600 hover:border-gold/30 hover:text-parchment-400"
              }`}
              initial={false}
              animate={{ width: deepSearchActive ? 124 : 42 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              whileTap={{ scale: 0.96 }}
            >
              <LensIcon className="h-3 w-3 flex-shrink-0" />
              <motion.span
                initial={false}
                animate={{ opacity: deepSearchActive ? 1 : 0 }}
                transition={{ duration: 0.15 }}
              >
                Deep Search
              </motion.span>
            </motion.button>
          </div>

          <div className="hidden items-center gap-1.5 opacity-55 min-[390px]:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-gold/60" />
            <span className="font-cinzel text-[8px] uppercase tracking-[0.18em] text-parchment-600">Groq</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export { AIChatInput };
