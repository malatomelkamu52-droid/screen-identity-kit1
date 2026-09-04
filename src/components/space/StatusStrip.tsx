import { Activity, AlertTriangle, ChevronDown, Database, Rocket, ShieldCheck, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { loadDashboardSummary, type DashboardCard, type DashboardSummary } from "@/services/space/summary";
import type { DataState } from "@/lib/space-types";

const STATE_STYLE: Record<DataState, string> = {
  LIVE: "border-signal/40 bg-signal/10 text-signal",
  SIMULATED: "border-gold/30 bg-gold/10 text-gold",
  OFFLINE: "border-white/10 bg-white/[0.04] text-muted-foreground",
};

const CARD_ICON: Record<string, typeof Activity> = {
  objects: Database,
  missions: Rocket,
  weather: Sun,
  neo: AlertTriangle,
  system: ShieldCheck,
};

export default function StatusStrip({
  issLive,
  onOpenView,
}: {
  issLive: boolean;
  onOpenView: (viewKey: string) => void;
}) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadDashboardSummary()
      .then((envelope) => {
        if (cancelled) return;
        setSummary(envelope.data);
        setUpdatedAt(envelope.updatedAt);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const stamp = updatedAt ? new Date(updatedAt).toISOString().slice(11, 16) : "——:——";
  const dataState: DataState = failed ? "OFFLINE" : issLive ? "LIVE" : "SIMULATED";

  return (
    <div ref={rootRef} className="relative flex flex-col items-center">
      {/* Slim collapsed status pill */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle system metrics"
        className="pointer-events-auto flex max-w-[calc(100vw-1.5rem)] items-center gap-2.5 overflow-hidden rounded-full border border-white/[0.1] bg-[oklch(0.09_0.016_265_/_0.8)] px-3.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground shadow-lg backdrop-blur-xl transition-all hover:border-gold/45 hover:text-foreground"
      >
        <span className="flex shrink-0 items-center gap-1.5 text-signal">
          <i className="pulse-dot size-1.5 rounded-full bg-signal" />
          SYSTEM {failed ? "DEGRADED" : "ONLINE"}
        </span>
        <span className="hidden h-3 w-px shrink-0 bg-white/10 sm:block" />
        <span className="hidden shrink-0 sm:inline">
          <b className="font-medium text-foreground/90">
            {summary ? `${summary.objectsTracked.toLocaleString()}+` : "——"}
          </b>{" "}
          OBJECTS
        </span>
        <span className="hidden h-3 w-px shrink-0 bg-white/10 md:block" />
        <span className={`hidden shrink-0 rounded-full border px-2 py-0.5 text-[9px] md:inline ${STATE_STYLE[dataState]}`}>
          {dataState}
        </span>
        <span className="hidden shrink-0 lg:inline">{stamp} UTC</span>
        <ChevronDown size={12} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Expanded metric breakdown — floating popover, never a fixed banner */}
      {open && (
        <div className="pointer-events-auto absolute top-[calc(100%+8px)] z-50 w-[min(94vw,980px)] origin-top animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="glass p-2.5">
            <div className="hud-scroll flex gap-2 overflow-x-auto pb-1 xl:grid xl:grid-cols-5 xl:overflow-visible xl:pb-0">
              {!summary &&
                !failed &&
                Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="h-[64px] w-[170px] shrink-0 animate-pulse rounded-xl bg-white/[0.04] xl:w-auto" />
                ))}
              {failed && (
                <p className="p-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
                  SUMMARY SERVICE UNAVAILABLE
                </p>
              )}
              {summary?.cards.map((card) => (
                <IntelCard
                  key={card.id}
                  card={card}
                  onOpen={() => {
                    setOpen(false);
                    onOpenView(card.viewKey);
                  }}
                />
              ))}
            </div>
            <p className="px-1 pt-1 font-mono text-[9px] tracking-[0.14em] text-muted-foreground">
              LAST UPDATE {stamp} UTC · ISS TRACK {issLive ? "LIVE PROPAGATION" : "AWAITING FIX"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function IntelCard({ card, onOpen }: { card: DashboardCard; onOpen: () => void }) {
  const Icon = CARD_ICON[card.id] ?? Activity;
  return (
    <button
      onClick={onOpen}
      className="group flex w-[190px] shrink-0 flex-col items-start gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-left transition-all hover:-translate-y-px hover:border-gold/40 hover:bg-white/[0.06] xl:w-auto"
    >
      <span className="flex w-full items-center gap-1.5">
        <Icon size={12} className="text-gold" />
        <span className="hud-eyebrow truncate">{card.label}</span>
        <span
          className={`ml-auto shrink-0 rounded-full border px-1.5 font-mono text-[8px] tracking-[0.1em] ${STATE_STYLE[card.state]}`}
        >
          {card.state}
        </span>
      </span>
      <b className="font-mono text-[17px] font-medium tracking-tight text-foreground">{card.value}</b>
      <span className="w-full truncate text-[10px] text-muted-foreground">{card.detail}</span>
    </button>
  );
}
