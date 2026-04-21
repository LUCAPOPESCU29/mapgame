import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  X, Clock, MapPin, ChevronLeft, MessageSquare,
  ChevronDown, ChevronUp, Scroll, ArrowRight, Pencil,
  Telescope, ChevronRight,
} from "lucide-react";
import { TypewriterText } from "./TypewriterText";
import { TimelineBar } from "./TimelineBar";
import { BentoGrid } from "./BentoGrid";
import { SkeletonLoader } from "./SkeletonLoader";
import { AnimatedBeamCard } from "./AnimatedBeamCard";
import { BorderBeam } from "./ui/border-beam";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ERA_SUGGESTIONS } from "../types";
import { getRegionsForCountry, getFlagForCountry } from "../data/countryRegions";
import type { StreamState } from "../hooks/useConversation";

type Phase = "era" | "region" | "result";

interface SidePanelProps {
  country: string;
  streamState: StreamState;
  onClose: () => void;
  onAsk: (country: string, region: string, era: string) => void;
  onFollowUp: (q: string) => void;
  hasHistory: boolean;
}

const panelVariants: Variants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 280, damping: 30 } },
  exit:   { x: "-100%", opacity: 0, transition: { duration: 0.22, ease: "easeIn" as const } },
};

const stepVariants: Variants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.22 } },
  exit:   (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0, transition: { duration: 0.18 } }),
};

const FOLLOW_UPS = [
  "What happened 50 years later?",
  "Who were the ordinary people?",
  "What were the main threats?",
  "How did this era end?",
  "What was the role of religion?",
  "Tell me about trade and economy.",
];

// Decorative SVG ornament
function PanelOrnament() {
  return (
    <svg
      width="48"
      height="24"
      viewBox="0 0 48 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-1 opacity-30"
    >
      <path d="M24 2 L28 8 L36 8 L30 13 L32 21 L24 16 L16 21 L18 13 L12 8 L20 8 Z" stroke="#C9A84C" strokeWidth="1" fill="none" />
      <line x1="0" y1="12" x2="10" y2="12" stroke="#C9A84C" strokeWidth="0.75" />
      <line x1="38" y1="12" x2="48" y2="12" stroke="#C9A84C" strokeWidth="0.75" />
      <circle cx="5" cy="12" r="1.5" fill="#C9A84C" />
      <circle cx="43" cy="12" r="1.5" fill="#C9A84C" />
    </svg>
  );
}

