import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, List, Map, Search, MessageCircle } from "lucide-react";
import { MapView } from "./components/MapView";
import { SidePanel } from "./components/SidePanel";
import { Chatbot } from "./components/Chatbot";
import { useConversation } from "./hooks/useConversation";
import { hasApiKey } from "./lib/anthropic";
import { COUNTRY_REGIONS, getFlagForCountry } from "./data/countryRegions";

type ViewMode = "map" | "list";

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [listSearch, setListSearch] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  const { streamState, ask, followUp, reset, hasHistory } = useConversation();

  const handleCountryClick = useCallback(
    async (country: string) => {
      reset();
      setSelectedCountry(country);
      setPanelOpen(true);
    },
    [reset]
  );

  const handleMapClick = useCallback(
    async (country: string) => {
      setIsGeocoding(false);
      handleCountryClick(country);
    },
    [handleCountryClick]
  );

  const handleClose = useCallback(() => {
    setPanelOpen(false);
    setSelectedCountry(null);
    reset();
  }, [reset]);

  const handleAsk = useCallback(
    async (country: string, region: string, era: string) => {
      await ask(country, region, era);
    },
    [ask]
  );

  const apiOk = hasApiKey();

  // Countries list sorted alphabetically
  const allCountries = Object.keys(COUNTRY_REGIONS).sort();
  const filteredCountries = listSearch
    ? allCountries.filter((c) => c.toLowerCase().includes(listSearch.toLowerCase()))
    : allCountries;

  return (
    <div className="relative w-full h-full overflow-hidden bg-ink">

      {/* ── Map (shifts right when panel open) ─────────── */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ left: panelOpen ? 430 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        style={{ right: 0 }}
        onMouseDown={() => setIsGeocoding(true)}
        onMouseUp={() => setIsGeocoding(false)}
      >
        <MapView
          onCountryClick={handleMapClick}
          selectedCountry={selectedCountry}
          isGeocoding={isGeocoding}
        />
      </motion.div>

      {/* ── Vignette ─────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(13,10,6,0.6) 100%)" }}
      />

      {/* ── Header ───────────────────────────────────────── */}
      <motion.header
        className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-5 py-3.5 pointer-events-none"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="relative w-7 h-7">
            <Globe className="w-7 h-7 text-gold" />
            <div className="absolute inset-0 animate-ping rounded-full bg-gold/15" />
          </div>
          <div>
            <h1 className="font-cinzel text-lg font-bold text-gold tracking-wide leading-none">
              The Emperor's Map
            </h1>
            <p className="font-garamond text-[10px] text-parchment-600 italic leading-none mt-0.5">
              Click any country · Choose an era · Explore a region
            </p>
          </div>
        </div>

        <div className="flex-1" />

        {/* View toggle — pointer-events restored */}
        <div className="pointer-events-auto flex items-center gap-1 bg-ink-light/70 backdrop-blur-md border border-gold/15 rounded-full px-1.5 py-1">
          <button
            onClick={() => setViewMode("map")}
            className={`p-1.5 rounded-full transition-all ${viewMode === "map" ? "text-gold bg-gold/15" : "text-parchment-500 hover:text-gold"}`}
            title="Map"
          >
            <Map className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-full transition-all ${viewMode === "list" ? "text-gold bg-gold/15" : "text-parchment-500 hover:text-gold"}`}
            title="Browse all countries"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.header>

      {/* ── Bottom hint ───────────────────────────────────── */}
      <AnimatePresence>
        {!panelOpen && viewMode === "map" && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-gold/20 bg-ink-light/80 backdrop-blur-md shadow-gold">
              <motion.div
                className="w-2 h-2 rounded-full bg-gold"
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
              <span className="font-garamond text-sm text-parchment-400 italic">
                Click anywhere on the map to select a country
              </span>
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
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-gold/30 bg-ink-light/90 backdrop-blur-md">
              <motion.div
                className="w-3 h-3 rounded-full border-2 border-gold border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              <span className="font-cinzel text-xs text-gold">Detecting country…</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── API key warning ───────────────────────────────── */}
      <AnimatePresence>
        {!apiOk && (
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-4"
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
            className="absolute inset-0 z-30 bg-ink/96 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* List header */}
            <div className="flex items-center gap-3 px-5 pt-16 pb-4 border-b border-gold/10">
              <h2 className="font-cinzel text-sm font-bold text-gold flex-1">Browse Countries</h2>
              <div className="flex items-center gap-2 bg-ink-light border border-gold/20 rounded-full px-3 py-1.5">
                <Search className="w-3.5 h-3.5 text-gold/50" />
                <input
                  autoFocus
                  value={listSearch}
                  onChange={(e) => setListSearch(e.target.value)}
                  placeholder="Search…"
                  className="bg-transparent text-xs font-garamond text-parchment-200 placeholder:text-parchment-600 outline-none w-28"
                />
              </div>
              <button
                onClick={() => setViewMode("map")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/20 text-parchment-400 hover:text-gold hover:border-gold/40 transition-all font-cinzel text-xs"
              >
                <Map className="w-3.5 h-3.5" /> Map
              </button>
            </div>

            {/* Grid of countries */}
            <div className="h-[calc(100%-80px)] overflow-y-auto p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {filteredCountries.map((country, i) => {
                  const flag = getFlagForCountry(country);
                  const isSelected = selectedCountry === country;
                  return (
                    <motion.button
                      key={country}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.015 }}
                      onClick={() => { handleCountryClick(country); setViewMode("map"); }}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all group ${
                        isSelected
                          ? "border-gold/50 bg-gold/15"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-gold/30 hover:bg-gold/8"
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{flag}</span>
                      <span className={`font-cinzel text-xs leading-tight transition-colors ${
                        isSelected ? "text-gold" : "text-parchment-300 group-hover:text-gold"
                      }`}>
                        {country}
                      </span>
                    </motion.button>
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
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full border border-gold/30 bg-ink-light/95 backdrop-blur-md shadow-gold hover:border-gold/60 hover:shadow-gold-lg transition-all group"
            onClick={() => setChatOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5 text-gold" />
              <motion.div
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="font-cinzel text-xs font-semibold text-gold">Ask the Emperor</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chatbot panel ────────────────────────────────── */}
      <Chatbot open={chatOpen} onClose={() => setChatOpen(false)} />

      {/* ── Ambient particles ────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${12 + i * 14}%`, top: `${18 + (i % 3) * 22}%`,
              width: 2, height: 2, background: "#C9A84C",
              boxShadow: "0 0 8px 3px rgba(201,168,76,0.1)",
            }}
            animate={{ opacity: [0, 0.4, 0], scale: [0, 5, 0] }}
            transition={{ duration: 5 + i * 0.8, repeat: Infinity, delay: i * 1.3, ease: "easeOut" }}
          />
        ))}
      </div>
    </div>
  );
}
