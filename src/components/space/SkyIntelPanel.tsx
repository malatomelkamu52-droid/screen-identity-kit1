import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { SkyObject } from "@/lib/deep-sky";

const KIND_LABEL: Record<SkyObject["kind"], string> = {
  star: "Star",
  nebula: "Nebula",
  galaxy: "Galaxy",
  cluster: "Star cluster",
};

/**
 * Right-side celestial intelligence panel for catalogued deep-sky objects.
 * Values come straight from the published catalogue in @/lib/deep-sky.
 */
export default function SkyIntelPanel({
  object,
  onClose,
  className = "",
}: {
  object: SkyObject;
  onClose: () => void;
  className?: string;
}) {
  const rows: [string, string][] = [
    ["TYPE", KIND_LABEL[object.kind]],
    ["MAGNITUDE", object.mag.toFixed(2)],
    ["DISTANCE", object.distance],
    ["CONSTELLATION", object.constellation],
    ...(object.catalog ? ([["CATALOG", object.catalog]] as [string, string][]) : []),
    ...(object.spectralType
      ? ([["SPECTRAL TYPE", object.spectralType]] as [string, string][])
      : []),
    ...(object.temperatureK
      ? ([["TEMPERATURE", `${object.temperatureK.toLocaleString()} K`]] as [string, string][])
      : []),
    ...(object.radiusSolar ? ([["RADIUS", `${object.radiusSolar} R☉`]] as [string, string][]) : []),
    ...(object.massSolar ? ([["MASS", `${object.massSolar} M☉`]] as [string, string][]) : []),
  ];

  return (
    <motion.aside
      key={object.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={`glass hud-scroll absolute inset-y-4 right-4 z-40 w-[min(340px,90%)] overflow-y-auto p-5 ${className}`}
    >
      <button
        onClick={onClose}
        aria-label="Close celestial intelligence"
        className="absolute right-3 top-3 grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
      >
        <X size={15} />
      </button>

      <span className="hud-eyebrow text-cyan">Celestial intelligence</span>
      <h3 className="mb-0.5 mt-1.5 pr-8 text-[19px] font-semibold leading-snug tracking-tight">
        {object.name}
      </h3>
      <p className="font-mono text-[11px] tracking-[0.12em] text-cyan/80">{object.designation}</p>

      <div className="mt-4 flex items-center gap-2 font-mono text-[9px] tracking-[0.14em]">
        <span className="flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/10 px-2.5 py-1 text-signal">
          <i className="size-1.5 rounded-full bg-signal" /> REAL DATA
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-muted-foreground">
          {KIND_LABEL[object.kind].toUpperCase()}
        </span>
      </div>

      <dl className="mt-4 space-y-px border-t border-white/[0.06] pt-1">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 border-b border-white/[0.05] py-2">
            <dt className="hud-eyebrow">{k}</dt>
            <dd className="max-w-[62%] text-right font-mono text-[11px] text-foreground/90">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <span className="hud-eyebrow text-cyan">Description</span>
        <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
          {object.description}
        </p>
      </div>

      <p className="mt-4 border-t border-white/[0.06] pt-3 font-mono text-[9px] leading-relaxed tracking-[0.1em] text-muted-foreground">
        SOURCE · SIMBAD / HIPPARCOS / MESSIER CATALOGUE · POSITIONS J2000
      </p>
    </motion.aside>
  );
}