export function SidePanel({ country, streamState, onClose, onAsk, onFollowUp }: SidePanelProps) {
  const [phase, setPhase] = useState<Phase>("era");
  const [dir, setDir] = useState(1);

  const [selectedEra, setSelectedEra] = useState("");
  const [eraInput, setEraInput] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [customRegion, setCustomRegion] = useState("");
  const [showCustomRegion, setShowCustomRegion] = useState(false);

  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpInput, setFollowUpInput] = useState("");
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [deepTopic, setDeepTopic] = useState("");

  const flag = getFlagForCountry(country);
  const regions = getRegionsForCountry(country);
  const { isStreaming, summary, facts, error } = streamState;

  // Auto-advance to result when streaming starts
  useEffect(() => {
    if (isStreaming && phase !== "result") {
      advance("result");
    }
  }, [isStreaming]);

  function advance(next: Phase) {
    setDir(1);
    setPhase(next);
  }

  function back(prev: Phase) {
    setDir(-1);
    setPhase(prev);
  }

  function handleEraSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const era = eraInput.trim() || selectedEra;
    if (!era) return;
    setSelectedEra(era);
    advance("region");
  }

  function handleChipEra(label: string) {
    setSelectedEra(label === selectedEra ? "" : label);
    setEraInput(label === selectedEra ? "" : label);
  }

  function handleRegionSubmit(region: string) {
    const r = region || customRegion.trim();
    if (!r) return;
    setSelectedRegion(r);
    onAsk(country, r, selectedEra);
  }

  function handleFollowUpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!followUpInput.trim() || isStreaming) return;
    onFollowUp(followUpInput.trim());
    setFollowUpInput("");
    setShowFollowUp(false);
  }

  // Breadcrumb bar
  function Breadcrumbs() {
    return (
      <div className="flex items-center gap-1.5 text-[10px] font-cinzel text-parchment-700 flex-wrap">
        <span className="text-gold font-semibold">{flag} {country}</span>
        {(phase === "region" || phase === "result") && selectedEra && (
          <>
            <ArrowRight className="w-2.5 h-2.5 text-gold/40" />
            <button
              onClick={() => back("era")}
              className="hover:text-gold transition-colors underline underline-offset-2"
            >
              {selectedEra}
            </button>
          </>
        )}
        {phase === "result" && selectedRegion && (
          <>
            <ArrowRight className="w-2.5 h-2.5 text-gold/40" />
            <button
              onClick={() => back("region")}
              className="hover:text-gold transition-colors underline underline-offset-2"
            >
              {selectedRegion}
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <motion.aside
      className="fixed inset-y-0 left-0 z-40 w-full sm:w-[430px] lg:w-[460px] flex flex-col"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Glass bg — richer gradient + stronger blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0e0b07]/98 via-[#100d08]/96 to-[#0a0805]/98 backdrop-blur-2xl border-r border-gold/12 shadow-[6px_0_50px_rgba(0,0,0,0.85)]" />
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      {/* Right edge BorderBeam */}
      <div className="absolute right-0 inset-y-0 w-px overflow-hidden">
        <BorderBeam
          size={300}
          duration={10}
          colorFrom="#C9A84C"
          colorTo="transparent"
        />
      </div>

      <div className="relative z-10 flex flex-col h-full overflow-hidden">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-white/[0.04]">
          {/* Decorative ornament */}
          <PanelOrnament />

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl leading-none">{flag}</span>
              <div>
                <h2 className="font-cinzel text-base font-bold text-gold leading-tight">{country}</h2>
                <p className="font-garamond text-[11px] text-parchment-600 italic mt-0.5">
                  {phase === "era" && "Step 1 — Choose an era"}
                  {phase === "region" && "Step 2 — Choose a region"}
                  {phase === "result" && (isStreaming ? "Consulting the chronicles…" : "Historical chronicle")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-parchment-600 hover:text-gold hover:bg-gold/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <Breadcrumbs />

          {/* Step indicators — animated rings */}
          <div className="flex items-center gap-1.5 mt-3">
            {(["era", "region", "result"] as Phase[]).map((p, i) => {
              const isActive = phase === p;
              const isDone = (["era", "region", "result"].indexOf(phase) > i);
              return (
                <div key={p} className="flex items-center gap-1.5">
                  <div className="relative">
                    {/* Glow ring when active */}
                    {isActive && (
                      <motion.div
                        className="absolute -inset-1 rounded-full"
                        style={{ boxShadow: "0 0 12px rgba(201,168,76,0.5), 0 0 24px rgba(201,168,76,0.2)" }}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-cinzel font-bold transition-all duration-300 ${
                      isActive ? "bg-gold text-ink shadow-[0_0_8px_rgba(201,168,76,0.6)]" :
                      isDone ? "bg-gold/30 text-gold border border-gold/30" :
                      "bg-ink-muted text-parchment-600 border border-white/10"
                    }`}>
                      {i + 1}
                    </div>
                  </div>
                  {i < 2 && <div className={`h-px w-8 transition-all duration-500 ${
                    isDone ? "bg-gold/40" : "bg-white/10"
                  }`} />}
                </div>
              );
            })}
            <span className="ml-1 font-garamond text-[10px] text-parchment-700 italic">
              {phase === "era" ? "Era" : phase === "region" ? "Region" : "Result"}
            </span>
          </div>
        </div>

        {/* ── Step content ───────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait" custom={dir}>

            {/* STEP 1 — Era */}
            {phase === "era" && (
              <motion.div
                key="era"
                custom={dir}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-5 space-y-5"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-gold/70 flex-shrink-0" />
                    <p className="font-cinzel text-sm font-semibold text-gold/90">
                      What era are you curious about?
                    </p>
                  </div>
                  <form onSubmit={handleEraSubmit}>
                    <Input
                      value={eraInput}
                      onChange={(e) => { setEraInput(e.target.value); setSelectedEra(""); }}
                      placeholder="e.g. 'Roman Empire', '1200 AD', 'Crusades'…"
                      autoFocus
                      className="mb-3"
                    />
                  </form>
                  <p className="font-garamond text-xs text-parchment-600 italic mb-2">Or choose an epoch:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ERA_SUGGESTIONS.map(({ label, years }) => {
                      const isSelected = selectedEra === label;
                      return (
                        <Badge
                          key={label}
                          variant={isSelected ? "selected" : "default"}
                          onClick={() => handleChipEra(label)}
                          title={years}
                          className="cursor-pointer text-xs transition-all"
                          style={isSelected ? {
                            boxShadow: "0 0 12px rgba(201,168,76,0.4), 0 0 4px rgba(201,168,76,0.3)",
                          } : undefined}
                        >
                          {label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={() => handleEraSubmit()}
                  className="w-full"
                  disabled={!eraInput.trim() && !selectedEra}
                >
                  Next — Pick a Region
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* STEP 2 — Region */}
            {phase === "region" && (
              <motion.div
                key="region"
                custom={dir}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-5 space-y-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-gold/70 flex-shrink-0" />
                  <p className="font-cinzel text-sm font-semibold text-gold/90">
                    Which region of {country}?
                  </p>
                </div>
                <p className="font-garamond text-xs text-parchment-600 italic -mt-2">
                  During: <span className="text-gold">{selectedEra}</span>
                </p>

                {/* Region grid */}
                {regions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1.5">
                    {regions.map((r, i) => (
                      <motion.button
                        key={r}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => handleRegionSubmit(r)}
                        className="relative overflow-hidden text-left px-3.5 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] hover:border-gold/40 hover:bg-gold/8 transition-all group"
                      >
                        {/* Shimmer on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity beam-gradient pointer-events-none" />
                        <span className="relative font-garamond text-sm text-parchment-200 group-hover:text-gold transition-colors">
                          {r}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <p className="font-garamond text-sm text-parchment-600 italic">
                    No preset regions — type one below.
                  </p>
                )}

                {/* Custom region */}
                <div className="pt-1 border-t border-white/[0.04]">
                  <button
                    onClick={() => setShowCustomRegion(!showCustomRegion)}
                    className="flex items-center gap-1.5 text-xs font-garamond text-parchment-600 hover:text-gold transition-colors mb-2"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Type a custom region
                    {showCustomRegion ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                  <AnimatePresence>
                    {showCustomRegion && (
                      <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={(e) => { e.preventDefault(); handleRegionSubmit(customRegion); }}
                        className="flex gap-2"
                      >
                        <Input
                          value={customRegion}
                          onChange={(e) => setCustomRegion(e.target.value)}
                          placeholder="e.g. Normandy, Cappadocia…"
                          autoFocus
                          className="flex-1 text-sm"
                        />
                        <Button type="submit" size="sm" disabled={!customRegion.trim()}>Go</Button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => back("era")}
                  className="flex items-center gap-1.5 text-xs font-cinzel text-parchment-600 hover:text-gold transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back to era
                </button>
              </motion.div>
            )}

            {/* STEP 3 — Result */}
            {phase === "result" && (
              <motion.div
                key="result"
                custom={dir}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-5 space-y-4"
              >
                {/* Tag row */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gold/30 bg-gold/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                    <span className="font-cinzel text-xs text-gold">{selectedEra}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-parchment-700/40 bg-white/[0.03]">
                    <MapPin className="w-3 h-3 text-parchment-500" />
                    <span className="font-garamond text-xs text-parchment-400">{selectedRegion}</span>
                  </div>
                </div>

                {/* Timeline */}
                {!isStreaming && summary && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <TimelineBar era={selectedEra} />
                  </motion.div>
                )}

                {/* Prose card */}
                <AnimatedBeamCard className="p-5">
                  <AnimatePresence mode="wait">
                    {isStreaming && !summary ? (
                      <SkeletonLoader key="skel" />
                    ) : error ? (
                      <motion.div key="err" className="py-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <p className="font-garamond text-red-400 mb-2">The chronicles speak not of this…</p>
                        <p className="font-garamond text-xs text-parchment-600">{error}</p>
                      </motion.div>
                    ) : (
                      <motion.div key="content">
                        <TypewriterText text={summary} isStreaming={isStreaming} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </AnimatedBeamCard>

                {/* ── Dive Deeper button ───────────────────── */}
                <AnimatePresence>
                  {summary && !isStreaming && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <button
                        onClick={() => setShowDeepDive((v) => !v)}
                        className={`relative overflow-hidden w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-200 group ${
                          showDeepDive
                            ? "border-gold/50 bg-gold/12"
                            : "border-gold/25 bg-gold/6 hover:border-gold/45 hover:bg-gold/12"
                        }`}
                        style={!isStreaming && summary ? {
                          animation: "glow-pulse 3s ease-in-out infinite",
                        } : undefined}
                      >
                        {/* Shine sweep */}
                        <div className="absolute inset-0 beam-gradient pointer-events-none opacity-60" />
                        <div className="relative flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/30 transition-colors">
                            <Telescope className="w-3.5 h-3.5 text-gold" />
                          </div>
                          <div className="text-left">
                            <p className="font-cinzel text-xs font-semibold text-gold leading-tight">
                              Dive Deeper
                            </p>
                            <p className="font-garamond text-[10px] text-parchment-500 leading-tight mt-0.5">
                              Ask AI to elaborate on a specific topic
                            </p>
                          </div>
                        </div>
                        <ChevronRight
                          className={`relative w-4 h-4 text-gold/50 flex-shrink-0 transition-transform duration-200 ${showDeepDive ? "rotate-90" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {showDeepDive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-2 pb-1 space-y-2 px-1">
                              {/* Quick topic chips */}
                              <div className="flex flex-wrap gap-1.5">
                                {[
                                  "Key rulers & leaders",
                                  "Daily life & society",
                                  "Religion & beliefs",
                                  "Wars & battles",
                                  "Economy & trade",
                                  "Art & architecture",
                                  "Women's roles",
                                  "Science & medicine",
                                  "Food & agriculture",
                                  "Law & governance",
                                ].map((topic) => (
                                  <button
                                    key={topic}
                                    onClick={() => {
                                      onFollowUp(
                                        `Go deeper on "${topic}" — give me a detailed, richly specific explanation covering lesser-known facts, key figures, and vivid historical detail about this aspect of ${selectedRegion} during the ${selectedEra}.`
                                      );
                                      setShowDeepDive(false);
                                    }}
                                    disabled={isStreaming}
                                    className="relative overflow-hidden px-2.5 py-1 rounded-full border border-gold/20 bg-gold/5 text-parchment-400 font-garamond text-xs hover:border-gold/50 hover:text-gold hover:bg-gold/15 transition-all disabled:opacity-40 group"
                                  >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity beam-gradient pointer-events-none" />
                                    <span className="relative">{topic}</span>
                                  </button>
                                ))}
                              </div>

                              {/* Custom topic input */}
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!deepTopic.trim()) return;
                                  onFollowUp(
                                    `Go deeper on "${deepTopic.trim()}" — give me a detailed, richly specific explanation covering lesser-known facts, key figures, and vivid historical detail about this aspect of ${selectedRegion} during the ${selectedEra}.`
                                  );
                                  setDeepTopic("");
                                  setShowDeepDive(false);
                                }}
                                className="flex gap-2 pt-1"
                              >
                                <Input
                                  value={deepTopic}
                                  onChange={(e) => setDeepTopic(e.target.value)}
                                  placeholder="Or type any topic to explore…"
                                  className="flex-1 text-sm h-8"
                                />
                                <Button
                                  type="submit"
                                  size="sm"
                                  disabled={!deepTopic.trim() || isStreaming}
                                  className="h-8 px-3"
                                >
                                  <Telescope className="w-3.5 h-3.5" />
                                </Button>
                              </form>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Facts */}
                <AnimatePresence>
                  {facts.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <BentoGrid facts={facts} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Follow-up */}
                <AnimatePresence>
                  {summary && !isStreaming && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="pt-2 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
                        <span className="font-cinzel text-[9px] text-parchment-700 uppercase tracking-widest whitespace-nowrap">Continue</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {FOLLOW_UPS.map((q) => (
                          <button
                            key={q}
                            onClick={() => onFollowUp(q)}
                            disabled={isStreaming}
                            className="relative overflow-hidden px-2.5 py-1 rounded-full border border-white/[0.07] bg-transparent text-parchment-500 font-garamond text-xs hover:border-gold/40 hover:text-gold transition-colors disabled:opacity-40 group"
                          >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity beam-gradient pointer-events-none" />
                            <span className="relative">{q}</span>
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setShowFollowUp(!showFollowUp)}
                        className="flex items-center gap-1.5 text-xs font-garamond text-parchment-600 hover:text-gold transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Ask your own question
                        {showFollowUp ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      <AnimatePresence>
                        {showFollowUp && (
                          <motion.form
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            onSubmit={handleFollowUpSubmit}
                            className="flex gap-2"
                          >
                            <Input
                              value={followUpInput}
                              onChange={(e) => setFollowUpInput(e.target.value)}
                              placeholder="What else would you know, traveller?"
                              autoFocus
                              className="flex-1 text-sm"
                            />
                            <Button type="submit" size="sm" disabled={!followUpInput.trim() || isStreaming}>Ask</Button>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      {/* Explore another region */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => { setSelectedRegion(""); back("region"); }}
                          className="flex-1 py-2 rounded-lg border border-white/[0.06] text-parchment-600 hover:text-gold hover:border-gold/30 font-cinzel text-xs transition-all"
                        >
                          Different region
                        </button>
                        <button
                          onClick={() => { setSelectedEra(""); setEraInput(""); setSelectedRegion(""); back("era"); }}
                          className="flex-1 py-2 rounded-lg border border-white/[0.06] text-parchment-600 hover:text-gold hover:border-gold/30 font-cinzel text-xs transition-all"
                        >
                          Different era
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="h-6" />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute bottom-4 right-4 pointer-events-none opacity-[0.035] select-none">
        <Scroll className="w-20 h-20 text-gold" />
      </div>
    </motion.aside>
  );
}
