import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { List, Map, Search, MessageCircle, Compass, Crown, Scroll } from "lucide-react";
import { MapView } from "./components/MapView";
import { SidePanel } from "./components/SidePanel";
import { Chatbot } from "./components/Chatbot";
import { useConversation } from "./hooks/useConversation";
import { hasApiKey } from "./lib/anthropic";
import { COUNTRY_REGIONS, getFlagForCountry } from "./data/countryRegions";
import { Meteors } from "./components/ui/meteors";
import { DotPattern } from "./components/ui/dot-pattern";

type ViewMode = "map" | "list";

// Cycling historical prompts shown in the hero
const HERO_PROMPTS = [
  { era: "Ancient Rome", question: "Why did the greatest empire fall?" },
  { era: "Viking Age", question: "Who were the raiders of the north?" },
  { era: "Medieval Crusades", question: "What drove men to holy war?" },
  { era: "Renaissance Florence", question: "How did art reshape the world?" },
  { era: "Mongol Empire", question: "How did a steppe tribe conquer the earth?" },
  { era: "Ottoman Empire", question: "What made Constantinople legendary?" },
  { era: "Black Death", question: "How did plague transform Europe?" },
  { era: "Age of Exploration", question: "What lay beyond the edge of the map?" },
];

// 3D tilt card for country list
function TiltCard({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <motion.button
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 600 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// Corner ornament SVG
function CornerOrnament({ className }: { className: string }) {
  return (
    <svg className={`w-16 h-16 opacity-20 ${className}`} viewBox="0 0 64 64" fill="none">
      <path d="M4 4 L4 24 M4 4 L24 4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 4 L18 18" stroke="#C9A84C" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="2 4"/>
      <circle cx="4" cy="4" r="2.5" fill="#C9A84C"/>
    </svg>
  );
}

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [listSearch, setListSearch] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [promptIdx, setPromptIdx] = useState(0);
  const [promptVisible, setPromptVisible] = useState(true);

  const { streamState, ask, followUp, reset, hasHistory } = useConversation();

  // Cycle hero prompts
  useEffect(() => {
    const timer = setInterval(() => {
      setPromptVisible(false);
      setTimeout(() => {
        setPromptIdx((i) => (i + 1) % HERO_PROMPTS.length);
        setPromptVisible(true);
      }, 500);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleCountryClick = useCallback(async (country: string) => {
    reset();
    setSelectedCountry(country);
    setPanelOpen(true);
  }, [reset]);

  const handleMapClick = useCallback(async (country: string) => {
    setIsGeocoding(false);
    handleCountryClick(country);
  }, [handleCountryClick]);

  const handleClose = useCallback(() => {
    setPanelOpen(false);
    setSelectedCountry(null);
    reset();
  }, [reset]);

  const handleAsk = useCallback(async (country: string, region: string, era: string) => {
    await ask(country, region, era);
  }, [ask]);

  const apiOk = hasApiKey();
  const allCountries = Object.keys(COUNTRY_REGIONS).sort();
  const filteredCountries = listSearch
    ? allCountries.filter((c) => c.toLowerCase().includes(listSearch.toLowerCase()))
    : allCountries;
  const countryCount = allCountries.length;

  return (
    <div className="relative w-full h-full overflow-hidden bg-ink">

      {/* ── Deep background: meteors + dots + aurora ──────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Meteors count={18} />
        <DotPattern className="opacity-30" />

        {/* Primary aurora — top center */}
        <motion.div className="absolute" style={{
          width: "80vw", height: "55vh", top: "-20%", left: "10%",
          background: "radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 45%, transparent 70%)",
          filter: "blur(70px)",
        }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5], x: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Secondary aurora — bottom right */}
        <motion.div className="absolute" style={{
          width: "55vw", height: "45vh", bottom: "-15%", right: "-5%",
          background: "radial-gradient(ellipse, rgba(140,70,20,0.07) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        {/* Tertiary aurora — left */}
        <motion.div className="absolute" style={{
          width: "35vw", height: "60vh", top: "20%", left: "-10%",
          background: "radial-gradient(ellipse, rgba(100,50,10,0.05) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 8 }}
        />
      </div>

      {/* ── Map ───────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ left: panelOpen ? 430 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        style={{ right: 0 }}
        onMouseDown={() => setIsGeocoding(true)}
        onMouseUp={() => setIsGeocoding(false)}
      >
        <MapView onCountryClick={handleMapClick} selectedCountry={selectedCountry} isGeocoding={isGeocoding} />
      </motion.div>

      {/* ── Vignette — stronger edges ─────────────────────── */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 35%, rgba(13,10,6,0.55) 70%, rgba(13,10,6,0.85) 100%)"
      }} />

      {/* ── Map corner ornaments ───────────────────────────── */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <CornerOrnament className="absolute top-14 left-2" />
        <div style={{ transform: "scaleX(-1)" }} className="absolute top-14 right-2">
          <CornerOrnament className="" />
        </div>
        <div style={{ transform: "scaleY(-1)" }} className="absolute bottom-2 left-2">
          <CornerOrnament className="" />
        </div>
        <div style={{ transform: "scale(-1)" }} className="absolute bottom-2 right-2">
          <CornerOrnament className="" />
        </div>
      </div>

      {/* ── Header — full glassmorphism bar ───────────────── */}
      <motion.header
        className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Glass bar background */}
        <div className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(13,10,6,0.92) 0%, rgba(13,10,6,0.7) 70%, transparent 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        />
        {/* Bottom separator */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

        <div className="relative flex items-center gap-4 px-5 py-3.5">
          {/* Logo + title */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative w-9 h-9">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <img src="/favicon.svg" alt="logo" className="relative w-9 h-9 drop-shadow-[0_0_8px_rgba(201,168,76,0.7)]" />
            </div>
            <div>
              <h1 className="font-cinzel text-xl font-bold leading-none tracking-wide">
                <span className="gradient-text">The Emperor's Map</span>
              </h1>
              <p className="font-garamond text-[10px] text-parchment-600 italic leading-none mt-0.5 tracking-wide">
                {countryCount} nations · across all ages · powered by AI
              </p>
            </div>
          </div>

          <div className="flex-1" />

          {/* Stats badge */}
          <motion.div
            className="pointer-events-none hidden sm:flex items-center gap-4 px-4 py-2 rounded-full border border-gold/10 bg-white/[0.03]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-1.5">
              <Crown className="w-3 h-3 text-gold/50" />
              <span className="font-cinzel text-[10px] text-parchment-600">{countryCount} Countries</span>
            </div>
            <div className="w-px h-3 bg-gold/15" />
            <div className="flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-gold/50" />
              <span className="font-cinzel text-[10px] text-parchment-600">All Eras</span>
            </div>
            <div className="w-px h-3 bg-gold/15" />
            <div className="flex items-center gap-1.5">
              <Scroll className="w-3 h-3 text-gold/50" />
              <span className="font-cinzel text-[10px] text-parchment-600">AI Chronicles</span>
            </div>
          </motion.div>

          {/* View toggle */}
          <div className="pointer-events-auto flex items-center gap-1 bg-white/[0.04] backdrop-blur-md border border-gold/15 rounded-full px-1.5 py-1">
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-[10px] font-cinzel ${viewMode === "map" ? "text-gold bg-gold/15 shadow-[0_0_8px_rgba(201,168,76,0.2)]" : "text-parchment-500 hover:text-gold"}`}
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Map</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-[10px] font-cinzel ${viewMode === "list" ? "text-gold bg-gold/15 shadow-[0_0_8px_rgba(201,168,76,0.2)]" : "text-parchment-500 hover:text-gold"}`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Browse</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Hero overlay — shown when map is idle ─────────── */}
      <AnimatePresence>
        {!panelOpen && viewMode === "map" && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8 }}
          >
            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 inset-x-0 h-56 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(13,10,6,0.75) 0%, transparent 100%)" }}
            />

            {/* Hero content — centered at bottom */}
            <div className="relative flex flex-col items-center gap-4 pb-10 pt-4">

              {/* Cycling question */}
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <AnimatePresence mode="wait">
                  {promptVisible && (
                    <motion.div
                      key={promptIdx}
                      className="flex flex-col items-center gap-1.5"
                      initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                      transition={{ duration: 0.45 }}
                    >
                      <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-gold/60">
                        {HERO_PROMPTS[promptIdx].era}
                      </span>
                      <span className="font-garamond text-lg italic text-parchment-300 text-center max-w-xs">
                        "{HERO_PROMPTS[promptIdx].question}"
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* CTA pill */}
              <motion.div
                className="relative overflow-hidden flex items-center gap-3 px-6 py-3 rounded-full border border-gold/25 bg-ink/70 backdrop-blur-md"
                style={{ boxShadow: "0 0 30px rgba(201,168,76,0.08), inset 0 0 20px rgba(201,168,76,0.03)" }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 }}
              >
                {/* Shine sweep */}
                <div className="absolute inset-0 beam-gradient pointer-events-none" />
                {/* Pulsing dot */}
                <motion.div
                  className="w-2 h-2 rounded-full bg-gold flex-shrink-0"
                  style={{ boxShadow: "0 0 8px 2px rgba(201,168,76,0.5)" }}
                  animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
                <span className="font-cinzel text-xs text-parchment-300 tracking-wider">
                  Click anywhere on the map to begin
                </span>
                <div className="w-px h-3 bg-gold/20 flex-shrink-0" />
                <span className="font-garamond text-xs text-parchment-600 italic">or browse all nations</span>
              </motion.div>

              {/* Dots row under CTA */}
              <motion.div
                className="flex items-center gap-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                {HERO_PROMPTS.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-500"
                    style={{
                      width: i === promptIdx ? 16 : 4,
                      height: 4,
                      background: i === promptIdx ? "#C9A84C" : "rgba(201,168,76,0.25)",
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Geocoding spinner ─────────────────────────────── */}
      <AnimatePresence>
        {isGeocoding && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-full border border-gold/30 bg-ink/90 backdrop-blur-md shadow-[0_0_30px_rgba(201,168,76,0.15)]">
              <motion.div
                className="w-3.5 h-3.5 rounded-full border-2 border-gold border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              <span className="font-cinzel text-xs text-gold tracking-wider">Detecting country…</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── API key warning ───────────────────────────────── */}
      <AnimatePresence>
        {!apiOk && (
          <motion.div
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="p-3 rounded-xl border border-amber-700/50 bg-amber-950/90 backdrop-blur-md text-center">
              <p className="font-cinzel text-xs text-amber-400 font-semibold mb-1">Groq Key Missing</p>
              <p className="font-garamond text-xs text-amber-200/70">
                Add <code className="font-mono text-amber-300">VITE_GROQ_API_KEY</code> to <code className="font-mono text-amber-300">.env</code>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Browse list overlay ───────────────────────────── */}
      <AnimatePresence>
        {viewMode === "list" && (
          <motion.div
            className="absolute inset-0 z-30"
            style={{ background: "rgba(10,7,4,0.97)", backdropFilter: "blur(24px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Background aurora inside list */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
                style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)", filter: "blur(40px)" }}
              />
              <DotPattern className="opacity-20" />
            </div>

            {/* List header */}
            <div className="relative flex items-center gap-3 px-5 pt-16 pb-4">
              {/* Bottom border */}
              <div className="absolute bottom-0 inset-x-5 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

              <div>
                <h2 className="font-cinzel text-base font-bold text-gold">Browse Nations</h2>
                <p className="font-garamond text-xs text-parchment-600 italic mt-0.5">{countryCount} countries across 6 continents</p>
              </div>

              <div className="flex-1" />

              {/* Search */}
              <div className="flex items-center gap-2 bg-white/[0.04] border border-gold/20 rounded-full px-3 py-2">
                <Search className="w-3.5 h-3.5 text-gold/50" />
                <input
                  autoFocus
                  value={listSearch}
                  onChange={(e) => setListSearch(e.target.value)}
                  placeholder="Search nations…"
                  className="bg-transparent text-xs font-garamond text-parchment-200 placeholder:text-parchment-600 outline-none w-32"
                />
              </div>

              {/* Back to map */}
              <motion.button
                onClick={() => setViewMode("map")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-gold/25 bg-gold/8 text-gold font-cinzel text-xs hover:bg-gold/15 hover:border-gold/50 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Map className="w-3.5 h-3.5" /> Map
              </motion.button>
            </div>

            {/* Country grid */}
            <div className="relative h-[calc(100%-88px)] overflow-y-auto p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {filteredCountries.map((country, i) => {
                  const flag = getFlagForCountry(country);
                  const isSelected = selectedCountry === country;
                  return (
                    <motion.div
                      key={country}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.012, 0.8) }}
                    >
                      <TiltCard
                        onClick={() => { handleCountryClick(country); setViewMode("map"); }}
                        className={`w-full flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all group ${
                          isSelected
                            ? "border-gold/60 bg-gold/15 shadow-[0_0_16px_rgba(201,168,76,0.2)]"
                            : "border-white/[0.06] bg-white/[0.02] hover:border-gold/35 hover:bg-gold/8 hover:shadow-[0_0_12px_rgba(201,168,76,0.1)]"
                        }`}
                      >
                        <span className="text-xl flex-shrink-0">{flag}</span>
                        <span className={`font-cinzel text-xs leading-tight transition-colors ${
                          isSelected ? "text-gold" : "text-parchment-300 group-hover:text-gold"
                        }`}>
                          {country}
                        </span>
                      </TiltCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Side panel ───────────────────────────────────── */}
      <AnimatePresence>
        {panelOpen && selectedCountry && (
          <SidePanel
            country={selectedCountry}
            streamState={streamState}
            onClose={handleClose}
            onAsk={handleAsk}
            onFollowUp={followUp}
            hasHistory={hasHistory}
          />
        )}
      </AnimatePresence>

      {/* ── Floating chat button ─────────────────────────── */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.button
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-full border border-gold/35 bg-ink/95 backdrop-blur-xl overflow-hidden"
            style={{ boxShadow: "0 0 0 1px rgba(201,168,76,0.08), 0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(201,168,76,0.08)" }}
            onClick={() => setChatOpen(true)}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 22, delay: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 0 1px rgba(201,168,76,0.2), 0 8px 32px rgba(0,0,0,0.6), 0 0 30px rgba(201,168,76,0.18)" }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Rotating border glow */}
            <div className="absolute inset-0 rounded-full pointer-events-none opacity-40"
              style={{
                background: "conic-gradient(from var(--angle, 0deg), transparent 0%, rgba(201,168,76,0.5) 20%, transparent 40%)",
                animation: "border-spin 6s linear infinite",
              }}
            />
            {/* Beam sweep */}
            <div className="absolute inset-0 beam-gradient pointer-events-none" />

            <div className="relative flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-gold" />
                </div>
                <motion.div
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gold border-2 border-ink"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="text-left">
                <p className="font-cinzel text-xs font-bold text-gold leading-tight">Ask Historicus</p>
                <p className="font-garamond text-[10px] text-parchment-600 italic leading-tight">AI historian</p>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chatbot ───────────────────────────────────────── */}
      <Chatbot open={chatOpen} onClose={() => setChatOpen(false)} />

      {/* ── Ambient floating particles ────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${8 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              background: "#C9A84C",
              boxShadow: "0 0 6px 2px rgba(201,168,76,0.15)",
            }}
            animate={{ opacity: [0, 0.5, 0], scale: [0, 4, 0], y: [0, -30, 0] }}
            transition={{ duration: 6 + i * 0.7, repeat: Infinity, delay: i * 1.1, ease: "easeOut" }}
          />
        ))}
      </div>
    </div>
  );
}
