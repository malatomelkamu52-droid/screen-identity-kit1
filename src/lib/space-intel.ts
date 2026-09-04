/**
 * Phase 1 intelligence catalog.
 *
 * Extends the existing INTELLIGENCE_VIEWS registry from space-data.ts with the
 * mission / weather / object / astronomy / analytics views, and provides the
 * navigation architecture + universal search index used by the dashboard.
 */
import {
  ACTIVE_ASSETS,
  BODY_IDS,
  INTELLIGENCE_VIEWS,
  SURFACE_PINS,
  type IntelligenceViewDefinition,
} from "./space-data";
import type { SearchResult } from "./space-types";

type Draft = Omit<IntelligenceViewDefinition, "filters"> & { filters?: string[] };

const make = (d: Draft): IntelligenceViewDefinition => ({ ...d, filters: d.filters });

const EXTRA_VIEWS: Record<string, IntelligenceViewDefinition> = {
  Satellites: make({
    id: "satellites",
    category: "LIVE TRACKERS",
    title: "Satellite Catalog",
    status: "CATALOG SYNCED",
    visual: "satellite",
    definition:
      "An aggregated view of operational spacecraft grouped by orbital regime. Low Earth orbit dominates the active catalog, while navigation payloads occupy medium Earth orbit and communications relays hold geostationary slots.",
    protocol:
      "Objects are grouped by regime, then screened for ephemeris age. Any entry older than its refresh window is flagged for re-ingest before it is used in analysis.",
    metrics: [
      { label: "TRACKED OBJECTS", value: "18,600+", detail: "active catalog scale" },
      { label: "LEO SHARE", value: "~85%", detail: "dominant regime" },
      { label: "GEO SLOTS", value: "~570", detail: "geostationary belt" },
      { label: "REFRESH", value: "ON DEMAND" },
    ],
    columns: ["Group", "Regime", "Altitude", "Inclination", "Status"],
    rows: [
      ["Broadband constellations", "LEO", "540–570 km", "43–53°", "OPERATIONAL"],
      ["Earth observation", "LEO", "500–800 km", "97–98° SSO", "OPERATIONAL"],
      ["Navigation (GNSS)", "MEO", "19,100–23,222 km", "55–65°", "OPERATIONAL"],
      ["Communications relays", "GEO", "35,786 km", "~0°", "OPERATIONAL"],
      ["Weather / meteorology", "GEO + LEO", "Mixed", "Mixed", "OPERATIONAL"],
    ],
    filters: ["ALL", "LEO", "MEO", "GEO"],
  }),
  "Ground Stations": make({
    id: "ground-stations",
    category: "LIVE TRACKERS",
    title: "Ground Segment Network",
    status: "NETWORK NOMINAL",
    visual: "radio",
    definition:
      "Ground stations close the loop between spacecraft and mission control. Deep space work relies on large dish complexes spread across longitudes so at least one antenna always has line of sight.",
    protocol:
      "Pass scheduling reserves antenna time from predicted rise/set geometry, then allocates uplink and downlink bands with margin for rain fade and pointing error.",
    metrics: [
      { label: "DSN COMPLEXES", value: "3", detail: "Goldstone / Madrid / Canberra" },
      { label: "LONGITUDE SPACING", value: "~120°", detail: "continuous coverage" },
      { label: "PRIMARY BANDS", value: "S / X / Ka" },
      { label: "LARGEST DISH", value: "70 m" },
    ],
    columns: ["Station", "Region", "Bands", "Aperture", "Role"],
    rows: [
      ["Goldstone", "California, USA", "S / X / Ka", "70 m", "DEEP SPACE"],
      ["Madrid", "Spain", "S / X / Ka", "70 m", "DEEP SPACE"],
      ["Canberra", "Australia", "S / X / Ka", "70 m", "DEEP SPACE"],
      ["Kiruna", "Sweden", "S / X", "13 m", "POLAR LEO"],
      ["Svalbard", "Norway", "S / X", "11 m", "POLAR LEO"],
    ],
    filters: ["ALL", "DEEP SPACE", "POLAR LEO"],
  }),
  "Active Missions": make({
    id: "active-missions",
    category: "SPACE MISSIONS",
    title: "Active Mission Board",
    status: "MISSION BOARD",
    visual: "payload",
    definition:
      "Spacecraft currently returning science or operating on station across the solar system, from lunar orbit to the outer planets and interstellar space.",
    protocol:
      "Each mission is tracked by phase, target body and communications cadence. Extended missions remain listed while their instruments continue returning calibrated data.",
    metrics: [
      { label: "BODIES COVERED", value: "MULTI" },
      { label: "OLDEST ACTIVE", value: "VOYAGER 1", detail: "launched 1977" },
      { label: "PHASES", value: "CRUISE / SCIENCE" },
      { label: "SOURCE", value: "REFERENCE CATALOG" },
    ],
    columns: ["Mission", "Agency", "Target", "Phase", "Launched"],
    rows: [
      ["Perseverance", "NASA", "Mars", "SCIENCE", "2020-07-30"],
      ["Curiosity", "NASA", "Mars", "EXTENDED", "2011-11-26"],
      ["Juno", "NASA", "Jupiter", "EXTENDED", "2011-08-05"],
      ["Parker Solar Probe", "NASA", "Sun", "SCIENCE", "2018-08-12"],
      ["JUICE", "ESA", "Jupiter system", "CRUISE", "2023-04-14"],
      ["Voyager 1", "NASA", "Interstellar", "EXTENDED", "1977-09-05"],
    ],
    filters: ["ALL", "SCIENCE", "CRUISE", "EXTENDED"],
  }),
  "Upcoming Launches": make({
    id: "upcoming-launches",
    category: "SPACE MISSIONS",
    title: "Upcoming Launch Windows",
    status: "SCHEDULE SNAPSHOT",
    visual: "launch",
    definition:
      "Launch windows are constrained by orbital plane alignment, range availability and weather. Interplanetary windows repeat only when the departure geometry returns.",
    protocol:
      "Windows are held as target ranges, not fixed times. Confirm every entry against the provider's current manifest before treating it as operational.",
    metrics: [
      { label: "WINDOW TYPE", value: "INSTANT / RANGE" },
      { label: "RANGE WEATHER", value: "GO CRITERIA" },
      { label: "PLANE ALIGNMENT", value: "RAAN DRIVEN" },
      { label: "CONFIDENCE", value: "SNAPSHOT" },
    ],
    columns: ["Payload", "Vehicle", "Site", "Orbit", "Window"],
    rows: [
      ["Crew rotation", "Falcon 9", "LC-39A", "LEO / ISS", "INSTANTANEOUS"],
      ["Broadband batch", "Falcon 9", "SLC-40", "LEO 550 km", "RANGE"],
      ["Earth observation", "Vega-C", "Kourou", "SSO 700 km", "RANGE"],
      ["GEO comsat", "Ariane 6", "Kourou", "GTO", "RANGE"],
      ["Lunar lander", "Falcon 9", "LC-39A", "TLI", "INSTANTANEOUS"],
    ],
    filters: ["ALL", "LEO", "SSO", "GTO", "TLI"],
  }),
  "Mission Archive": make({
    id: "mission-archive",
    category: "SPACE MISSIONS",
    title: "Mission Archive",
    status: "HISTORICAL RECORD",
    visual: "rocket",
    definition:
      "Completed missions whose datasets remain the reference baseline for current operations — landing profiles, atmospheric entry data and long-baseline planetary imaging.",
    protocol:
      "Archived missions are read-only. Their telemetry supports comparison studies and calibration for active spacecraft in the same regime.",
    metrics: [
      { label: "ARCHIVE SPAN", value: "1960s → NOW" },
      { label: "DATA CLASS", value: "CALIBRATED" },
      { label: "USE", value: "BASELINE" },
      { label: "ACCESS", value: "READ ONLY" },
    ],
    columns: ["Mission", "Agency", "Target", "Ended", "Legacy"],
    rows: [
      ["Cassini", "NASA / ESA", "Saturn", "2017", "Ring & Titan science"],
      ["Rosetta", "ESA", "67P", "2016", "Comet rendezvous"],
      ["Opportunity", "NASA", "Mars", "2019", "14-year surface record"],
      ["Kepler", "NASA", "Exoplanets", "2018", "Transit survey"],
      ["Apollo 11", "NASA", "Moon", "1969", "First crewed landing"],
    ],
    filters: ["ALL", "NASA", "ESA"],
  }),
  "Solar Activity": make({
    id: "solar-activity",
    category: "SPACE WEATHER",
    title: "Solar Activity",
    status: "MODEL SNAPSHOT",
    visual: "weather",
    definition:
      "Solar flares are classified logarithmically by peak X-ray flux: A, B, C, M and X, with each letter representing a tenfold increase. M and X events can trigger radio blackouts on the sunlit hemisphere.",
    protocol:
      "Watch the flare class, active-region count and F10.7 solar radio flux together. Sustained M-class activity from an Earth-facing region raises the operational risk posture.",
    metrics: [
      { label: "FLARE SCALE", value: "A → X", detail: "logarithmic X-ray flux" },
      { label: "F10.7 FLUX", value: "SOLAR PROXY", detail: "10.7 cm radio flux" },
      { label: "CYCLE", value: "~11 YEARS" },
      { label: "IMPACT", value: "HF BLACKOUT" },
    ],
    columns: ["Class", "Peak flux (W/m²)", "Typical effect", "Response", "Posture"],
    rows: [
      ["A / B", "< 1e-6", "Background", "None", "QUIET"],
      ["C", "1e-6", "Minor ionospheric change", "Monitor", "QUIET"],
      ["M", "1e-5", "Short HF blackout", "Advisory", "WATCH"],
      ["X", "1e-4", "Wide radio blackout", "Operational alert", "ALERT"],
    ],
    filters: ["ALL", "QUIET", "WATCH", "ALERT"],
  }),
  "Solar Wind": make({
    id: "solar-wind",
    category: "SPACE WEATHER",
    title: "Solar Wind Stream",
    status: "MODEL SNAPSHOT",
    visual: "weather",
    definition:
      "The solar wind is a continuous plasma outflow from the corona. Slow streams run near 400 km/s; coronal-hole high-speed streams can exceed 700 km/s and compress the magnetosphere on arrival.",
    protocol:
      "Track bulk speed, proton density and the interplanetary magnetic field Bz component. A sustained southward Bz couples energy efficiently into the magnetosphere.",
    metrics: [
      { label: "SLOW STREAM", value: "~400 km/s" },
      { label: "FAST STREAM", value: "700+ km/s", detail: "coronal hole origin" },
      { label: "KEY DRIVER", value: "IMF Bz", detail: "southward = coupling" },
      { label: "TRANSIT", value: "1–4 DAYS", detail: "Sun → Earth" },
    ],
    columns: ["Parameter", "Nominal", "Elevated", "Unit", "Effect"],
    rows: [
      ["Bulk speed", "350–450", "700+", "km/s", "Magnetosphere compression"],
      ["Proton density", "3–10", "20+", "p/cm³", "Ram pressure"],
      ["IMF Bz", "±2", "-10 or lower", "nT", "Energy coupling"],
      ["Temperature", "1e5", "5e5", "K", "Stream interface"],
    ],
    filters: ["ALL", "km/s", "nT"],
  }),
  "Geomagnetic Storms": make({
    id: "geomagnetic-storms",
    category: "SPACE WEATHER",
    title: "Geomagnetic Storm Scale",
    status: "MODEL SNAPSHOT",
    visual: "weather",
    definition:
      "Geomagnetic disturbance is graded by the planetary K index (Kp 0–9). Kp 5 and above is storm level, driving satellite drag increases, GNSS degradation and grid-current risk.",
    protocol:
      "Correlate Kp with solar wind coupling. Storm-time thermospheric heating raises drag on low Earth orbit spacecraft and shortens ephemeris validity.",
    metrics: [
      { label: "SCALE", value: "Kp 0 → 9" },
      { label: "STORM THRESHOLD", value: "Kp ≥ 5" },
      { label: "LEO EFFECT", value: "DRAG INCREASE" },
      { label: "GNSS EFFECT", value: "POSITION ERROR" },
    ],
    columns: ["Kp", "NOAA scale", "Condition", "Satellite impact", "Posture"],
    rows: [
      ["0–3", "—", "Quiet", "Nominal", "QUIET"],
      ["4", "—", "Unsettled", "Minor drag change", "QUIET"],
      ["5–6", "G1–G2", "Minor / moderate storm", "Drag + GNSS error", "WATCH"],
      ["7–8", "G3–G4", "Strong / severe storm", "Orbit decay, anomalies", "ALERT"],
      ["9", "G5", "Extreme storm", "Widespread impact", "ALERT"],
    ],
    filters: ["ALL", "QUIET", "WATCH", "ALERT"],
  }),
  Aurora: make({
    id: "aurora",
    category: "SPACE WEATHER",
    title: "Auroral Oval Forecast",
    status: "MODEL SNAPSHOT",
    visual: "weather",
    definition:
      "Aurora forms where precipitating particles excite atmospheric oxygen and nitrogen along the auroral oval. Higher Kp pushes the oval equatorward, extending visibility to lower latitudes.",
    protocol:
      "Combine Kp with local darkness and cloud cover. Visibility estimates assume a clear northern (or southern) horizon away from urban light domes.",
    metrics: [
      { label: "GREEN LINE", value: "557.7 nm", detail: "atomic oxygen" },
      { label: "RED LINE", value: "630.0 nm", detail: "high-altitude oxygen" },
      { label: "TYPICAL BASE", value: "~100 km" },
      { label: "DRIVER", value: "Kp INDEX" },
    ],
    columns: ["Kp", "Visible from", "Example latitude", "Colour", "Confidence"],
    rows: [
      ["3", "Arctic", "65°", "Green", "MODEL"],
      ["5", "Scotland / Nordics", "58°", "Green / red", "MODEL"],
      ["7", "Northern USA", "50°", "Green / red", "MODEL"],
      ["9", "Mid-latitudes", "40°", "Red dominant", "MODEL"],
    ],
    filters: ["ALL", "MODEL"],
  }),
  Asteroids: make({
    id: "asteroids",
    category: "OBJECT INTELLIGENCE",
    title: "Asteroid Population",
    status: "CATALOG SYNCED",
    visual: "debris",
    definition:
      "Most asteroids orbit between Mars and Jupiter in the main belt. Size classes span sub-kilometre rubble piles up to Ceres, a dwarf planet roughly 940 km across.",
    protocol:
      "Population entries are grouped by dynamical class. Diameter estimates come from albedo-corrected thermal modelling rather than direct measurement.",
    metrics: [
      { label: "LARGEST", value: "CERES", detail: "~940 km diameter" },
      { label: "MAIN BELT", value: "2.1–3.3 AU" },
      { label: "CLASSES", value: "C / S / M" },
      { label: "TROJANS", value: "JUPITER L4 / L5" },
    ],
    columns: ["Object", "Class", "Diameter", "Semi-major axis", "Group"],
    rows: [
      ["Ceres", "Dwarf planet", "~940 km", "2.77 AU", "MAIN BELT"],
      ["Vesta", "V-type", "~525 km", "2.36 AU", "MAIN BELT"],
      ["Pallas", "B-type", "~512 km", "2.77 AU", "MAIN BELT"],
      ["Psyche", "M-type", "~220 km", "2.92 AU", "MAIN BELT"],
      ["Eros", "S-type", "~17 km", "1.46 AU", "NEO"],
    ],
    filters: ["ALL", "MAIN BELT", "NEO"],
  }),
  "Near-Earth Objects": make({
    id: "neo",
    category: "OBJECT INTELLIGENCE",
    title: "Near-Earth Objects",
    status: "WATCH LIST",
    visual: "conjunction",
    definition:
      "A near-Earth object has a perihelion under 1.3 AU. Objects larger than about 140 m that approach within 0.05 AU are classified as potentially hazardous asteroids.",
    protocol:
      "Close approaches are screened by miss distance and absolute magnitude. Hazard classification is a geometric definition, not a prediction of impact.",
    metrics: [
      { label: "NEO DEFINITION", value: "q < 1.3 AU" },
      { label: "PHA THRESHOLD", value: "0.05 AU", detail: "≈ 7.5M km" },
      { label: "SIZE THRESHOLD", value: "~140 m" },
      { label: "LUNAR DISTANCE", value: "384,400 km" },
    ],
    columns: ["Designation", "Class", "Est. diameter", "Miss distance", "Assessment"],
    rows: [
      ["Apophis", "PHA", "~340 m", "Sub-GEO 2029 pass", "TRACKED"],
      ["Bennu", "PHA / sampled", "~490 m", "Long baseline", "TRACKED"],
      ["Didymos / Dimorphos", "Binary NEO", "780 m / 160 m", "DART target", "TRACKED"],
      ["Eros", "NEO", "~17 km", "Non-hazardous", "TRACKED"],
    ],
    filters: ["ALL", "PHA", "TRACKED"],
  }),
  Comets: make({
    id: "comets",
    category: "OBJECT INTELLIGENCE",
    title: "Comet Register",
    status: "CATALOG SYNCED",
    visual: "reentry",
    definition:
      "Comets are volatile-rich bodies that develop a coma and tails near perihelion. Short-period comets return in under 200 years; long-period comets originate in the Oort cloud.",
    protocol:
      "Track perihelion distance, orbital period and the current heliocentric range. Brightness predictions carry large uncertainty and are treated as estimates only.",
    metrics: [
      { label: "SHORT PERIOD", value: "< 200 YR" },
      { label: "LONG PERIOD", value: "> 200 YR" },
      { label: "TAILS", value: "ION + DUST" },
      { label: "RESERVOIRS", value: "KUIPER / OORT" },
    ],
    columns: ["Comet", "Period", "Perihelion", "Family", "Status"],
    rows: [
      ["1P/Halley", "76 yr", "0.59 AU", "Halley-type", "CATALOG"],
      ["67P/Churyumov–Gerasimenko", "6.4 yr", "1.24 AU", "Jupiter-family", "CATALOG"],
      ["2P/Encke", "3.3 yr", "0.34 AU", "Encke-type", "CATALOG"],
      ["C/1995 O1 Hale–Bopp", "~2,500 yr", "0.91 AU", "Long period", "CATALOG"],
    ],
    filters: ["ALL", "Jupiter-family", "Long period"],
  }),
  Stars: make({
    id: "stars",
    category: "ASTRONOMY",
    title: "Bright Star Reference",
    status: "CATALOG SYNCED",
    visual: "telescope",
    definition:
      "Stars are ordered by apparent magnitude, where lower numbers are brighter. Spectral type encodes surface temperature along the O, B, A, F, G, K, M sequence.",
    protocol:
      "Use magnitude for visibility planning and spectral type plus distance for physical context. Distances derive from parallax measurements.",
    metrics: [
      { label: "BRIGHTEST", value: "SIRIUS", detail: "mag -1.46" },
      { label: "NEAREST SYSTEM", value: "4.24 LY", detail: "Proxima Centauri" },
      { label: "SEQUENCE", value: "O B A F G K M" },
      { label: "NAKED EYE LIMIT", value: "~MAG 6" },
    ],
    columns: ["Star", "Constellation", "Spectral", "Magnitude", "Distance"],
    rows: [
      ["Sirius", "Canis Major", "A1V", "-1.46", "8.6 ly"],
      ["Canopus", "Carina", "A9II", "-0.74", "310 ly"],
      ["Arcturus", "Boötes", "K0III", "-0.05", "37 ly"],
      ["Vega", "Lyra", "A0V", "0.03", "25 ly"],
      ["Betelgeuse", "Orion", "M1-2Ia", "~0.5 var", "~550 ly"],
    ],
    filters: ["ALL", "Orion", "Lyra"],
  }),
  Constellations: make({
    id: "constellations",
    category: "ASTRONOMY",
    title: "Constellation Atlas",
    status: "CATALOG SYNCED",
    visual: "telescope",
    definition:
      "The sky is divided into 88 official constellations with fixed boundaries. Each one is a mapping region, not a physical grouping — member stars can be at very different distances.",
    protocol:
      "Constellations are used as pointing regions for observation planning. Seasonal visibility depends on the observer's latitude and the date.",
    metrics: [
      { label: "OFFICIAL COUNT", value: "88" },
      { label: "LARGEST", value: "HYDRA" },
      { label: "ZODIAC", value: "13 CROSSED", detail: "by the ecliptic" },
      { label: "BOUNDARIES", value: "IAU 1930" },
    ],
    columns: ["Constellation", "Season", "Hemisphere", "Notable object", "Class"],
    rows: [
      ["Orion", "Winter", "Both", "M42 Orion Nebula", "PROMINENT"],
      ["Ursa Major", "Spring", "North", "M81 / M82", "CIRCUMPOLAR"],
      ["Scorpius", "Summer", "South", "Antares", "PROMINENT"],
      ["Crux", "Autumn", "South", "Coalsack Nebula", "PROMINENT"],
      ["Cassiopeia", "Autumn", "North", "Heart Nebula", "CIRCUMPOLAR"],
    ],
    filters: ["ALL", "PROMINENT", "CIRCUMPOLAR"],
  }),
  "Deep Sky Objects": make({
    id: "deep-sky",
    category: "ASTRONOMY",
    title: "Deep Sky Objects",
    status: "CATALOG SYNCED",
    visual: "telescope",
    definition:
      "Deep sky objects are galaxies, nebulae and star clusters beyond the solar system, catalogued primarily in the Messier and NGC systems.",
    protocol:
      "Observation planning combines surface brightness, angular size and altitude above the horizon. Large faint targets need dark skies more than aperture.",
    metrics: [
      { label: "MESSIER", value: "110 OBJECTS" },
      { label: "NEAREST GALAXY", value: "ANDROMEDA", detail: "~2.5 million ly" },
      { label: "TYPES", value: "GALAXY / NEBULA / CLUSTER" },
      { label: "BEST SEEING", value: "HIGH ALTITUDE" },
    ],
    columns: ["Object", "Type", "Constellation", "Magnitude", "Distance"],
    rows: [
      ["M31 Andromeda", "Spiral galaxy", "Andromeda", "3.4", "2.5 Mly"],
      ["M42 Orion Nebula", "Emission nebula", "Orion", "4.0", "1,344 ly"],
      ["M13 Hercules Cluster", "Globular cluster", "Hercules", "5.8", "22,200 ly"],
      ["M45 Pleiades", "Open cluster", "Taurus", "1.6", "444 ly"],
      ["M51 Whirlpool", "Spiral galaxy", "Canes Venatici", "8.4", "23 Mly"],
    ],
    filters: ["ALL", "galaxy", "nebula", "cluster"],
  }),
  "Sky Map": make({
    id: "sky-map",
    category: "ASTRONOMY",
    title: "Sky Map Geometry",
    status: "GEOMETRY ENGINE",
    visual: "passes",
    definition:
      "A sky map projects celestial coordinates onto the observer's local horizon. Right ascension and declination convert to azimuth and altitude using local sidereal time and latitude.",
    protocol:
      "Local sidereal time drives the transform. Objects below zero altitude are hidden; targets above roughly 30° suffer less atmospheric extinction.",
    metrics: [
      { label: "FRAME", value: "ALT / AZ" },
      { label: "CATALOG FRAME", value: "RA / DEC" },
      { label: "KEY INPUT", value: "SIDEREAL TIME" },
      { label: "GOOD SEEING", value: "> 30° ALT" },
    ],
    columns: ["Element", "Frame", "Symbol", "Range", "Use"],
    rows: [
      ["Right ascension", "Equatorial", "α", "0–24 h", "Catalog position"],
      ["Declination", "Equatorial", "δ", "-90 to +90°", "Catalog position"],
      ["Azimuth", "Horizontal", "A", "0–360°", "Pointing"],
      ["Altitude", "Horizontal", "h", "-90 to +90°", "Visibility"],
    ],
    filters: ["ALL", "Equatorial", "Horizontal"],
  }),
  "Orbital Analysis": make({
    id: "orbital-analysis",
    category: "ANALYTICS",
    title: "Orbital Analysis",
    status: "ANALYSIS ENGINE",
    visual: "maneuver",
    definition:
      "Orbit analysis converts state vectors into Keplerian elements, then propagates them forward to predict position, revisit geometry and decay behaviour.",
    protocol:
      "SGP4 handles near-Earth two-line element sets; numerical propagation is used when drag, solar radiation pressure or maneuvers dominate the error budget.",
    metrics: [
      { label: "ELEMENTS", value: "a e i Ω ω ν" },
      { label: "LEO PROPAGATOR", value: "SGP4" },
      { label: "TRANSFER", value: "HOHMANN" },
      { label: "BUDGET", value: "Δv" },
    ],
    columns: ["Analysis", "Input", "Method", "Output", "Confidence"],
    rows: [
      ["Element extraction", "State vector", "Two-body", "a, e, i, Ω, ω, ν", "HIGH"],
      ["Short-term propagation", "TLE", "SGP4", "Position / velocity", "HIGH"],
      ["Decay estimation", "Drag + Kp", "Numerical", "Re-entry window", "MODERATE"],
      ["Transfer design", "r₁ → r₂", "Hohmann", "Δv₁ + Δv₂", "HIGH"],
    ],
    filters: ["ALL", "HIGH", "MODERATE"],
  }),
  "Telemetry Charts": make({
    id: "telemetry-charts",
    category: "ANALYTICS",
    title: "Telemetry Channels",
    status: "STREAM MONITOR",
    visual: "satellite",
    definition:
      "Telemetry channels carry the spacecraft's health state: power, thermal, attitude and communications. Each channel has a nominal band and an alarm threshold.",
    protocol:
      "Channels are sampled at their own cadence and evaluated against limits. Sustained out-of-band values raise an anomaly for operator review.",
    metrics: [
      { label: "CHANNEL GROUPS", value: "4" },
      { label: "SAMPLING", value: "1 Hz → 1 min" },
      { label: "LIMITS", value: "SOFT / HARD" },
      { label: "ANOMALY RULE", value: "SUSTAINED BREACH" },
    ],
    columns: ["Channel", "Group", "Nominal", "Cadence", "State"],
    rows: [
      ["Bus voltage", "Power", "28 V", "1 Hz", "NOMINAL"],
      ["Battery SoC", "Power", "70–100%", "1 min", "NOMINAL"],
      ["Radiator temp", "Thermal", "-20 to +40 °C", "10 s", "NOMINAL"],
      ["Attitude error", "AOCS", "< 0.05°", "1 Hz", "NOMINAL"],
      ["Downlink SNR", "Comms", "> 8 dB", "1 s", "NOMINAL"],
    ],
    filters: ["ALL", "Power", "Thermal", "AOCS", "Comms"],
  }),
  "Data Explorer": make({
    id: "data-explorer",
    category: "ANALYTICS",
    title: "Data Explorer",
    status: "SOURCE REGISTRY",
    visual: "surface",
    definition:
      "A registry of the datasets behind this platform, each with its refresh cadence and current trust state, so no figure is presented without its provenance.",
    protocol:
      "Any dataset marked SIMULATED is structured reference data for the interface. Connect a live provider to promote a dataset to LIVE.",
    metrics: [
      { label: "DATASETS", value: "6" },
      { label: "LIVE STREAMS", value: "1", detail: "ISS propagation" },
      { label: "REFERENCE SETS", value: "5" },
      { label: "PROVENANCE", value: "ALWAYS SHOWN" },
    ],
    columns: ["Dataset", "Domain", "Cadence", "State", "Notes"],
    rows: [
      ["ISS state vector", "Trackers", "1 s", "LIVE", "SGP4 propagated in-app"],
      ["Satellite catalog", "Trackers", "On demand", "SIMULATED", "Reference structure"],
      ["Mission board", "Missions", "On demand", "SIMULATED", "Reference structure"],
      ["Space weather", "Weather", "On demand", "SIMULATED", "Model snapshot"],
      ["NEO watch list", "Objects", "On demand", "SIMULATED", "Reference structure"],
      ["Astronomy catalog", "Astronomy", "Static", "SIMULATED", "Reference structure"],
    ],
    filters: ["ALL", "LIVE", "SIMULATED"],
  }),
};

