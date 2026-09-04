import { AlertTriangle, Check, Copy, Database, Radio, RefreshCw, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { IntelligenceViewDefinition } from "@/lib/space-data";
import type { DataState } from "@/lib/space-types";
import { loadIntelligenceView } from "@/services/space/intelligence";

const STATE_STYLE: Record<DataState, string> = {
  LIVE: "border-signal/40 bg-signal/10 text-signal",
  SIMULATED: "border-gold/30 bg-gold/10 text-gold",
  OFFLINE: "border-white/10 bg-white/[0.04] text-muted-foreground",
};

export default function IntelModal({
  viewKey,
  onOpenChange,
}: {
  viewKey: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [definition, setDefinition] = useState<IntelligenceViewDefinition | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [dataState, setDataState] = useState<DataState>("SIMULATED");
  const [source, setSource] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    setQuery("");
    setFilter("ALL");
  }, [viewKey]);

  useEffect(() => {
    if (!viewKey) return;
    let cancelled = false;
    setStatus("loading");
    setError(null);
    loadIntelligenceView(viewKey)
      .then((envelope) => {
        if (cancelled) return;
        setDefinition(envelope.data);
        setDataState(envelope.state);
        setSource(envelope.source);
        setUpdatedAt(envelope.updatedAt);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setDefinition(null);
        setDataState("OFFLINE");
        setError(err instanceof Error ? err.message : "Intelligence feed unavailable");
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [viewKey, nonce]);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  const copyRow = useCallback((row: string[], index: number) => {
    void navigator.clipboard?.writeText(row.join("  ·  "));
    setCopied(index);
    setTimeout(() => setCopied((c) => (c === index ? null : c)), 1400);
  }, []);

  const rows = useMemo(() => {
    if (!definition) return [];
    const q = query.trim().toLowerCase();
    return definition.rows.filter((row) => {
      const matchesQuery = !q || row.some((cell) => cell.toLowerCase().includes(q));
      const matchesFilter =
        filter === "ALL" || row.some((cell) => cell.toLowerCase().includes(filter.toLowerCase()));
      return matchesQuery && matchesFilter;
    });
  }, [definition, query, filter]);

  const stamp = updatedAt ? new Date(updatedAt).toISOString().slice(11, 19) : "——:——:——";

  return (
    <Dialog open={Boolean(viewKey)} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-[100dvh] max-h-[100dvh] w-full max-w-none translate-x-[-50%] translate-y-[-50%] gap-0 rounded-none border-0 bg-[#05070c]/92 p-0 text-foreground backdrop-blur-2xl [&>button.absolute]:hidden"
      >
        <div className="hud-scroll flex h-full min-h-0 flex-col overflow-y-auto">
          {/* HEADER */}
          <div className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#05070c]/85 px-4 py-4 backdrop-blur-2xl md:px-8">
            <div className="flex flex-wrap items-start gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] text-gold">
                    {definition?.category ?? "INTELLIGENCE"}
                  </span>
                  <span
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] ${STATE_STYLE[dataState]}`}
                  >
                    <i className="pulse-dot size-1.5 rounded-full bg-current" />
                    {status === "loading" ? "SYNCING" : (definition?.status ?? "SYSTEM NOMINAL")}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
                    {stamp} UTC
                  </span>
                </div>
                <DialogTitle className="mt-2 text-xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {definition?.title ?? viewKey ?? "Intelligence"}
                </DialogTitle>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={refresh}
                  aria-label="Refresh intelligence feed"
                  className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
                >
                  <RefreshCw size={12} className={status === "loading" ? "animate-spin" : ""} /> REFRESH
                </button>
                <DialogClose
                  aria-label="Close intelligence view"
                  className="grid size-10 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
                >
                  <X size={18} />
                </DialogClose>
              </div>
            </div>
          </div>

          {/* BODY */}
          {status === "loading" && <LoadingState />}
          {status === "error" && <ErrorState message={error ?? "Feed unavailable"} onRetry={refresh} />}

          {status === "ready" && definition && (
            <div className="grid gap-4 p-4 md:p-8 xl:grid-cols-3">
              {/* KPI CARDS */}
              <div className="grid gap-4 sm:grid-cols-2 xl:col-span-3 xl:grid-cols-4">
                {definition.metrics.slice(0, 4).map((metric) => (
                  <div key={metric.label} className="glass p-5">
                    <span className="hud-eyebrow">{metric.label}</span>
                    <div className="mt-2 font-mono text-[28px] font-medium leading-none tracking-tight text-foreground">
                      {metric.value}
                    </div>
                    {metric.detail && (
                      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{metric.detail}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* VISUAL MODEL */}
              <section className="glass overflow-hidden xl:col-span-2">
                <IntelligenceViewport definition={definition} />
              </section>

              {/* MISSION OVERVIEW */}
              <section className="glass p-5 md:p-6">
                <span className="hud-eyebrow">Mission overview</span>
                <h3 className="mt-1.5 text-[15px] font-semibold tracking-tight text-foreground">
                  Operational context
                </h3>
                <p className="mt-3 text-[12.5px] leading-6 text-foreground/80">{definition.definition}</p>
                <div className="mt-4 border-t border-white/[0.06] pt-4">
                  <span className="hud-eyebrow">Operational protocol</span>
                  <p className="mt-2 text-[12px] leading-6 text-muted-foreground">{definition.protocol}</p>
                </div>
              </section>

              {/* TELEMETRY TABLE */}
              <section className="glass overflow-hidden xl:col-span-2">
                <div className="flex flex-col gap-3 border-b border-white/[0.06] p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className="hud-eyebrow">Tracked feed</span>
                    <h3 className="mt-1 text-[15px] font-semibold tracking-tight text-foreground">
                      Telemetry &amp; event log
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label className="flex min-w-[190px] items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2">
                      <Search size={13} className="text-muted-foreground" />
                      <span className="sr-only">Search feed</span>
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search tracked items…"
                        className="w-full bg-transparent text-[12px] outline-none placeholder:text-muted-foreground"
                      />
                    </label>
                    {definition.filters && definition.filters.length > 0 && (
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="rounded-xl border border-white/[0.08] bg-[#090d16] px-3 py-2 font-mono text-[10px] tracking-[0.12em] text-foreground outline-none"
                        aria-label="Filter tracked feed"
                      >
                        {definition.filters.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className="hud-scroll overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-left">
                    <thead>
                      <tr>
                        {definition.columns.map((column) => (
                          <th
                            key={column}
                            className="px-4 py-3 font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
                          >
                            {column}
                          </th>
                        ))}
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr
                          key={`${row.join("-")}-${index}`}
                          className="group border-t border-white/[0.05] transition-colors hover:bg-white/[0.04]"
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={`${cell}-${cellIndex}`}
                              className={`px-4 py-3 font-mono text-[11px] ${
                                cellIndex === 0
                                  ? "text-foreground"
                                  : cellIndex === row.length - 1
                                    ? "text-signal"
                                    : "text-muted-foreground"
                              }`}
                            >
                              {cellIndex === 1 ? (
                                <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] tracking-[0.08em] text-foreground/80">
                                  {cell}
                                </span>
                              ) : (
                                cell
                              )}
                            </td>
                          ))}
                          <td className="pr-3 text-right">
                            <button
                              onClick={() => copyRow(row, index)}
                              aria-label="Copy row"
                              className="grid size-7 place-items-center rounded-lg text-muted-foreground opacity-0 transition-opacity hover:bg-white/[0.06] hover:text-gold group-hover:opacity-100"
                            >
                              {copied === index ? (
                                <Check size={12} className="text-signal" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {rows.length === 0 && (
                        <tr>
                          <td
                            colSpan={definition.columns.length + 1}
                            className="px-4 py-10 text-center font-mono text-[10px] tracking-[0.14em] text-muted-foreground"
                          >
                            NO MATCHING TELEMETRY
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-white/[0.06] px-4 py-2.5 font-mono text-[9px] tracking-[0.14em] text-muted-foreground">
                  SHOWING {rows.length} / {definition.rows.length} RECORDS
                </div>
              </section>

              {/* SYSTEM FEED + SOURCE */}
              <aside className="space-y-4">
                <section className="glass p-5">
                  <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
                    <Radio size={13} className="text-signal" />
                    <span className="hud-eyebrow">System feed</span>
                  </div>
                  <div className="pt-1">
                    {["EPHEMERIS INGEST", "CATALOG VALIDATION", "PROPAGATOR", "RISK / VISIBILITY ENGINE"].map(
                      (name, index) => (
                        <div
                          key={name}
                          className="flex items-center justify-between border-b border-white/[0.05] py-2.5 font-mono text-[10px] tracking-[0.1em]"
                        >
                          <span className="text-muted-foreground">{name}</span>
                          <span className="flex items-center gap-1.5 text-signal">
                            <i className="pulse-dot size-1.5 rounded-full bg-signal" />
                            {index === 2 ? "SGP4" : "NOMINAL"}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </section>

                <section className="glass p-5 text-[11px] leading-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Database size={13} className="text-gold" />
                    <span className="hud-eyebrow text-gold">Data source</span>
                  </div>
                  <p className="mt-2">
                    {source || "Reference catalog"} · state{" "}
                    <b className="font-mono text-foreground/85">{dataState}</b>
                    <br />
                    Last updated {stamp} UTC
                  </p>
                  <p className="mt-3 border-t border-white/[0.06] pt-3">
                    Figures marked SIMULATED are structured reference telemetry, not live provider data. The
                    celestial radar stays mounted underneath — closing returns to the active body and camera.
                  </p>
                </section>
              </aside>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LoadingState() {
  return (
    <div className="grid flex-1 gap-4 p-4 md:p-8 xl:grid-cols-3">
      <div className="grid gap-4 sm:grid-cols-2 xl:col-span-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-[112px] animate-pulse rounded-2xl bg-white/[0.04]" />
        ))}
      </div>
      <div className="h-[360px] animate-pulse rounded-2xl bg-white/[0.04] xl:col-span-2" />
      <div className="h-[360px] animate-pulse rounded-2xl bg-white/[0.04]" />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
      <AlertTriangle size={26} className="text-gold" />
      <p className="font-mono text-[12px] tracking-[0.14em] text-foreground">INTELLIGENCE FEED UNAVAILABLE</p>
      <p className="max-w-md text-[12px] leading-6 text-muted-foreground">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 font-mono text-[10px] tracking-[0.14em] text-gold hover:bg-gold/20"
      >
        <RefreshCw size={12} /> RETRY
      </button>
    </div>
  );
}

function IntelligenceViewport({ definition }: { definition: IntelligenceViewDefinition }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewRef = useRef({ x: 0, y: 0, zoom: 1, dragging: false, px: 0, py: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const started = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const hash = definition.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const draw = (time: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const t = (time - started) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(2, 7, 14, 0.96)";
      ctx.fillRect(0, 0, w, h);

      const cx = w * 0.52;
      const cy = h * 0.52;
      const scale = Math.min(w, h);
      ctx.strokeStyle = "rgba(80, 190, 230, 0.16)";
      ctx.lineWidth = 1;
      for (let r = 0.16; r <= 0.5; r += 0.11) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, scale * r, scale * r * 0.42, -0.12, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let i = 0; i < 7; i++) {
        const y = cy + (i - 3) * scale * 0.075;
        ctx.beginPath(); ctx.moveTo(cx - scale * 0.52, y); ctx.lineTo(cx + scale * 0.52, y); ctx.stroke();
      }

      const visual = definition.visual;
      const view = viewRef.current;
      const modelCx = cx + view.x;
      const modelCy = cy + view.y;
      const modelScale = scale * view.zoom;
      ctx.save();
      ctx.translate(cx + view.x, cy + view.y);
      ctx.rotate(view.x * 0.002);
      ctx.translate(-(cx + view.x), -(cy + view.y));
      if (["rocket", "launch", "spaceport"].includes(visual)) {
        drawLaunchScene(ctx, modelCx, modelCy, modelScale, t, hash, visual);
      } else if (["debris", "conjunction", "reentry"].includes(visual)) {
        drawDebrisScene(ctx, modelCx, modelCy, modelScale, t, hash, visual);
      } else if (["weather", "radio"].includes(visual)) {
        drawSignalScene(ctx, modelCx, modelCy, modelScale, t, hash, visual);
      } else if (["passes", "transit", "terminator"].includes(visual)) {
        drawObservationScene(ctx, modelCx, modelCy, modelScale, t, hash, visual);
      } else if (visual === "academy") {
        drawAcademyScene(ctx, modelCx, modelCy, modelScale, t);
      } else if (visual === "gnss") {
        drawGnssScene(ctx, modelCx, modelCy, modelScale, t);
      } else {
        drawOrbitalScene(ctx, modelCx, modelCy, modelScale, t, hash, visual);
      }
      ctx.restore();

      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "8px monospace";
      ctx.fillText(`VISUAL MODEL // ${visual.toUpperCase()}`, 14, 18);
      ctx.fillText(`FRAME ${Math.floor(t * 24).toString().padStart(6, "0")}`, 14, h - 12);
      ctx.fillText("INTERACTIVE RADAR", w - 116, h - 12);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); };
  }, [definition]);

  return (
    <div className="relative overflow-hidden border border-cyan/25 bg-background/40 shadow-[inset_0_0_80px_rgba(0,170,220,0.05)]">
      <canvas
        ref={canvasRef}
        className="block h-[320px] w-full cursor-grab touch-none md:h-[390px] active:cursor-grabbing"
        aria-label={`${definition.title} 3D intelligence visualization`}
        onPointerDown={(event) => {
          const view = viewRef.current;
          view.dragging = true;
          view.px = event.clientX;
          view.py = event.clientY;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const view = viewRef.current;
          if (!view.dragging) return;
          view.x = Math.max(-140, Math.min(140, view.x + event.clientX - view.px));
          view.y = Math.max(-100, Math.min(100, view.y + event.clientY - view.py));
          view.px = event.clientX;
          view.py = event.clientY;
        }}
        onPointerUp={(event) => {
          viewRef.current.dragging = false;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => { viewRef.current.dragging = false; }}
        onWheel={(event) => {
          event.preventDefault();
          const view = viewRef.current;
          view.zoom = Math.max(0.65, Math.min(1.7, view.zoom * (event.deltaY > 0 ? 0.92 : 1.08)));
        }}
      />
      <div className="pointer-events-none absolute left-3 bottom-3 flex gap-2 text-[8px] tracking-[0.12em] text-muted-foreground">
        <span className="border border-signal/30 bg-black/30 px-2 py-1">● LIVE MODEL</span>
        <span className="border border-cyan/30 bg-black/30 px-2 py-1">DRAG / ZOOM READY</span>
      </div>
    </div>
  );
}

function drawOrbitalScene(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, t: number, hash: number, visual: string) {
  const bodyR = s * 0.12;
  ctx.fillStyle = "rgba(65, 145, 190, 0.24)";
  ctx.beginPath(); ctx.arc(cx, cy, bodyR, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "rgba(110,220,255,0.55)"; ctx.stroke();
  const count = visual === "payload" ? 28 : visual === "satellite" ? 12 : 8;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + t * (0.12 + (hash % 7) * 0.008);
    const rx = s * (0.2 + (i % 4) * 0.075);
    const ry = rx * 0.42;
    const x = cx + Math.cos(a) * rx;
    const y = cy + Math.sin(a) * ry;
    const z = (Math.sin(a) + 1) / 2;
    ctx.fillStyle = `rgba(70, ${170 + Math.floor(z * 60)}, 235, ${0.35 + z * 0.6})`;
    ctx.fillRect(x - 1.5, y - 1.5, 3 + z * 2, 3 + z * 2);
    if (i % 3 === 0) {
      ctx.strokeStyle = "rgba(80,200,255,0.18)";
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
    }
  }
  ctx.fillStyle = "rgba(250,204,21,0.85)";
  ctx.fillRect(cx - 2, cy - 2, 4, 4);
}

function drawDebrisScene(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, t: number, hash: number, visual: string) {
  const n = visual === "conjunction" ? 42 : 105;
  for (let i = 0; i < n; i++) {
    const a = ((i * 137.5 + hash) * Math.PI) / 180 + t * 0.025;
    const r = s * (0.12 + ((i * 47) % 100) / 100 * 0.39);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r * 0.4;
    const size = 0.8 + ((i * 13) % 4) * 0.5;
    ctx.fillStyle = i % 17 === 0 ? "rgba(255,185,90,0.9)" : "rgba(110,190,230,0.55)";
    ctx.fillRect(x, y, size, size);
  }
  if (visual === "conjunction") {
    const a = t * 0.3;
    const x1 = cx + Math.cos(a) * s * 0.4, y1 = cy + Math.sin(a) * s * 0.17;
    const x2 = cx + Math.cos(a + Math.PI) * s * 0.32, y2 = cy + Math.sin(a + Math.PI) * s * 0.13;
    ctx.strokeStyle = "rgba(255,190,80,0.8)"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.fillStyle = "rgba(255,190,80,0.95)"; ctx.fillRect(x1 - 3, y1 - 3, 6, 6); ctx.fillRect(x2 - 3, y2 - 3, 6, 6);
  }
}

function drawSignalScene(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, t: number, hash: number, visual: string) {
  ctx.strokeStyle = "rgba(80,210,245,0.75)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) {
    const amp = s * (0.04 + i * 0.018);
    const y0 = cy - s * 0.12 + i * s * 0.06;
    ctx.beginPath();
    for (let x = -s * 0.48; x <= s * 0.48; x += 5) {
      const y = y0 + Math.sin(x * 0.045 + t * (2 + i * 0.3)) * amp * 0.22;
      x === -s * 0.48 ? ctx.moveTo(cx + x, y) : ctx.lineTo(cx + x, y);
    }
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(250,204,21,0.85)";
  ctx.beginPath(); ctx.arc(cx, cy + s * 0.18, s * 0.035, 0, Math.PI * 2); ctx.fill();
  if (visual === "weather") {
    ctx.fillStyle = "rgba(120,190,255,0.28)"; ctx.beginPath(); ctx.arc(cx, cy, s * 0.16, 0, Math.PI * 2); ctx.fill();
  }
}

function drawObservationScene(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, t: number, hash: number, visual: string) {
  const earth = s * 0.14;
  ctx.fillStyle = "rgba(50,130,190,0.3)"; ctx.beginPath(); ctx.arc(cx, cy, earth, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "rgba(80,210,245,0.45)"; ctx.beginPath(); ctx.ellipse(cx, cy, s * 0.34, s * 0.14, -0.15, 0, Math.PI * 2); ctx.stroke();
  const a = t * 0.7 + hash;
  const sx = cx + Math.cos(a) * s * 0.34;
  const sy = cy + Math.sin(a) * s * 0.14;
  ctx.fillStyle = "rgba(255,210,90,0.95)"; ctx.fillRect(sx - 3, sy - 3, 6, 6);
  ctx.strokeStyle = visual === "terminator" ? "rgba(255,170,80,0.7)" : "rgba(100,220,255,0.6)";
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(sx, sy); ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const p = i / 11; const px = cx + (sx - cx) * p; const py = cy + (sy - cy) * p;
    ctx.fillStyle = `rgba(120,220,255,${0.15 + p * 0.5})`; ctx.fillRect(px, py, 2, 2);
  }
}

function drawLaunchScene(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, t: number, hash: number, visual: string) {
  const padY = cy + s * 0.24;
  ctx.strokeStyle = "rgba(100,180,210,0.55)"; ctx.beginPath(); ctx.moveTo(cx - s * 0.35, padY); ctx.lineTo(cx + s * 0.35, padY); ctx.stroke();
  ctx.fillStyle = "rgba(110,190,220,0.18)"; ctx.fillRect(cx - s * 0.28, padY, s * 0.56, s * 0.08);
  const rocketY = padY - s * (0.18 + ((Math.sin(t * 0.7) + 1) * 0.04));
  ctx.fillStyle = "rgba(220,225,230,0.85)"; ctx.fillRect(cx - s * 0.025, rocketY - s * 0.22, s * 0.05, s * 0.22);
  ctx.beginPath(); ctx.moveTo(cx - s * 0.025, rocketY - s * 0.22); ctx.lineTo(cx, rocketY - s * 0.29); ctx.lineTo(cx + s * 0.025, rocketY - s * 0.22); ctx.fill();
  ctx.fillStyle = "rgba(255,175,65,0.8)"; ctx.beginPath(); ctx.moveTo(cx - s * 0.02, rocketY); ctx.lineTo(cx, rocketY + s * 0.1); ctx.lineTo(cx + s * 0.02, rocketY); ctx.fill();
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = `rgba(120,210,245,${0.12 + i * 0.05})`;
    ctx.fillRect(cx + (i - 3) * 6, padY - i * 3, 2, 2);
  }
  if (visual === "spaceport") {
    ctx.strokeStyle = "rgba(80,210,245,0.35)";
    ctx.strokeRect(cx - s * 0.28, cy - s * 0.1, s * 0.12, s * 0.34);
    ctx.strokeRect(cx + s * 0.16, cy - s * 0.06, s * 0.08, s * 0.3);
  }
}

