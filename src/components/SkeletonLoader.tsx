import { motion } from "framer-motion";
import { Skeleton } from "./ui/skeleton";

export function SkeletonLoader() {
  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Paragraph skeletons */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[95%]" />
        <Skeleton className="h-3 w-[88%]" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[92%]" />
      </div>

      <div className="h-3" />

      <div className="space-y-2">
        <Skeleton className="h-3 w-[90%]" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[85%]" />
        <Skeleton className="h-3 w-[97%]" />
        <Skeleton className="h-3 w-[80%]" />
      </div>

      <div className="h-3" />

      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[93%]" />
        <Skeleton className="h-3 w-[87%]" />
        <Skeleton className="h-3 w-[75%]" />
      </div>

      {/* Timeline skeleton */}
      <div className="mt-4">
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Bento skeleton */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-gold/10 p-3 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-2 w-[80%]" />
          </div>
        ))}
      </div>

      {/* Pulsing dot indicator */}
      <div className="flex items-center gap-2 mt-2">
        <motion.div
          className="w-2 h-2 rounded-full bg-gold"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <span className="font-garamond text-xs text-parchment-600 italic">
          Consulting the chronicles…
        </span>
      </div>
    </motion.div>
  );
}