/** Full registry: existing views (unchanged) plus the Phase 1 additions. */
export const VIEW_REGISTRY: Record<string, IntelligenceViewDefinition> = {
  ...INTELLIGENCE_VIEWS,
  ...EXTRA_VIEWS,
  "Space Debris": INTELLIGENCE_VIEWS["Space Debris Cloud"]!,
};

/** Navigation architecture. Celestial worlds still drive the 3D scene. */
export const NAV_GROUPS: { title: string; icon: string; items: string[] }[] = [
  {
    title: "CELESTIAL WORLDS",
    icon: "🌍",
    items: ["Sun", "Mercury", "Venus", "Earth", "Moon", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
  },
  {
    title: "LIVE TRACKERS",
    icon: "🛰️",
    items: ["Satellites", "ISS", "Space Debris", "Ground Stations", "Starlink", "Tiangong", "JWST / Hubble", "GNSS"],
  },
  { title: "SPACE MISSIONS", icon: "🚀", items: ["Active Missions", "Upcoming Launches", "Mission Archive", "Launch Schedule", "Rockets", "Spaceports"] },
  { title: "SPACE WEATHER", icon: "☀️", items: ["Solar Activity", "Solar Wind", "Geomagnetic Storms", "Aurora", "Space Weather"] },
  { title: "OBJECT INTELLIGENCE", icon: "☄️", items: ["Asteroids", "Near-Earth Objects", "Comets", "Conjunction Warnings", "Re-entry Forecast", "Maneuvers"] },
  { title: "ASTRONOMY", icon: "🔭", items: ["Stars", "Constellations", "Deep Sky Objects", "Sky Map", "Tonight's Visible Passes", "Lunar / Solar Transits", "Optical Sunlit Filter", "Radio Frequencies"] },
  { title: "ANALYTICS", icon: "📊", items: ["Orbital Analysis", "Telemetry Charts", "Data Explorer", "Active Payloads", "Surface Gazetteer", "Academy"] },
];

/* ------------------------------ Universal search ------------------------------ */

const SEARCH_INDEX: SearchResult[] = [
  ...BODY_IDS.map((body) => ({
    id: `body-${body}`,
    label: body,
    detail: "Celestial body / 3D scene",
    category: "CELESTIAL OBJECTS" as const,
    action: { kind: "body" as const, body },
  })),
  ...ACTIVE_ASSETS.map((asset) => ({
    id: `asset-${asset.id}`,
    label: asset.name,
    detail: `${asset.operator} · ${asset.type} · ${asset.body}`,
    category: "SATELLITES" as const,
    action: { kind: "body" as const, body: asset.body },
  })),
  ...SURFACE_PINS.map((pin) => ({
    id: `pin-${pin.id}`,
    label: pin.name,
    detail: `${pin.body} · ${pin.mission}`,
    category: "MISSIONS" as const,
    action: { kind: "body" as const, body: pin.body },
  })),
];

const VIEW_RESULTS: SearchResult[] = Object.entries(VIEW_REGISTRY).map(([key, def]) => ({
  id: `view-${def.id}-${key}`,
  label: def.title,
  detail: def.category,
  category:
    def.category === "OBJECT INTELLIGENCE"
      ? ("ASTEROIDS" as const)
      : def.category === "ASTRONOMY"
        ? ("STARS" as const)
        : def.category === "SPACE MISSIONS"
          ? ("MISSIONS" as const)
          : ("INTELLIGENCE VIEWS" as const),
  action: { kind: "view" as const, viewKey: key },
}));

const ROW_RESULTS: SearchResult[] = Object.entries(VIEW_REGISTRY).flatMap(([key, def]) =>
  def.rows.slice(0, 6).map((row, index) => ({
    id: `row-${def.id}-${index}`,
    label: row[0] ?? "",
    detail: `${def.title} · ${row.slice(1, 3).join(" · ")}`,
    category:
      def.category === "OBJECT INTELLIGENCE"
        ? ("ASTEROIDS" as const)
        : def.category === "ASTRONOMY"
          ? ("STARS" as const)
          : def.category === "SPACE MISSIONS"
            ? ("MISSIONS" as const)
            : ("SATELLITES" as const),
    action: { kind: "view" as const, viewKey: key },
  })),
);

export const SEARCH_CATALOG: SearchResult[] = [...SEARCH_INDEX, ...VIEW_RESULTS, ...ROW_RESULTS];

export function searchSpace(query: string, limit = 18): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const seen = new Set<string>();
  const out: SearchResult[] = [];
  for (const item of SEARCH_CATALOG) {
    if (out.length >= limit) break;
    const key = `${item.category}|${item.label.toLowerCase()}`;
    if (seen.has(key)) continue;
    if (item.label.toLowerCase().includes(q) || item.detail.toLowerCase().includes(q)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

export function groupResults(results: SearchResult[]) {
  const groups = new Map<string, SearchResult[]>();
  for (const r of results) {
    const list = groups.get(r.category) ?? [];
    list.push(r);
    groups.set(r.category, list);
  }
  return [...groups.entries()];
}