function drawGnssScene(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, t: number) {
  ctx.fillStyle = "rgba(70,150,210,0.28)"; ctx.beginPath(); ctx.arc(cx, cy, s * 0.11, 0, Math.PI * 2); ctx.fill();
  for (let plane = 0; plane < 3; plane++) {
    ctx.strokeStyle = "rgba(100,210,245,0.38)"; ctx.beginPath();
    ctx.ellipse(cx, cy, s * (0.23 + plane * 0.07), s * (0.1 + plane * 0.03), plane * 0.5, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + t * (0.06 + plane * 0.02);
      const rx = s * (0.23 + plane * 0.07), ry = s * (0.1 + plane * 0.03);
      ctx.fillStyle = "rgba(100,220,255,0.8)"; ctx.fillRect(cx + Math.cos(a) * rx - 2, cy + Math.sin(a) * ry - 2, 4, 4);
    }
  }
}

function drawAcademyScene(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, t: number) {
  ctx.strokeStyle = "rgba(90,210,245,0.65)"; ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = -s * 0.42; x <= s * 0.42; x += 4) {
    const y = cy + Math.sin(x * 0.018 + t * 0.6) * s * 0.12 + (x * x) / (s * 3.5);
    x === -s * 0.42 ? ctx.moveTo(cx + x, y) : ctx.lineTo(cx + x, y);
  }
  ctx.stroke();
  ctx.fillStyle = "rgba(250,204,21,0.9)"; ctx.fillRect(cx + s * 0.2, cy - s * 0.03, 5, 5);
  ctx.fillStyle = "rgba(100,220,255,0.7)"; ctx.fillRect(cx - s * 0.25, cy + s * 0.09, 4, 4);
}
