import { ClientOnly } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers as LayersIcon,
  CircleDot,
  Gauge,
  Info,
  LockKeyhole,
  Maximize2,
  Minimize2,
  MapPin,
  Menu,
  Moon,
  Pause,
  Play,
  Radio,
  Rocket,
  Satellite,
  Search,
  Sparkles,
  Sun,
  Tag,
  Thermometer,
  Unlock,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ACTIVE_COUNTS,
  BODIES,
  BODY_IDS,
  COUNT_NOTE,
  OPERATOR_FLAG,
  assetsFor,
  issTelemetryAt,
  pinAsAsset,
  pinsFor,
  subscribeIss,
  type BodyId,
  type IssTelemetry,
  type SpaceAsset,
} from "@/lib/space-data";
import type { SearchResult } from "@/lib/space-types";
import type { SceneLayers } from "./CelestialScene";
import { SKY_BY_ID } from "@/lib/deep-sky";
import SkyIntelPanel from "./SkyIntelPanel";
import UniverseFact from "./UniverseFact";
import IntelModal from "./IntelModal";
import GlobalSearch from "./GlobalSearch";
import StatusStrip from "./StatusStrip";
import { OrbitalBrandHeader } from "./OrbitalLogo";
import { useIsMobile } from "@/hooks/use-mobile";

const CelestialScene = lazy(() => import("./CelestialScene"));

const LAYER_META: { key: keyof SceneLayers; label: string; Icon: typeof MapPin }[] = [
  { key: "terminator", label: "Sun / Terminator", Icon: Sun },
  { key: "orbiters", label: "Orbits", Icon: Satellite },
  { key: "craters", label: "Night Lights", Icon: CircleDot },
  { key: "landingSites", label: "Surface Labels", Icon: MapPin },
  { key: "temperature", label: "Thermal Map", Icon: Thermometer },
];

const SPEEDS = [1, 10, 100];

