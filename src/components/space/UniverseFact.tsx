import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { UNIVERSE_FACTS } from "@/lib/deep-sky";

/** Small floating card cycling through astronomy facts. */
export default function UniverseFact({
  onExplore,
  className = "",
}: {
  onExplore: () => void;
  className?: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % UNIVERSE_FACTS.length), 9000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`glass w-[280px] p-4 ${className}`}>
      <span className="hud-eyebrow flex items-center gap-1.5 text-cyan">
        <Sparkles size={11} /> Universe fact
      </span>
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
          className="mt-2 min-h-[3.4em] text-[12px] leading-relaxed text-muted-foreground"
        >
          {UNIVERSE_FACTS[i]}
        </motion.p>
      </AnimatePresence>
      <button
        onClick={onExplore}
        className="mt-2 font-mono text-[10px] tracking-[0.16em] text-cyan transition-opacity hover:opacity-75"
      >
        EXPLORE DEEP SPACE →
      </button>
    </div>
  );
}
