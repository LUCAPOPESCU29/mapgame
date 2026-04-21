import { motion } from "framer-motion";

interface TimelineBarProps {
  era: string;
}

const TIMELINE_ERAS = [
  { label: "Ancient", start: -800, end: 500 },
  { label: "Medieval", start: 500, end: 1400 },
  { label: "Renaissance", start: 1400, end: 1600 },
  { label: "Early Modern", start: 1600, end: 1800 },
  { label: "Modern", start: 1800, end: 1950 },
  { label: "Contemporary", start: 1950, end: 2000 },
];

function guessYear(era: string): number | null {
  const lower = era.toLowerCase();
  const yearMatch = era.match(/(-?\d{3,4})/);
  if (yearMatch) return parseInt(yearMatch[1]);

  if (lower.includes("roman empire") || lower.includes("ancient rome")) return 100;
  if (lower.includes("medieval")) return 900;
  if (lower.includes("renaissance")) return 1450;
  if (lower.includes("viking")) return 900;
  if (lower.includes("byzantine")) return 800;
  if (lower.includes("napoleon")) return 1805;
  if (lower.includes("ww1") || lower.includes("world war i") || lower.includes("world war 1")) return 1916;
  if (lower.includes("ww2") || lower.includes("world war ii") || lower.includes("world war 2")) return 1942;
  if (lower.includes("ottoman")) return 1500;
  if (lower.includes("exploration") || lower.includes("discovery")) return 1490;
  if (lower.includes("ancient greece") || lower.includes("greek")) return -400;
  if (lower.includes("cold war")) return 1960;
  return null;
}

function yearToPercent(year: number): number {
  const MIN = -800;
  const MAX = 2000;
  return Math.max(0, Math.min(100, ((year - MIN) / (MAX - MIN)) * 100));
}

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BC`;
  return `${year} AD`;
}

export function TimelineBar({ era }: TimelineBarProps) {
  const year = guessYear(era);
  const activePercent = year !== null ? yearToPercent(year) : null;

  return (
    <div className="mt-4 mb-2">
      <div className="flex justify-between text-xs font-cinzel text-parchment-600 mb-2">
        <span>800 BC</span>
        <span className="text-gold font-semibold">
          {year !== null ? formatYear(year) : era}
        </span>
        <span>2000 AD</span>
      </div>

      <div className="relative h-2 rounded-full bg-ink-muted overflow-visible">
        {/* Era segments */}
        {TIMELINE_ERAS.map((segment, i) => (
          <div
            key={i}
            className="absolute top-0 h-full"
            style={{
              left: `${yearToPercent(segment.start)}%`,
              width: `${yearToPercent(segment.end) - yearToPercent(segment.start)}%`,
              backgroundColor: `hsl(${30 + i * 15}, 30%, ${15 + i * 3}%)`,
            }}
          />
        ))}

        {/* Gold progress bar */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #5a4212 0%, #C9A84C 100%)",
          }}
          initial={{ width: 0 }}
          animate={{ width: activePercent !== null ? `${activePercent}%` : "50%" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />

        {/* Active dot */}
        {activePercent !== null && (
          <motion.div
            className="timeline-era-dot"
            style={{ left: `${activePercent}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.3 }}
          />
        )}
      </div>

      {/* Era labels */}
      <div className="flex justify-between mt-1">
        {TIMELINE_ERAS.map((segment, i) => (
          <span
            key={i}
            className="text-[9px] font-garamond text-parchment-700 hidden sm:block"
            style={{ flex: 1, textAlign: "center" }}
          >
            {segment.label}
          </span>
        ))}
      </div>
    </div>
  );
}