/** Navigation hub taxonomy — celestial items drive the 3D scene, the rest open Intel modals. */
const HUB_GROUPS: { title: string; items: string[] }[] = [
  {
    title: "CELESTIAL WORLDS",
    items: ["Sun", "Mercury", "Venus", "Earth", "Moon", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
  },
  {
    title: "LIVE TRACKERS",
    items: ["Starlink", "ISS", "Tiangong", "JWST / Hubble", "GNSS", "Active Payloads"],
  },
  {
    title: "SPACE INTEL & SSA",
    items: ["Space Debris Cloud", "Conjunction Warnings", "Re-entry Forecast", "Maneuvers", "Space Weather"],
  },
  {
    title: "OBSERVATION",
    items: ["Tonight's Visible Passes", "Lunar / Solar Transits", "Optical Sunlit Filter", "Radio Frequencies"],
  },
  {
    title: "VEHICLES & DATA",
    items: ["Launch Schedule", "Rockets", "Spaceports", "Surface Gazetteer", "Academy"],
  },
];

function useUtcClock() {
  const [now, setNow] = useState(() => new Date(0));
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function Dashboard() {
  const [body, setBody] = useState<BodyId>("Earth");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [intelligence, setIntelligence] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [live, setLive] = useState(true);
  const [scrub, setScrub] = useState(72);
  const [rideAlong, setRideAlong] = useState(false);
  const [selected, setSelected] = useState<SpaceAsset | null>(null);
  const [gazetteerOpen, setGazetteerOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(true);
  const isMobile = useIsMobile();
  /** Below lg the profile card docks as a bottom sheet behind a "Specs" pill. */
  const [isCompact, setIsCompact] = useState(false);
  const [telemetryOpen, setTelemetryOpen] = useState(true);
  const [layersOpen, setLayersOpen] = useState(true);
  const [zen, setZen] = useState(false);
  /** Deep-sky HUD: catalogue annotations, constellation figures, selection */
  const [starLabels, setStarLabels] = useState(true);
  const [constellations, setConstellations] = useState(false);
  const [skyId, setSkyId] = useState<string | null>(null);
  const skyObject = skyId ? SKY_BY_ID[skyId] : null;

  const [layers, setLayers] = useState<SceneLayers>({
    landingSites: true,
    craters: true,
    orbiters: true,
    terminator: true,
    temperature: false,
  });
  const [sun] = useState({ az: 20, el: 12 });
  const [zoomRequest, setZoomRequest] = useState<{ id: number; factor: number } | null>(null);
  const [iss, setIss] = useState<IssTelemetry | null>(null);
  const zoomId = useRef(0);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const onChange = () => {
      setIsCompact(mql.matches);
      if (mql.matches) setProfileOpen(false);
    };
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setTelemetryOpen(false);
      setLayersOpen(false);
    }
  }, [isMobile]);


  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const typing =
        event.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA"].includes(event.target.tagName);
      if (event.key === "Escape") {
        if (intelligence) setIntelligence(null);
        else if (searchOpen) setSearchOpen(false);
        else if (menuOpen) setMenuOpen(false);
        else if (zen) setZen(false);
      }
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (
        event.key.toLowerCase() === "f" &&
        !typing &&
        !event.metaKey &&
        !event.ctrlKey &&
        !intelligence &&
        !searchOpen &&
        !menuOpen
      ) {
        setZen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [intelligence, menuOpen, searchOpen, zen]);


  const now = useUtcClock();
  const info = BODIES[body];
  const utc = now.getTime() === 0 ? "——:——:——" : now.toISOString().slice(11, 19);
  const trackedCount = ACTIVE_COUNTS[body];
  const countNote = COUNT_NOTE[body];
  const assets = useMemo(() => assetsFor(body), [body]);

  useEffect(() => {
    setIss(issTelemetryAt(new Date()));
    return subscribeIss(setIss, 1000);
  }, []);

  const sunAz = useMemo(() => {
    const wrapped = (((sun.az + (scrub - 72) * 3.6 + 180) % 360) + 360) % 360 - 180;
    return Math.round(wrapped);
  }, [sun.az, scrub]);

  const zoom = useCallback((factor: number) => {
    zoomId.current += 1;
    setZoomRequest({ id: zoomId.current, factor });
  }, []);

  const selectBody = (next: BodyId) => {
    setBody(next);
    setSelected(null);
  };

  const handleSearchSelect = (result: SearchResult) => {
    setSearchOpen(false);
    if (result.action.kind === "body") {
      if ((BODY_IDS as readonly string[]).includes(result.action.body)) {
        selectBody(result.action.body as BodyId);
      }
    } else {
      setIntelligence(result.action.viewKey);
    }
  };

  const telemetryRows =
    body === "Earth" && iss
      ? [
          ["SUB-POINT LAT", `${Math.abs(iss.lat).toFixed(2)}° ${iss.lat >= 0 ? "N" : "S"}`],
          ["SUB-POINT LON", `${Math.abs(iss.lon).toFixed(2)}° ${iss.lon >= 0 ? "E" : "W"}`],
          ["VELOCITY", `${iss.velocityKms.toFixed(2)} km/s`],
          ["ALTITUDE", `${iss.altitudeKm.toFixed(1)} km`],
          ["ORBITAL PERIOD", "92.68 min"],
        ]
      : [
          ["SUB-POINT LAT", info.telemetry.lat],
          ["SUB-POINT LON", info.telemetry.lon],
          ["VELOCITY", `${info.telemetry.velocity} km/s`],
          ["ALTITUDE", `${info.telemetry.altitude} km`],
          ["ORBITAL PERIOD", `${info.telemetry.period} min`],
        ];

  /** Zen / Freedom mode fades every overlay out and hands the canvas full control. */
  const hud = `transition-opacity duration-300 ${zen ? "pointer-events-none opacity-0" : "opacity-100"}`;
  /** Below md the HUD panels dock as frosted bottom-sheets instead of side cards. */
  const panelBase = isMobile
    ? "glass hud-scroll pointer-events-auto fixed inset-x-2 bottom-2 z-50 max-h-[65vh] overflow-y-auto p-4 transition-all duration-300 ease-in-out"
    : "glass hud-scroll pointer-events-auto w-full overflow-y-auto p-4 transition-all duration-300 ease-in-out max-h-[calc(100dvh-320px)]";
  const panelState = (open: boolean, side: "left" | "right") =>
    open
      ? "translate-x-0 translate-y-0 opacity-100"
      : isMobile
        ? "pointer-events-none translate-y-[130%] opacity-0"
        : `pointer-events-none opacity-0 ${side === "left" ? "-translate-x-[120%]" : "translate-x-[120%]"}`;

  return (

    <main className="void-bg relative h-[100dvh] w-full overflow-hidden text-foreground">
      {/* FULL-BLEED 3D VIEWPORT */}
      <div className="absolute inset-0">
        <ClientOnly fallback={<ViewportFallback />}>
          <Suspense fallback={<ViewportFallback />}>
            <CelestialScene
              body={body}
              layers={layers}
              playing={playing && (live || scrub > 0)}
              speed={speed}
              rideAlong={rideAlong}
              focus={selected ? selected.id : null}
              sunAzimuth={sunAz}
              sunElevation={sun.el}
              zoomRequest={zoomRequest}
              starLabels={starLabels}
              constellations={constellations}
              selectedSkyId={skyId}
              onSkySelect={(id) => {
                setSkyId(id);
                setSelected(null);
              }}
              onPinSelect={(p) => {
                setSelected(pinAsAsset(p));
                setSkyId(null);
              }}
              onAssetSelect={(a) => {
                setSelected(a);
                setSkyId(null);
              }}
              onBodyClick={() => {
                setSelected(null);
                setSkyId(null);
              }}
            />
          </Suspense>
        </ClientOnly>
      </div>
      <div className="pointer-events-none absolute inset-0 grid-overlay" aria-hidden />

      {/* FLOATING COMMAND BAR */}
      <header className={`pointer-events-none absolute inset-x-4 top-4 z-40 flex justify-center ${hud}`}>

        <div className="glass pointer-events-auto flex w-full max-w-[1600px] items-center gap-4 px-4 py-2.5">
          <OrbitalBrandHeader />

          <nav
            aria-label="Celestial bodies"
            className="hud-scroll mx-auto hidden items-center gap-0.5 overflow-x-auto rounded-full border border-white/[0.06] bg-white/[0.03] p-1 lg:flex"
          >
            {BODY_IDS.map((id) => (
              <button
                key={id}
                onClick={() => selectBody(id)}
                className={`relative rounded-full px-3 py-1.5 text-[11px] transition-colors ${
                  body === id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {body === id && (
                  <motion.span
                    layoutId="body-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-gold shadow-[0_0_20px_rgba(245,166,35,0.35)]"
                  />
                )}
                <span className="relative z-10 font-medium">{id}</span>
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <div className="hidden flex-col items-end sm:flex">
              <span className="hud-eyebrow leading-none">Mission clock</span>
              <b className="mt-1 font-mono text-[12px] font-medium tracking-[0.12em] text-foreground">
                {utc} <span className="text-muted-foreground">UTC</span>
              </b>
            </div>

            <span
              title={countNote}
              className="hidden items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-1.5 font-mono text-[11px] text-signal md:flex"
            >
              <i className="pulse-dot size-1.5 rounded-full bg-signal" />
              {trackedCount.toLocaleString()} Tracked
            </span>

            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
            >
              <Search size={13} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] md:inline">
                ⌘K
              </kbd>
            </button>

            <button
              aria-label={profileOpen ? "Hide body profile" : "Show body profile"}
              title="Body profile"
              onClick={() => setProfileOpen((v) => !v)}
              className={`grid size-9 place-items-center rounded-full border transition-colors ${
                profileOpen
                  ? "border-gold/40 bg-gold/10 text-gold"
                  : "border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:border-gold/40 hover:text-gold"
              }`}
            >
              <Info size={15} />
            </button>

            <button
              aria-label="Enter full-screen orbit freedom mode"
              title="Orbit freedom mode (F)"
              onClick={() => setZen(true)}
              className="hidden size-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold sm:grid"
            >
              <Maximize2 size={15} />
            </button>

            <button
              aria-label="Open navigation hub"
              onClick={() => setMenuOpen(true)}
              className="grid size-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
            >
              <Menu size={17} />
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD SUMMARY — slim collapsible status pill, expands into a floating popover */}
      <div className={`pointer-events-none absolute inset-x-3 top-[74px] z-40 flex justify-center md:inset-x-4 md:top-[80px] ${hud}`}>
        <StatusStrip issLive={iss?.source === "live"} onOpenView={(viewKey) => setIntelligence(viewKey)} />
      </div>



      {/* LEFT TELEMETRY CARD */}
      <div className={`absolute left-3 top-[116px] z-30 flex w-[262px] max-w-[calc(100vw-1.5rem)] flex-col items-start gap-2 md:left-4 md:top-[124px] ${hud}`}>
        <button
          onClick={() => {
            setTelemetryOpen((v) => !v);
            if (!telemetryOpen && isMobile) setLayersOpen(false);
          }}
          aria-expanded={telemetryOpen}
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/[0.1] bg-[oklch(0.09_0.016_265_/_0.8)] px-3 py-1.5 font-mono text-xs tracking-wider text-zinc-300 shadow-lg backdrop-blur-xl transition-all hover:border-gold/50 hover:text-white"
        >
          <span className="relative grid place-items-center">
            <Gauge size={13} className="text-gold" />
            <i className="pulse-dot absolute -right-1 -top-1 size-1.5 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]" />
          </span>
          TELEMETRY
          {telemetryOpen ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
        </button>
        <motion.aside
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          aria-hidden={!telemetryOpen}
          className={`${panelBase} ${panelState(telemetryOpen, "left")}`}
        >


        <div className="flex items-center justify-between">
          <span className="hud-eyebrow">Target telemetry</span>
          <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.14em] text-signal">
            <i className="pulse-dot size-1.5 rounded-full bg-signal" /> LIVE
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2.5">
          <span
            className="size-2.5 rounded-full"
            style={{ background: info.accent, boxShadow: `0 0 12px ${info.accent}` }}
          />
          <h2 className="text-[17px] font-semibold tracking-tight text-foreground">{body}</h2>
          <span className="ml-auto font-mono text-[9px] text-muted-foreground">O-408</span>
        </div>

        <dl className="mt-3 space-y-px">
          {telemetryRows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-3 border-t border-white/[0.06] py-2.5"
            >
              <dt className="hud-eyebrow">{label}</dt>
              <dd className="font-mono text-[13px] font-medium tracking-[0.04em] text-foreground">{value}</dd>
            </div>
          ))}
        </dl>

        {body === "Earth" && iss && (
          <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-center justify-between">
              <span className="hud-eyebrow flex items-center gap-1.5">
                <Satellite size={11} className="text-gold" /> ISS track
              </span>
              <b
                className={`font-mono text-[9px] tracking-[0.1em] ${
                  iss.source === "live" ? "text-signal" : "text-gold"
                }`}
              >
                {iss.source === "live" ? "LIVE FEED" : "SGP4"}
              </b>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-foreground/85">
              Overflight: <b className="font-medium text-gold">{iss.region}</b>
            </p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
              {iss.eclipse === "DAYLIGHT" ? (
                <Sun size={12} className="text-gold" />
              ) : (
                <Moon size={12} className="text-cyan" />
              )}
              <span>{iss.eclipse === "DAYLIGHT" ? "Orbital daylight" : "Orbital eclipse"}</span>
              <i
                className={`pulse-dot ml-auto size-1.5 rounded-full ${
                  iss.eclipse === "DAYLIGHT" ? "bg-gold" : "bg-signal"
                }`}
              />
            </div>
          </div>
        )}

        <button
          onClick={() => setRideAlong((v) => !v)}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[11px] font-medium transition-colors ${
            rideAlong
              ? "border-gold bg-gold text-primary-foreground"
              : "border-gold/40 bg-gold/10 text-gold hover:bg-gold/20"
          }`}
        >
          <Radio size={14} /> {rideAlong ? "Riding along" : "Ride along"}
        </button>

        <div className="mt-3 border-t border-white/[0.06] pt-3">
          <span className="hud-eyebrow">Active hardware</span>
          <div className="mt-2 space-y-1">
            {assets.length === 0 && (
              <p className="text-[11px] text-muted-foreground">No operational spacecraft on station.</p>
            )}
            {assets.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] transition-colors hover:bg-white/[0.04] ${
                  selected?.id === a.id ? "text-gold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Rocket size={11} className="mt-0.5 shrink-0 text-gold" />
                <span className="leading-snug">
                  {a.name} <small className="text-[9px]">{OPERATOR_FLAG[a.operator]}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.aside>
      </div>

      {/* RIGHT LAYERS + GAZETTEER CARD */}
      <div className={`absolute right-3 top-[116px] z-30 flex w-[274px] max-w-[calc(100vw-1.5rem)] flex-col items-end gap-2 md:right-4 md:top-[124px] ${hud}`}>
        <button
          onClick={() => {
            setLayersOpen((v) => !v);
            if (!layersOpen && isMobile) setTelemetryOpen(false);
          }}
          aria-expanded={layersOpen}
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/[0.1] bg-[oklch(0.09_0.016_265_/_0.8)] px-3 py-1.5 font-mono text-xs tracking-wider text-zinc-300 shadow-lg backdrop-blur-xl transition-all hover:border-gold/50 hover:text-white"
        >
          {layersOpen ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          LAYERS
          <span className="relative grid place-items-center">
            <LayersIcon size={13} className={`transition-transform ${layersOpen ? "text-gold" : "text-zinc-400"}`} />
            <i className="pulse-dot absolute -right-1 -top-1 size-1.5 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]" />
          </span>
        </button>
        <motion.aside
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          aria-hidden={!layersOpen}
          className={`${panelBase} ${panelState(layersOpen, "right")}`}
        >


        <div className="flex items-center justify-between">
          <span className="hud-eyebrow">Map layers</span>
          <span className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground">
            {Object.values(layers).filter(Boolean).length}/{LAYER_META.length}
          </span>
        </div>

        <div className="mt-3 space-y-1">
          {LAYER_META.map(({ key, label, Icon }) => {
            const on = layers[key];
            return (
              <button
                key={key}
                role="switch"
                aria-checked={on}
                onClick={() => setLayers((prev) => ({ ...prev, [key]: !prev[key] }))}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-[12px] transition-colors hover:bg-white/[0.04]"
              >
                <Icon size={14} className={on ? "text-gold" : "text-muted-foreground"} />
                <span className={on ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                <span
                  className={`ml-auto flex h-4 w-7 items-center rounded-full p-0.5 transition-colors ${
                    on ? "bg-gold/80" : "bg-white/10"
                  }`}
                >
                  <motion.i
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    className={`block size-3 rounded-full bg-white shadow ${on ? "ml-auto" : ""}`}
                  />
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 border-t border-white/[0.06] pt-3">
          <button
            onClick={() => setGazetteerOpen((v) => !v)}
            className="flex w-full items-center justify-between"
          >
            <span className="hud-eyebrow">Surface gazetteer</span>
            <ChevronDown
              size={14}
              className={`text-muted-foreground transition-transform ${gazetteerOpen ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {gazetteerOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-1">
                  {pinsFor(body).length === 0 && (
                    <p className="text-[11px] text-muted-foreground">No mapped features for this body.</p>
                  )}
                  {pinsFor(body).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelected(pinAsAsset(p))}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] text-muted-foreground transition-all hover:-translate-y-px hover:bg-white/[0.05] hover:text-gold hover:shadow-lg"
                    >
                      <MapPin size={11} className="text-gold" />
                      {p.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 border-t border-white/[0.06] pt-3">
          <button
            onClick={() => setProfileOpen(true)}
            className="flex w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-2.5 py-2 text-[12px] text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
          >
            <Info size={14} className="text-gold" /> Body profile · {body}
          </button>
        </div>

        <p className="mt-4 border-t border-white/[0.06] pt-3 text-[11px] leading-relaxed text-muted-foreground">
          {countNote}
        </p>

      </motion.aside>
      </div>

      {/* BODY PROFILE — docked bottom-left on desktop, bottom sheet + Specs pill below lg */}
      {isCompact && !profileOpen && (
        <button
          onClick={() => setProfileOpen(true)}
          className={`absolute bottom-24 left-3 z-30 flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#090d16]/80 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground shadow-2xl backdrop-blur-xl transition-colors hover:border-gold/40 hover:text-gold ${hud}`}
        >
          <Info size={13} className="text-gold" /> Specs
        </button>
      )}
      <AnimatePresence>
        {profileOpen && (
          <motion.aside
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className={`z-30 rounded-xl border border-white/[0.08] bg-[#090d16]/80 p-4 shadow-2xl backdrop-blur-xl ${
              isCompact
                ? "hud-scroll fixed inset-x-3 bottom-20 max-h-[55vh] overflow-y-auto"
                : "absolute bottom-24 left-6 w-80 max-w-[calc(100vw-3rem)]"
            } ${hud}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="hud-eyebrow text-gold">Body profile</span>
                <h3 className="mt-1 flex items-center gap-2 truncate text-[17px] font-semibold tracking-tight text-foreground">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: info.accent, boxShadow: `0 0 12px ${info.accent}` }}
                  />
                  {body}
                </h3>
              </div>
              <button
                onClick={() => setProfileOpen(false)}
                aria-label="Close body profile"
                className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
              >
                <X size={15} />
              </button>
            </div>

            <dl className="mt-3 space-y-px">
              {[
                ["DIAMETER", info.diameterKm],
                ["GRAVITY", info.gravity],
                ["ORBITAL PERIOD", info.orbitalPeriod],
                ["DAY LENGTH", info.dayLength],
                ["MEAN TEMP", info.meanTempC],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-3 border-t border-white/[0.06] py-2"
                >
                  <dt className="hud-eyebrow">{label}</dt>
                  <dd className="max-w-[62%] text-right font-mono text-[12px] font-medium tracking-[0.04em] text-foreground">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-3 border-t border-white/[0.06] pt-3 text-[12px] leading-relaxed text-muted-foreground">
              {info.fact}
            </p>
          </motion.aside>
        )}
      </AnimatePresence>





      {/* SELECTED ASSET DRAWER */}
      <AnimatePresence>
        {selected && (
          <motion.aside
            key={selected.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className={`glass hud-scroll absolute inset-y-4 right-4 z-40 w-[min(340px,90%)] overflow-y-auto p-5 ${hud}`}
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="Close asset intel"
              className="absolute right-3 top-3 grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
            >
              <X size={15} />
            </button>
            <span className="hud-eyebrow text-gold">Asset intelligence</span>
            <h3 className="mb-3 mt-1.5 pr-8 text-[17px] font-semibold leading-snug tracking-tight">
              {selected.name}
            </h3>
            <div className="mb-4 flex flex-wrap items-center gap-1.5 font-mono text-[9px] tracking-[0.1em]">
              <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-gold">
                {OPERATOR_FLAG[selected.operator]} {selected.operator}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-muted-foreground">
                {selected.type}
              </span>
              {selected.count > 1 && (
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-muted-foreground">
                  {selected.count.toLocaleString()} UNITS
                </span>
              )}
            </div>
            <dl className="space-y-px border-t border-white/[0.06] pt-1 text-[11px]">
              {[
                ["LAUNCH DATE", selected.launchDate],
                [selected.surface ? "LANDING DATE" : "INSERTION DATE", selected.arrivalDate],
                ["STATUS", selected.status],
                [
                  "ALTITUDE",
                  selected.surface ? "Surface (0 km)" : `${selected.altitudeKm.toLocaleString()} km`,
                ],
                ...(selected.elevation ? [["ELEVATION", selected.elevation]] : []),
                ["LATITUDE", `${Math.abs(selected.lat).toFixed(3)}° ${selected.lat >= 0 ? "N" : "S"}`],
                ["LONGITUDE", `${Math.abs(selected.lon).toFixed(3)}° ${selected.lon >= 0 ? "E" : "W"}`],

              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-white/[0.05] py-2">
                  <dt className="hud-eyebrow">{k}</dt>
                  <dd className="max-w-[62%] text-right font-mono text-[11px] text-foreground/90">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <span className="hud-eyebrow">Mission objectives</span>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{selected.objectives}</p>
            </div>
            <div className="mt-4">
              <span className="hud-eyebrow text-gold">Key discoveries</span>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{selected.discoveries}</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* CELESTIAL INTELLIGENCE PANEL */}
      <AnimatePresence>
        {skyObject && !selected && (
          <SkyIntelPanel object={skyObject} onClose={() => setSkyId(null)} className={hud} />
        )}
      </AnimatePresence>

      {/* UNIVERSE FACT CARD */}
      {!skyObject && !selected && (
        <div className={`pointer-events-auto absolute right-4 top-[86px] z-30 hidden xl:block ${hud}`}>
          <UniverseFact
            onExplore={() => {
              setConstellations(true);
              setStarLabels(true);
              setIntelligence("Academy");
            }}
          />
        </div>
      )}

      {/* DEEP-SKY LAYER TOGGLES */}
      <div className={`glass absolute bottom-[184px] right-4 z-30 flex flex-col p-1 md:bottom-[176px] ${hud}`}>
        <button
          onClick={() => setStarLabels((v) => !v)}
          title="Star labels"
          aria-pressed={starLabels}
          className={`grid size-9 place-items-center rounded-xl transition-colors ${
            starLabels ? "text-gold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Tag size={15} />
        </button>
        <i className="mx-2 h-px bg-white/10" />
        <button
          onClick={() => setConstellations((v) => !v)}
          title="Constellations"
          aria-pressed={constellations}
          className={`grid size-9 place-items-center rounded-xl transition-colors ${
            constellations ? "text-gold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles size={15} />
        </button>
      </div>

      {/* ZOOM PILL */}
      <div className={`glass absolute bottom-28 right-4 z-30 flex flex-col p-1 md:bottom-24 ${hud}`}>
        <button
          onClick={() => zoom(0.62)}
          aria-label="Zoom in"
          className="grid size-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-gold"
        >
          <ZoomIn size={15} />
        </button>
        <i className="mx-2 h-px bg-white/10" />
        <button
          onClick={() => zoom(1.6)}
          aria-label="Zoom out"
          className="grid size-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-gold"
        >
          <ZoomOut size={15} />
        </button>
      </div>

      {/* BOTTOM TIME CONTROLLER */}
      <footer className={`absolute inset-x-4 bottom-4 z-30 flex justify-center ${hud}`}>
        <div className="glass flex w-full max-w-[860px] flex-wrap items-center gap-3 px-4 py-2.5">
          <button
            onClick={() => setPlaying((v) => !v)}
            aria-label={playing ? "Pause simulation" : "Play simulation"}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-gold text-primary-foreground transition-transform hover:scale-105"
          >
            {playing ? <Pause size={15} /> : <Play size={15} />}
          </button>

          <label className="flex min-w-[150px] flex-1 items-center gap-3">
            <span className="sr-only">Timeline scrub</span>
            <input
              type="range"
              min={0}
              max={100}
              value={scrub}
              onChange={(e) => {
                setScrub(Number(e.target.value));
                setLive(false);
              }}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[var(--gold)]"
              style={{
                background: `linear-gradient(to right, var(--gold) ${scrub}%, oklch(1 0 0 / 0.1) ${scrub}%)`,
              }}
            />
            <b className="hidden font-mono text-[11px] tracking-[0.1em] text-muted-foreground sm:inline">
              {utc}
            </b>
          </label>

          <div className="flex shrink-0 items-center gap-0.5 rounded-full border border-white/[0.06] bg-white/[0.03] p-1">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`rounded-full px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  speed === s ? "bg-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setLive((v) => !v);
              if (!live) setScrub(100);
            }}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] transition-colors ${
              live ? "border-signal/40 bg-signal/10 text-signal" : "border-white/10 text-muted-foreground"
            }`}
          >
            {live ? <LockKeyhole size={11} /> : <Unlock size={11} />} {live ? "LIVE" : "SCRUB"}
          </button>

          <span className="hidden items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] text-muted-foreground lg:flex">
            <Gauge size={12} /> SGP4
          </span>
        </div>
      </footer>

      {/* COMMAND PALETTE */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && setSearchOpen(false)}
            className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 px-4 pt-[16vh] backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className="glass w-full max-w-[620px] p-3"
            >
              <GlobalSearch autoFocus onSelect={handleSearchSelect} />
              <p className="mt-2 px-1 font-mono text-[9px] tracking-[0.14em] text-muted-foreground">
                ENTER TO OPEN · ESC TO DISMISS
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVIGATION HUB DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col bg-[#05070c]/95 backdrop-blur-2xl"
          >
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.06] px-6">
              <OrbitalBrandHeader />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation hub"
                className="grid size-10 place-items-center rounded-full border border-white/[0.08] text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
              >
                <X size={18} />
              </button>
            </div>
            <div className="hud-scroll grid flex-1 gap-8 overflow-y-auto p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:p-10">
              {HUB_GROUPS.map((group) => (
                <section key={group.title}>
                  <h2 className="hud-eyebrow mb-4 border-b border-white/[0.08] pb-2.5 text-gold">
                    {group.title}
                  </h2>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isBody = (BODY_IDS as readonly string[]).includes(item);
                      return (
                        <button
                          key={item}
                          onClick={() => {
                            if (isBody) selectBody(item as BodyId);
                            else setIntelligence(item);
                            setMenuOpen(false);
                          }}
                          className="group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                        >
                          {item}
                          <span className="font-mono text-[10px] text-gold/0 transition-colors group-hover:text-gold">
                            {isBody ? "◉" : "↗"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
            <div className="flex shrink-0 items-center justify-between border-t border-white/[0.06] px-6 py-4 font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
              <span>
                ORBITAL INTELLIGENCE SYSTEMS <b className="text-foreground/80">v2.4.1</b>
              </span>
              <span className="flex items-center gap-2">
                <i className="pulse-dot size-1.5 rounded-full bg-signal" /> SECURE CHANNEL
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <IntelModal
        viewKey={intelligence}
        onOpenChange={(open) => {
          if (!open) setIntelligence(null);
        }}
      />

      {/* MOBILE / TABLET BODY SELECTOR — touch scrollable */}
      <nav
        aria-label="Celestial bodies"
        className={`hud-scroll absolute inset-x-3 top-[108px] z-30 flex items-center gap-1.5 overflow-x-auto pb-1 lg:hidden ${hud}`}
      >
        <span className="glass flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
          <Activity size={11} className="text-signal" /> {trackedCount.toLocaleString()}
        </span>
        {BODY_IDS.map((id) => (
          <button
            key={id}
            onClick={() => selectBody(id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] transition-colors ${
              body === id
                ? "border-transparent bg-gold text-primary-foreground shadow-[0_0_18px_rgba(245,166,35,0.3)]"
                : "border-white/[0.08] bg-[oklch(0.09_0.016_265_/_0.75)] text-muted-foreground backdrop-blur-xl"
            }`}
          >
            {id}
          </button>
        ))}
      </nav>

      {/* ZEN / ORBIT FREEDOM EXIT */}
      {zen && (
        <button
          onClick={() => setZen(false)}
          className="absolute right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-white/[0.12] bg-[oklch(0.09_0.016_265_/_0.6)] px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-zinc-300 backdrop-blur-xl transition-colors hover:border-gold/50 hover:text-white"
        >
          <Minimize2 size={13} className="text-gold" /> EXIT FULLSCREEN (ESC)
        </button>
      )}

    </main>
  );
}

function ViewportFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <span className="animate-pulse font-mono text-[11px] tracking-[0.22em] text-muted-foreground">
        INITIALISING PLANETARY ENGINE…
      </span>
    </div>
  );
}
