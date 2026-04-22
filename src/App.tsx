import { lazy, Suspense, useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { List, Map, Search, MessageCircle, Compass, Crown, Scroll } from "lucide-react";
import { useConversation } from "./hooks/useConversation";
import { hasApiKey } from "./lib/anthropic";
import { COUNTRY_REGIONS, getFlagForCountry } from "./data/countryRegions";
import { Meteors } from "./components/ui/meteors";
import { DotPattern } from "./components/ui/dot-pattern";
import { NumberTicker } from "./components/ui/number-ticker";
import { WordRotate } from "./components/ui/word-rotate";
import { Marquee } from "./components/ui/marquee";
import { MagneticButton } from "./components/ui/magnetic-button";
import { MapRipple } from "./components/ui/map-ripple";

type ViewMode = "map" | "list";
type MobileTab = "map" | "timeline" | "chronicles" | "collection" | "profile";

const MapView = lazy(() => import("./components/MapView").then((module) => ({ default: module.MapView })));
const SidePanel = lazy(() => import("./components/SidePanel").then((module) => ({ default: module.SidePanel })));
const Chatbot = lazy(() => import("./components/Chatbot").then((module) => ({ default: module.Chatbot })));

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

const mobileNavItems: { id: MobileTab; label: string }[] = [
  { id: "map", label: "Map" },
  { id: "timeline", label: "Timeline" },
  { id: "chronicles", label: "Chronicles" },
  { id: "collection", label: "Collection" },
  { id: "profile", label: "Profile" },
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

function MobileIcon({ name, className = "" }: { name: MobileTab | "search" | "menu" | "send" | "brand"; className?: string }) {
  if (name === "brand") {
    return (
      <svg className={className} viewBox="0 0 48 48" aria-hidden="true" fill="none">
        <rect x="5" y="5" width="38" height="38" rx="13" stroke="currentColor" strokeWidth="1.15" opacity=".62" />
        <rect x="8" y="8" width="32" height="32" rx="10" stroke="currentColor" strokeWidth=".8" opacity=".28" />
        <path d="M17.4 31.5V16.5M30.6 31.5V16.5M17.4 24h13.2" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <circle cx="10.8" cy="10.8" r="5.4" stroke="currentColor" strokeWidth="1.55" />
        <path d="m15.05 15.05 4 4" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "menu") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M5 7.25h14M5 12h14M5 16.75h14" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "send") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M4.7 12.1 19.1 5.9l-4.42 12.25-3-5.35-6.98-.7Z" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round" />
        <path d="m11.7 12.8 3 5.35" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "timeline") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <circle cx="12" cy="12" r="7.15" stroke="currentColor" strokeWidth="1.55" />
        <path d="M12 7.8v4.45l3 1.65" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "chronicles") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M5.25 6.85c2.18-.95 4.28-.88 6.4.18.23.12.47.12.7 0 2.12-1.06 4.22-1.13 6.4-.18v10.3c-2.18-.95-4.28-.88-6.4.18a.77.77 0 0 1-.7 0c-2.12-1.06-4.22-1.13-6.4-.18V6.85Z" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7.45v10.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "collection") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M12 4.9 18 7.55v4.25c0 3.75-2.35 6.2-6 7.3-3.65-1.1-6-3.55-6-7.3V7.55L12 4.9Z" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "profile") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <circle cx="12" cy="8.6" r="3.05" stroke="currentColor" strokeWidth="1.55" />
        <path d="M5.85 18.35c1.18-3.05 3.08-4.55 6.15-4.55s4.98 1.5 6.15 4.55" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
        <circle cx="12" cy="12" r="8.15" stroke="currentColor" strokeWidth="1.1" opacity=".45" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M4.9 6.8c2.45-1.05 4.8-1 7.1.2 2.3-1.2 4.65-1.25 7.1-.2v10.4c-2.45-1.05-4.8-1-7.1.2-2.3-1.2-4.65-1.25-7.1-.2V6.8Z" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M12 7.15v10.15" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function MobileAtlasHeader({
  listSearch,
  onSearchChange,
  onOpenSearch,
  onOpenMenu,
}: {
  listSearch: string;
  onSearchChange: (value: string) => void;
  onOpenSearch: () => void;
  onOpenMenu: () => void;
}) {
  return (
    <motion.div
      className="pointer-events-auto absolute left-3 right-3 top-[max(1.25rem,env(safe-area-inset-top))] z-30 sm:hidden"
      initial={{ opacity: 0, y: -18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="rounded-[1.45rem] border border-gold/20 bg-[#0d0c08]/90 p-1 shadow-[0_18px_42px_rgba(0,0,0,0.46),inset_0_1px_1px_rgba(245,232,196,0.08)]">
        <div className="flex items-center gap-1.5 rounded-[1.12rem] bg-[#11100b]/90 px-2 py-1.5 shadow-[inset_0_1px_0_rgba(245,232,196,0.07)]">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-[#17130a] text-gold shadow-[inset_0_1px_1px_rgba(245,232,196,0.08)]">
            <MobileIcon name="brand" className="h-9 w-9" />
          </div>

          <div className="min-w-[5.9rem] flex-shrink-0">
            <p className="font-cinzel text-[0.9rem] font-bold leading-none tracking-[0.08em] text-gold">Historicus</p>
            <p className="mt-0.5 font-cinzel text-[0.5rem] uppercase leading-none tracking-[0.14em] text-gold/75">
              Europa Temporis
            </p>
          </div>

          <label className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-gold/20 bg-[#090806]/90 px-2.5 py-2 text-parchment-500 shadow-[inset_0_1px_0_rgba(245,232,196,0.04)]">
            <MobileIcon name="search" className="h-4 w-4 flex-shrink-0 text-gold/70" />
            <input
              value={listSearch}
              onChange={(event) => onSearchChange(event.target.value)}
              onFocus={onOpenSearch}
              placeholder="Search places, events..."
              className="min-w-0 flex-1 bg-transparent font-garamond text-[0.82rem] text-parchment-200 outline-none placeholder:text-parchment-600"
            />
          </label>

          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open navigation"
            className="group flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-[#11100a] text-gold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
          >
            <MobileIcon name="menu" className="h-6 w-6 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-active:scale-95" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function MobileCompassOverlay() {
  return (
    <motion.div
      className="pointer-events-none absolute left-5 top-[8.8rem] z-20 hidden text-gold min-[360px]:block sm:hidden"
      initial={{ opacity: 0, x: -18, filter: "blur(8px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay: 0.18, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="relative flex h-28 w-28 items-center justify-center opacity-80">
        <svg viewBox="0 0 112 112" className="h-28 w-28" aria-hidden="true" fill="none">
          <circle cx="56" cy="56" r="29" stroke="currentColor" strokeWidth="0.8" opacity=".22" />
          <path d="M56 9 62.5 51.5 103 56 62.5 60.5 56 103 49.5 60.5 9 56 49.5 51.5 56 9Z" stroke="currentColor" strokeWidth="0.9" opacity=".45" />
          <path d="M56 22 60.1 52 90 56 60.1 60 56 90 51.9 60 22 56 51.9 52 56 22Z" fill="currentColor" opacity=".18" />
          <path d="M56 34v44M34 56h44" stroke="currentColor" strokeWidth="1" opacity=".45" />
          <text x="56" y="16" textAnchor="middle" className="fill-current font-cinzel text-[10px] font-bold">N</text>
        </svg>
      </div>
      <div className="-mt-1 ml-1 flex w-24 flex-col items-center gap-1">
        <p className="font-cinzel text-sm tracking-[0.12em] text-gold">500 km</p>
        <div className="h-px w-full bg-gold/70" />
      </div>
    </motion.div>
  );
}

function MobileBottomNavigation({
  active,
  onChange,
}: {
  active: MobileTab;
  onChange: (tab: MobileTab) => void;
}) {
  return (
    <motion.nav
      className="pointer-events-auto absolute inset-x-0 bottom-[5.95rem] z-30 sm:hidden"
      initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.95, delay: 0.22, ease: [0.32, 0.72, 0, 1] }}
      aria-label="Mobile atlas navigation"
    >
      <div className="relative border-y border-gold/15 bg-[#0b0a07]/95 shadow-[0_-22px_55px_rgba(0,0,0,0.56),inset_0_1px_0_rgba(245,232,196,0.04)]">
        <div className="absolute left-1/2 top-0 h-8 w-32 -translate-x-1/2 -translate-y-[58%] rounded-t-[3rem] border-x border-t border-gold/15 bg-[#0b0a07]/95" />
        <div className="relative mx-auto grid h-[4.25rem] max-w-[30rem] grid-cols-5 px-2 pt-2">
          {mobileNavItems.map((item) => {
            const selected = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                className={`group mx-auto flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 text-gold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${
                  selected
                    ? "w-full border border-gold/25 bg-gold/10 shadow-[inset_0_1px_0_rgba(245,232,196,0.07)]"
                    : "w-full text-gold/70"
                }`}
              >
                <MobileIcon name={item.id} className={`h-5 w-5 ${selected ? "text-gold" : "text-gold/70"}`} />
                <span className="w-full truncate text-center font-cinzel text-[0.48rem] uppercase tracking-[0.06em]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}

function MobileChatDock({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      className="pointer-events-auto absolute inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 rounded-[1.7rem] border border-gold/25 bg-[#0c0b08]/95 p-1 text-left shadow-[0_-12px_44px_rgba(0,0,0,0.58),inset_0_1px_1px_rgba(245,232,196,0.06)] sm:hidden"
      initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1, delay: 0.32, ease: [0.32, 0.72, 0, 1] }}
      whileTap={{ scale: 0.985 }}
    >
      <div className="flex h-16 items-center gap-1.5 rounded-[1.45rem] border border-gold/10 bg-[#11100c] px-2 shadow-[inset_0_1px_0_rgba(245,232,196,0.05)]">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gold/15 bg-[#090806] text-gold shadow-[inset_0_1px_0_rgba(245,232,196,0.05)]">
          <MobileIcon name="chronicles" className="h-6 w-6" />
        </div>
        <div className="flex min-w-0 flex-1 items-center rounded-full bg-[#080705] px-3 py-3">
          <span className="truncate font-garamond text-[0.92rem] font-semibold text-parchment-600">
            Ask anything about history...
          </span>
        </div>
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
          <MobileIcon name="send" className="h-6 w-6" />
        </div>
      </div>
    </motion.button>
  );
}

function useMediaQuery(query: string, fallback = false) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return fallback;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const handleChange = () => setMatches(media.matches);
    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

function MapShellFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-ink">
      <div className="w-[min(82vw,320px)] rounded-3xl border border-gold/20 bg-white/[0.035] px-5 py-5 text-center shadow-[inset_0_1px_0_rgba(245,232,196,0.06)]">
        <div className="mx-auto mb-4 h-1 w-28 overflow-hidden rounded-full bg-white/10">
          <div className="h-full map-status-progress rounded-full bg-gold/80" />
        </div>
        <p className="font-cinzel text-[10px] uppercase tracking-[0.26em] text-gold/80">Preparing atlas</p>
        <p className="mt-2 font-garamond text-sm italic leading-relaxed text-parchment-600">
          Loading the map engine and mobile controls.
        </p>
      </div>
    </div>
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
  const [mobileTab, setMobileTab] = useState<MobileTab>("map");
  const isDesktop = useMediaQuery("(min-width: 768px)", true);
  const isPhone = !isDesktop;

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

  const handleMobileTabChange = useCallback((tab: MobileTab) => {
    setMobileTab(tab);
    if (tab === "map") {
      setViewMode("map");
      return;
    }
    if (tab === "collection") {
      setViewMode("list");
      return;
    }
    if (tab === "chronicles") {
      setChatOpen(true);
    }
  }, []);

  const apiOk = hasApiKey();
  const allCountries = Object.keys(COUNTRY_REGIONS).sort();
  const filteredCountries = listSearch
    ? allCountries.filter((c) => c.toLowerCase().includes(listSearch.toLowerCase()))
    : allCountries;
  const countryCount = allCountries.length;
  const mapOffset = panelOpen && isDesktop ? 430 : 0;

  return (
    <main className="relative h-[100dvh] min-h-[100dvh] w-full max-w-full overflow-hidden bg-ink">

      {/* ── Deep background: meteors + dots + aurora ──────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="hidden sm:block">
          <Meteors count={18} />
        </div>
        <DotPattern className="opacity-20 sm:opacity-30" />

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
        animate={{ left: mapOffset }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        style={{ right: 0 }}
        onMouseUp={() => setIsGeocoding(false)}
      >
        <MapRipple
          className="w-full h-full"
          onAreaClick={() => setIsGeocoding(true)}
        >
          <Suspense fallback={<MapShellFallback />}>
            <MapView onCountryClick={handleMapClick} selectedCountry={selectedCountry} isGeocoding={isGeocoding} />
          </Suspense>
        </MapRipple>
      </motion.div>

      {/* ── Vignette — stronger edges ─────────────────────── */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden sm:block" style={{
        background: "radial-gradient(ellipse at center, transparent 35%, rgba(13,10,6,0.55) 70%, rgba(13,10,6,0.85) 100%)"
      }} />
      <div className="absolute inset-0 z-10 pointer-events-none sm:hidden" style={{
        background: "linear-gradient(180deg, rgba(13,10,6,0.48) 0%, transparent 20%, transparent 58%, rgba(13,10,6,0.62) 100%)"
      }} />

      {/* ── Map corner ornaments ───────────────────────────── */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden sm:block">
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

      <MobileAtlasHeader
        listSearch={listSearch}
        onSearchChange={setListSearch}
        onOpenSearch={() => {
          setMobileTab("collection");
          setViewMode("list");
        }}
        onOpenMenu={() => {
          setMobileTab("collection");
          setViewMode("list");
        }}
      />
      <MobileCompassOverlay />

      {/* ── Header — full glassmorphism bar ───────────────── */}
      <motion.header
        className="pointer-events-none absolute left-0 right-0 top-0 z-20 hidden sm:block"
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

        <div className="relative flex items-center gap-3 px-3.5 py-3 sm:gap-4 sm:px-5 sm:py-3.5">
          {/* Logo + title */}
          <div className="flex min-w-0 flex-shrink items-center gap-2.5 sm:gap-3">
            <div className="relative h-8 w-8 flex-shrink-0 sm:h-9 sm:w-9">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <img src="/favicon.svg" alt="logo" className="relative h-8 w-8 drop-shadow-[0_0_8px_rgba(201,168,76,0.7)] sm:h-9 sm:w-9" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate font-cinzel text-[15px] font-bold leading-none tracking-[0.12em] sm:text-xl sm:tracking-wide">
                <span className="gradient-text">{isPhone ? "Historicus" : "The Emperor's Map"}</span>
              </h1>
              <p className="mt-0.5 hidden font-garamond text-[10px] italic leading-none tracking-wide text-parchment-600 min-[380px]:block">
                {countryCount} nations ·{" "}
                <WordRotate
                  words={["Empires", "Kingdoms", "Civilizations", "Dynasties", "Chronicles"]}
                  className="text-gold/70 inline"
                  interval={2500}
                />{" "}
                · powered by AI
              </p>
            </div>
          </div>

          <div className="min-w-1 flex-1" />

          {/* Stats badge */}
          <motion.div
            className="pointer-events-none hidden sm:flex items-center gap-4 px-4 py-2 rounded-full border border-gold/10 bg-white/[0.03]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-1.5">
              <Crown className="w-3 h-3 text-gold/50" />
              <NumberTicker value={countryCount} suffix=" Countries" className="font-cinzel text-[10px] text-parchment-600" />
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
          <div className="pointer-events-auto flex flex-shrink-0 items-center gap-1 rounded-full border border-gold/15 bg-white/[0.04] px-1.5 py-1 backdrop-blur-md">
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-[10px] font-cinzel ${viewMode === "map" ? "text-gold bg-gold/15 shadow-[0_0_8px_rgba(201,168,76,0.2)]" : "text-parchment-500 hover:text-gold"}`}
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden min-[390px]:block">Map</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-[10px] font-cinzel ${viewMode === "list" ? "text-gold bg-gold/15 shadow-[0_0_8px_rgba(201,168,76,0.2)]" : "text-parchment-500 hover:text-gold"}`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden min-[390px]:block">Browse</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Hero overlay — shown when map is idle ─────────── */}
      <AnimatePresence>
        {isDesktop && !panelOpen && viewMode === "map" && (
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
                className="hidden flex-col items-center gap-2 sm:flex"
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
                className="relative flex max-w-[calc(100vw-2rem)] items-center gap-2 overflow-hidden rounded-2xl border border-gold/25 bg-ink/75 px-4 py-3 backdrop-blur-md sm:gap-3 sm:rounded-full sm:px-6"
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
                  {isPhone ? "Tap the map to begin" : "Click anywhere on the map to begin"}
                </span>
                <div className="hidden h-3 w-px flex-shrink-0 bg-gold/20 min-[380px]:block" />
                <span className="hidden font-garamond text-xs italic text-parchment-600 min-[380px]:block">or browse nations</span>
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

              {/* Marquee — atmospheric historical ticker */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
              >
                <Marquee
                  className="font-cinzel text-xs text-gold/70 tracking-[0.2em] py-2 border-t border-gold/15"
                  speed={22}
                  pauseOnHover={true}
                  direction="left"
                >
                  <span className="px-4">Roman Empire</span>
                  <span className="text-gold/30 px-1">·</span>
                  <span className="px-4">Viking Age</span>
                  <span className="text-gold/30 px-1">·</span>
                  <span className="px-4">Ottoman Empire</span>
                  <span className="text-gold/30 px-1">·</span>
                  <span className="px-4">Mongol Conquest</span>
                  <span className="text-gold/30 px-1">·</span>
                  <span className="px-4">Crusades</span>
                  <span className="text-gold/30 px-1">·</span>
                  <span className="px-4">Renaissance</span>
                  <span className="text-gold/30 px-1">·</span>
                  <span className="px-4">Age of Sail</span>
                  <span className="text-gold/30 px-1">·</span>
                  <span className="px-4">Medieval Kingdoms</span>
                  <span className="text-gold/30 px-1">·</span>
                  <span className="px-4">Silk Road</span>
                  <span className="text-gold/30 px-1">·</span>
                  <span className="px-4">Age of Exploration</span>
                  <span className="text-gold/30 px-1">·</span>
                  <span className="px-4">Byzantine Court</span>
                  <span className="text-gold/30 px-1">·</span>
                  <span className="px-4">Aztec Empire</span>
                  <span className="text-gold/30 px-1">·</span>
                </Marquee>
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
            className="absolute bottom-[7.5rem] left-1/2 z-30 w-full max-w-sm -translate-x-1/2 px-4 sm:bottom-24"
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
            <div className="relative flex flex-wrap items-center gap-3 px-4 pb-4 pt-[4.6rem] sm:flex-nowrap sm:px-5 sm:pt-16">
              {/* Bottom border */}
              <div className="absolute bottom-0 inset-x-5 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

              <div>
                <h2 className="font-cinzel text-base font-bold text-gold">Browse Nations</h2>
                <p className="font-garamond text-xs text-parchment-600 italic mt-0.5">{countryCount} countries across 6 continents</p>
              </div>

              <div className="hidden flex-1 sm:block" />

              {/* Search */}
              <div className="order-3 flex w-full items-center gap-2 rounded-full border border-gold/20 bg-white/[0.04] px-3 py-2 sm:order-none sm:w-auto">
                <Search className="w-3.5 h-3.5 text-gold/50" />
                <input
                  autoFocus
                  value={listSearch}
                  onChange={(e) => setListSearch(e.target.value)}
                  placeholder="Search nations…"
                  className="w-full bg-transparent font-garamond text-sm text-parchment-200 outline-none placeholder:text-parchment-600 sm:w-32 sm:text-xs"
                />
              </div>

              {/* Back to map */}
              <motion.button
                onClick={() => setViewMode("map")}
                className="flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/10 px-3.5 py-2 font-cinzel text-xs text-gold transition-all hover:border-gold/50 hover:bg-gold/15"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Map className="w-3.5 h-3.5" /> Map
              </motion.button>
            </div>

            {/* Country grid */}
            <div className="relative h-[calc(100%-142px)] overflow-y-auto p-4 sm:h-[calc(100%-88px)]">
              <div className="grid grid-cols-1 gap-2 min-[390px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
                        onClick={() => { handleCountryClick(country); setViewMode("map"); setMobileTab("map"); }}
                        className={`w-full flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all group ${
                          isSelected
                            ? "border-gold/60 bg-gold/15 shadow-[0_0_16px_rgba(201,168,76,0.2)]"
                            : "border-white/[0.06] bg-white/[0.02] hover:border-gold/30 hover:bg-gold/10 hover:shadow-[0_0_12px_rgba(201,168,76,0.1)]"
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
          <Suspense fallback={null}>
            <SidePanel
              country={selectedCountry}
              streamState={streamState}
              onClose={handleClose}
              onAsk={handleAsk}
              onFollowUp={followUp}
              hasHistory={hasHistory}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* ── Floating chat button ─────────────────────────── */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.button
            className="fixed bottom-6 right-6 z-50 hidden items-center justify-center gap-2.5 overflow-hidden rounded-full border border-gold/30 bg-ink/95 px-5 py-3.5 backdrop-blur-xl sm:flex"
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

            <MagneticButton strength={0.7}>
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
            </MagneticButton>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!chatOpen && viewMode === "map" && (
          <>
            <MobileBottomNavigation active={mobileTab} onChange={handleMobileTabChange} />
            <MobileChatDock onOpen={() => {
              setMobileTab("chronicles");
              setChatOpen(true);
            }} />
          </>
        )}
      </AnimatePresence>

      {/* ── Chatbot ───────────────────────────────────────── */}
      <Suspense fallback={null}>
        <Chatbot open={chatOpen} onClose={() => setChatOpen(false)} />
      </Suspense>

      {/* ── Ambient floating particles ────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden sm:block">
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
    </main>
  );
}
