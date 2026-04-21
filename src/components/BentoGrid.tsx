import { motion } from "framer-motion";
import { Scroll, Sword, Coins, Crown, Shield, Wheat, Church, Ship, Scale, Flame, Star } from "lucide-react";
import { BorderBeam } from "./ui/border-beam";

interface BentoGridProps {
  facts: string[];
}

const ICONS = [Scroll, Sword, Coins, Crown, Shield, Wheat, Church, Ship, Scale, Flame, Star];

const COLORS = [
  // Deep gold
  "from-gold/25 to-amber-900/20 border-gold/35",
  // Forest green
  "from-emerald-900/35 to-emerald-950/15 border-emerald-700/25",
  // Slate blue
  "from-slate-700/30 to-slate-900/20 border-slate-600/25",
  // Deep burgundy
  "from-rose-900/30 to-rose-950/15 border-rose-800/25",
  // Rich purple
  "from-violet-900/25 to-violet-950/10 border-violet-700/20",
  // Bronze
  "from-amber-800/25 to-amber-950/10 border-amber-700/20",
];

const BEAM_COLORS = [
  { from: "#C9A84C", to: "transparent" },
  { from: "#10b981", to: "transparent" },
  { from: "#64748b", to: "transparent" },
  { from: "#e11d48", to: "transparent" },
  { from: "#7c3aed", to: "transparent" },
  { from: "#d97706", to: "transparent" },
];

function parseFact(raw: string): { title: string; body: string } {
  const colonIdx = raw.indexOf(":");
  if (colonIdx > -1) {
    return {
      title: raw.slice(0, colonIdx).replace(/\*\*/g, "").trim(),
      body: raw.slice(colonIdx + 1).trim(),
    };
  }
  return { title: "Fact", body: raw };
}

export function BentoGrid({ facts }: BentoGridProps) {
  if (!facts.length) return null;

  return (
    <div className="mt-5">
      <h4 className="font-cinzel text-xs font-semibold text-gold/80 uppercase tracking-widest mb-3">
        Chronicle Fragments
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {facts.map((raw, i) => {
          const { title, body } = parseFact(raw);
          const Icon = ICONS[i % ICONS.length];
          const colorClass = COLORS[i % COLORS.length];
          const beamColor = BEAM_COLORS[i % BEAM_COLORS.length];

          return (
            <motion.div
              key={i}
              className={`relative rounded-lg border bg-gradient-to-br ${colorClass} py-4 px-4 overflow-hidden`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
            >
              {/* BorderBeam traveling light */}
              <BorderBeam
                size={120}
                duration={6 + i * 0.8}
                delay={i * 0.5}
                colorFrom={beamColor.from}
                colorTo={beamColor.to}
              />

              {/* Beam shimmer overlay */}
              <div className="absolute inset-0 beam-gradient pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-gold/80 flex-shrink-0" />
                  </div>
                  <span className="font-cinzel text-[10px] font-bold text-gold uppercase tracking-wider leading-tight">
                    {title}
                  </span>
                </div>
                <p className="font-garamond text-xs text-parchment-300 leading-relaxed">
                  {body}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
