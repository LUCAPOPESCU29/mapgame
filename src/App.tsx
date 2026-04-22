import { lazy, Suspense, useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useConversation } from "./hooks/useConversation";
import { hasApiKey } from "./lib/anthropic";
import { COUNTRY_REGIONS } from "./data/countryRegions";
import { MapRipple } from "./components/ui/map-ripple";

type ViewMode = "map" | "list";
type MobileTab = "map" | "timeline" | "chronicles" | "collection" | "profile";

const MapView = lazy(() => import("./components/MapView").then((module) => ({ default: module.MapView })));
const SidePanel = lazy(() => import("./components/SidePanel").then((module) => ({ default: module.SidePanel })));
const Chatbot = lazy(() => import("./components/Chatbot").then((module) => ({ default: module.Chatbot })));

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
      className="pointer-events-auto absolute left-3 right-3 top-[max(1.25rem,env(safe-area-inset-top))] z-30 lg:hidden"
      initial={{ opacity: 0, y: -18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="rounded-[1.45rem] border border-gold/20 bg-[#0d0c08]/90 p-1 shadow-[0_18px_42px_rgba(0,0,0,0.46),inset_0_1px_1px_rgba(245,232,196,0.08)] md:rounded-[2rem] md:p-1.5">
        <div className="flex items-center gap-1.5 rounded-[1.12rem] bg-[#11100b]/90 px-2 py-1.5 shadow-[inset_0_1px_0_rgba(245,232,196,0.07)] md:gap-3 md:rounded-[1.55rem] md:px-3 md:py-2.5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-[#17130a] text-gold shadow-[inset_0_1px_1px_rgba(245,232,196,0.08)] md:h-16 md:w-16 md:rounded-[1.35rem]">
            <MobileIcon name="brand" className="h-9 w-9 md:h-14 md:w-14" />
          </div>

          <div className="min-w-[5.9rem] flex-shrink-0 md:min-w-[13rem]">
            <p className="font-cinzel text-[0.9rem] font-bold leading-none tracking-[0.08em] text-gold md:text-2xl">Historicus</p>
            <p className="mt-0.5 font-cinzel text-[0.5rem] uppercase leading-none tracking-[0.14em] text-gold/75 md:mt-1 md:text-[0.74rem]">
              Europa Temporis
            </p>
          </div>

          <label className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-gold/20 bg-[#090806]/90 px-2.5 py-2 text-parchment-500 shadow-[inset_0_1px_0_rgba(245,232,196,0.04)] md:gap-3 md:px-5 md:py-3.5">
            <MobileIcon name="search" className="h-4 w-4 flex-shrink-0 text-gold/70 md:h-6 md:w-6" />
            <input
              value={listSearch}
              onChange={(event) => onSearchChange(event.target.value)}
              onFocus={onOpenSearch}
              placeholder="Search places, events..."
              className="min-w-0 flex-1 bg-transparent font-garamond text-[0.82rem] text-parchment-200 outline-none placeholder:text-parchment-600 md:text-xl"
            />
          </label>

          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open navigation"
            className="group flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-[#11100a] text-gold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] md:h-16 md:w-16 md:rounded-[1.35rem]"
          >
            <MobileIcon name="menu" className="h-6 w-6 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-active:scale-95 md:h-9 md:w-9" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DesktopAtlasHeader({
  listSearch,
  onSearchChange,
  onOpenSearch,
  onOpenMenu,
  onOpenChat,
}: {
  listSearch: string;
  onSearchChange: (value: string) => void;
  onOpenSearch: () => void;
  onOpenMenu: () => void;
  onOpenChat: () => void;
}) {
  return (
    <motion.div
      className="pointer-events-auto absolute left-6 right-6 top-6 z-30 hidden lg:block xl:left-8 xl:right-8 xl:top-7"
      initial={{ opacity: 0, y: -18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="mx-auto grid max-w-[1360px] grid-cols-[300px_minmax(280px,1fr)_260px_72px] items-center gap-3 xl:grid-cols-[330px_minmax(360px,1fr)_320px_82px] xl:gap-5">
        <div className="rounded-[2rem] border border-gold/20 bg-[#0d0c08]/90 p-1.5 shadow-[0_18px_42px_rgba(0,0,0,0.46),inset_0_1px_1px_rgba(245,232,196,0.08)]">
          <div className="flex h-[4.65rem] items-center gap-4 rounded-[1.55rem] bg-[#11100b]/90 px-4 shadow-[inset_0_1px_0_rgba(245,232,196,0.07)]">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[1.2rem] border border-gold/20 bg-[#17130a] text-gold shadow-[inset_0_1px_1px_rgba(245,232,196,0.08)]">
              <MobileIcon name="brand" className="h-12 w-12" />
            </div>
            <div className="min-w-0">
              <p className="font-cinzel text-[1.5rem] font-bold leading-none tracking-[0.12em] text-gold">Historicus</p>
              <p className="mt-1 font-cinzel text-[0.7rem] uppercase leading-none tracking-[0.24em] text-gold/70">
                Europa Temporis
              </p>
            </div>
          </div>
        </div>

        <label className="rounded-[2rem] border border-gold/20 bg-[#0d0c08]/90 p-1.5 shadow-[0_18px_42px_rgba(0,0,0,0.42),inset_0_1px_1px_rgba(245,232,196,0.08)]">
          <div className="flex h-[4.65rem] items-center gap-4 rounded-[1.55rem] bg-[#080705]/92 px-7 shadow-[inset_0_1px_0_rgba(245,232,196,0.06)]">
            <MobileIcon name="search" className="h-6 w-6 flex-shrink-0 text-gold/70" />
            <input
              value={listSearch}
              onChange={(event) => onSearchChange(event.target.value)}
              onFocus={onOpenSearch}
              placeholder="Search places, events..."
              className="min-w-0 flex-1 bg-transparent font-garamond text-[1.2rem] text-parchment-200 outline-none placeholder:text-parchment-600"
            />
          </div>
        </label>

        <button
          type="button"
          onClick={onOpenChat}
          className="group rounded-[2rem] border border-gold/25 bg-gold/95 p-1.5 text-left text-ink shadow-[0_18px_42px_rgba(0,0,0,0.42),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <div className="flex h-[4.65rem] items-center justify-between gap-4 rounded-[1.55rem] bg-[#d7b755] px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
            <div>
              <p className="font-cinzel text-[0.78rem] uppercase tracking-[0.2em] text-ink/60">Chatbot</p>
              <p className="mt-1 font-cinzel text-lg font-bold leading-none tracking-[0.08em]">Ask Historicus</p>
            </div>
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#0d0a06] text-gold transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-0.5">
              <MobileIcon name="send" className="h-6 w-6" />
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation"
          className="group rounded-[2rem] border border-gold/20 bg-[#0d0c08]/90 p-1.5 text-gold shadow-[0_18px_42px_rgba(0,0,0,0.42),inset_0_1px_1px_rgba(245,232,196,0.08)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
        >
          <span className="flex h-[4.65rem] items-center justify-center rounded-[1.55rem] bg-[#11100a] shadow-[inset_0_1px_0_rgba(245,232,196,0.06)]">
            <MobileIcon name="menu" className="h-9 w-9 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105" />
          </span>
        </button>
      </div>
    </motion.div>
  );
}

function MobileCompassOverlay() {
  return (
    <motion.div
      className="pointer-events-none absolute left-5 top-[8.8rem] z-20 hidden text-gold min-[360px]:block md:left-12 md:top-[9.75rem]"
      initial={{ opacity: 0, x: -18, filter: "blur(8px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay: 0.18, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="relative flex h-28 w-28 items-center justify-center opacity-80 md:h-36 md:w-36">
        <svg viewBox="0 0 112 112" className="h-28 w-28 md:h-36 md:w-36" aria-hidden="true" fill="none">
          <circle cx="56" cy="56" r="29" stroke="currentColor" strokeWidth="0.8" opacity=".22" />
          <path d="M56 9 62.5 51.5 103 56 62.5 60.5 56 103 49.5 60.5 9 56 49.5 51.5 56 9Z" stroke="currentColor" strokeWidth="0.9" opacity=".45" />
          <path d="M56 22 60.1 52 90 56 60.1 60 56 90 51.9 60 22 56 51.9 52 56 22Z" fill="currentColor" opacity=".18" />
          <path d="M56 34v44M34 56h44" stroke="currentColor" strokeWidth="1" opacity=".45" />
          <text x="56" y="16" textAnchor="middle" className="fill-current font-cinzel text-[10px] font-bold">N</text>
        </svg>
      </div>
      <div className="-mt-1 ml-1 flex w-24 flex-col items-center gap-1 md:w-32">
        <p className="font-cinzel text-sm tracking-[0.12em] text-gold md:text-base">500 km</p>
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
      className="pointer-events-auto absolute inset-x-0 bottom-[5.95rem] z-30 lg:hidden"
      initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.95, delay: 0.22, ease: [0.32, 0.72, 0, 1] }}
      aria-label="Mobile atlas navigation"
    >
      <div className="relative border-y border-gold/15 bg-[#0b0a07]/95 shadow-[0_-22px_55px_rgba(0,0,0,0.56),inset_0_1px_0_rgba(245,232,196,0.04)]">
        <div className="absolute left-1/2 top-0 h-8 w-32 -translate-x-1/2 -translate-y-[58%] rounded-t-[3rem] border-x border-t border-gold/15 bg-[#0b0a07]/95 md:h-10 md:w-44" />
        <div className="relative mx-auto grid h-[4.25rem] max-w-[30rem] grid-cols-5 px-2 pt-2 md:h-[6.1rem] md:max-w-[920px] md:px-7 md:pt-3">
          {mobileNavItems.map((item) => {
            const selected = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                className={`group mx-auto flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 text-gold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] md:gap-2 md:rounded-[1.35rem] md:px-4 ${
                  selected
                    ? "w-full border border-gold/25 bg-gold/10 shadow-[inset_0_1px_0_rgba(245,232,196,0.07)]"
                    : "w-full text-gold/70"
                }`}
              >
                <MobileIcon name={item.id} className={`h-5 w-5 md:h-7 md:w-7 ${selected ? "text-gold" : "text-gold/70"}`} />
                <span className="w-full truncate text-center font-cinzel text-[0.48rem] uppercase tracking-[0.06em] md:text-[0.68rem] md:tracking-[0.14em]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}

function DesktopBottomNavigation({
  active,
  onChange,
}: {
  active: MobileTab;
  onChange: (tab: MobileTab) => void;
}) {
  return (
    <motion.nav
      className="pointer-events-auto absolute bottom-8 left-1/2 z-30 hidden w-[min(760px,calc(100vw-4rem))] lg:block"
      style={{ x: "-50%" }}
      initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.95, delay: 0.18, ease: [0.32, 0.72, 0, 1] }}
      aria-label="Desktop atlas navigation"
    >
      <div className="rounded-[2.15rem] border border-gold/18 bg-[#0b0a07]/92 p-1.5 shadow-[0_-18px_54px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(245,232,196,0.06)]">
        <div className="grid h-[5.4rem] grid-cols-5 gap-1 rounded-[1.75rem] bg-[#080705]/88 p-2 shadow-[inset_0_1px_0_rgba(245,232,196,0.04)]">
          {mobileNavItems.map((item) => {
            const selected = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                className={`group flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-[1.35rem] px-3 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${
                  selected
                    ? "border border-gold/25 bg-gold/10 text-gold shadow-[inset_0_1px_0_rgba(245,232,196,0.08)]"
                    : "text-gold/60 hover:bg-gold/10 hover:text-gold/85"
                }`}
              >
                <MobileIcon name={item.id} className="h-6 w-6" />
                <span className="w-full truncate text-center font-cinzel text-[0.62rem] uppercase tracking-[0.15em]">{item.label}</span>
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
    <div className="pointer-events-auto absolute inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 lg:hidden">
      <motion.button
        type="button"
        onClick={onOpen}
        className="w-full rounded-[1.7rem] border border-gold/25 bg-[#0c0b08]/95 p-1 text-left shadow-[0_-12px_44px_rgba(0,0,0,0.58),inset_0_1px_1px_rgba(245,232,196,0.06)] md:rounded-[2rem] md:p-1.5"
        initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, delay: 0.32, ease: [0.32, 0.72, 0, 1] }}
        whileTap={{ scale: 0.985 }}
      >
        <div className="flex h-16 items-center gap-1.5 rounded-[1.45rem] border border-gold/10 bg-[#11100c] px-2 shadow-[inset_0_1px_0_rgba(245,232,196,0.05)] md:h-[4.85rem] md:gap-3 md:rounded-[1.55rem] md:px-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gold/15 bg-[#090806] text-gold shadow-[inset_0_1px_0_rgba(245,232,196,0.05)] md:h-14 md:w-14">
            <MobileIcon name="chronicles" className="h-6 w-6 md:h-7 md:w-7" />
          </div>
          <div className="flex min-w-0 flex-1 items-center rounded-full bg-[#080705] px-3 py-3 md:px-6 md:py-4">
            <span className="truncate font-garamond text-[0.92rem] font-semibold text-parchment-600 md:text-xl">
              Ask anything about history...
            </span>
          </div>
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] md:h-14 md:w-14">
            <MobileIcon name="send" className="h-6 w-6 md:h-7 md:w-7" />
          </div>
        </div>
      </motion.button>
    </div>
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
  const [mobileTab, setMobileTab] = useState<MobileTab>("map");
  const isDesktop = useMediaQuery("(min-width: 1024px)", true);

  const { streamState, ask, followUp, reset, hasHistory } = useConversation();

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

      {/* ── Map ───────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ x: mapOffset }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
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
        background: "radial-gradient(ellipse at center, transparent 46%, rgba(13,10,6,0.28) 76%, rgba(13,10,6,0.58) 100%)"
      }} />
      <div className="absolute inset-0 z-10 pointer-events-none sm:hidden" style={{
        background: "linear-gradient(180deg, rgba(13,10,6,0.48) 0%, transparent 20%, transparent 58%, rgba(13,10,6,0.62) 100%)"
      }} />

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
      <DesktopAtlasHeader
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
        onOpenChat={() => {
          setMobileTab("chronicles");
          setChatOpen(true);
        }}
      />
      <MobileCompassOverlay />

      {/* ── Geocoding spinner ─────────────────────────────── */}
      <AnimatePresence>
        {isGeocoding && (
          <motion.div
            className="absolute left-1/2 top-1/2 z-30 pointer-events-none"
            style={{ x: "-50%", y: "-50%" }}
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
            className="absolute inset-x-0 bottom-[7.5rem] z-30 mx-auto w-full max-w-sm px-4 lg:inset-x-auto lg:bottom-auto lg:right-8 lg:top-32 lg:max-w-xs"
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
                <MobileIcon name="search" className="h-3.5 w-3.5 text-gold/50" />
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
                <MobileIcon name="map" className="h-3.5 w-3.5" /> Map
              </motion.button>
            </div>

            {/* Country grid */}
            <div className="relative h-[calc(100%-142px)] overflow-y-auto p-4 sm:h-[calc(100%-88px)]">
              <div className="grid grid-cols-1 gap-2 min-[390px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredCountries.map((country, i) => {
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
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-gold/10 font-cinzel text-sm text-gold">
                          {country.slice(0, 1)}
                        </span>
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

      <AnimatePresence>
        {!chatOpen && viewMode === "map" && (
          <>
            <MobileBottomNavigation active={mobileTab} onChange={handleMobileTabChange} />
            <DesktopBottomNavigation active={mobileTab} onChange={handleMobileTabChange} />
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
    </main>
  );
}
