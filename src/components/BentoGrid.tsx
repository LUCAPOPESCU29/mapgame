import { motion } from "framer-motion";
import { Scroll, Sword, Coins } from "lucide-react";

interface BentoGridProps {
  facts: string[];
}

const ICONS = [Scroll, Sword, Coins];
const COLORS = [
  "from-gold/20 to-gold/5 border-gold/30",
  "from-parchment-800/40 to-parchment-900/20 border-parchment-700/30",
  "from-amber-900/30 to-amber-950/10 border-amber-700/20",
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

          return (
            <motion.div
              key={i}
              className={`relative rounded-lg border bg-gradient-to-br ${colorClass} p-3 overflow-hidden`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
            >
              {/* Beam shimmer */}
              <div className="absolute inset-0 beam-gradient pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-gold/70 flex-shrink-0" />
                  <span className="font-cinzel text-[10px] font-semibold text-gold/90 uppercase tracking-wider leading-tight">
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
