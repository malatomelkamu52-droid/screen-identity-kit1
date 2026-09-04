import sunmap from "@/assets/tex/sunmap.json";
import mercurymap from "@/assets/tex/mercurymap.json";
import venusmap from "@/assets/tex/venusmap.json";
import earthDay from "@/assets/tex/earth-blue-marble.json";
import earthNight from "@/assets/tex/earth-night.json";
import earthSpec from "@/assets/tex/earthspec1k.json";
import earthClouds from "@/assets/tex/earthcloudmap.json";
import moonmap from "@/assets/tex/moonmap1k.json";
import moonbump from "@/assets/tex/moonbump1k.json";
import marsmap from "@/assets/tex/marsmap1k.json";
import marsbump from "@/assets/tex/marsbump1k.json";
import jupitermap from "@/assets/tex/jupitermap.json";
import saturnmap from "@/assets/tex/saturnmap.json";
import saturnring from "@/assets/tex/saturnringcolor.json";
import uranusmap from "@/assets/tex/uranusmap.json";
import uranusring from "@/assets/tex/uranusringcolour.json";
import neptunemap from "@/assets/tex/neptunemap.json";

export type BodyId =
  | "Sun"
  | "Mercury"
  | "Venus"
  | "Earth"
  | "Moon"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune";

export const BODY_IDS: BodyId[] = [
  "Sun",
  "Mercury",
  "Venus",
  "Earth",
  "Moon",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
];

export interface RingSpec {
  map: string;
  inner: number;
  outer: number;
}

export interface BodyInfo {
  id: BodyId;
  radius: number;
  tilt: number;
  spin: number;
  map: string;
  bump?: string;
  bumpScale?: number;
  roughness: number;
  metalness: number;
  emissive?: boolean;
  ring?: RingSpec;
  accent: string;
  diameterKm: string;
  gravity: string;
  orbitalPeriod: string;
  dayLength: string;
  meanTempC: string;
  fact: string;
  telemetry: { altitude: string; velocity: string; period: string; lat: string; lon: string };
}

export const BODIES: Record<BodyId, BodyInfo> = {
  Sun: {
    id: "Sun",
    radius: 2.1,
    tilt: 7.25,
    spin: 0.03,
    map: sunmap.url,
    roughness: 1,
    metalness: 0,
    emissive: true,
    accent: "#f7b733",
    diameterKm: "1,391,400 km",
    gravity: "274 m/s²",
    orbitalPeriod: "225 Myr (galactic)",
    dayLength: "25.4 days (equator)",
    meanTempC: "5,505 °C surface",
    fact: "A G-type main-sequence star fusing 600 million tonnes of hydrogen every second.",
    telemetry: { altitude: "1 AU stand-off", velocity: "220.0", period: "—", lat: "0.00° N", lon: "0.00° E" },
  },
  Mercury: {
    id: "Mercury",
    radius: 1.15,
    tilt: 0.03,
    spin: 0.04,
    map: mercurymap.url,
    roughness: 0.95,
    metalness: 0.05,
    accent: "#b6b2ab",
    diameterKm: "4,879 km",
    gravity: "3.7 m/s²",
    orbitalPeriod: "88 days",
    dayLength: "58.6 days",
    meanTempC: "167 °C",
    fact: "Scorched and airless, Mercury swings between 430 °C days and −180 °C nights.",
    telemetry: { altitude: "412.0", velocity: "2.94", period: "132.40", lat: "12.40° N", lon: "44.10° W" },
  },
  Venus: {
    id: "Venus",
    radius: 1.42,
    tilt: 177.36,
    spin: -0.02,
    map: venusmap.url,
    roughness: 0.9,
    metalness: 0,
    accent: "#e0b473",
    diameterKm: "12,104 km",
    gravity: "8.87 m/s²",
    orbitalPeriod: "225 days",
    dayLength: "243 days (retrograde)",
    meanTempC: "464 °C",
    fact: "A runaway greenhouse world where surface pressure equals 900 m of ocean depth.",
    telemetry: { altitude: "298.0", velocity: "7.21", period: "94.20", lat: "3.90° S", lon: "18.60° E" },
  },
  Earth: {
    id: "Earth",
    radius: 1.5,
    tilt: 23.44,
    spin: 0.08,
    map: earthDay.url,
    roughness: 0.65,
    metalness: 0.1,
    accent: "#3b9dff",
    diameterKm: "12,742 km",
    gravity: "9.81 m/s²",
    orbitalPeriod: "365.25 days",
    dayLength: "23h 56m",
    meanTempC: "15 °C",
    fact: "The only known world with liquid surface water — and 14,000+ tracked orbital objects.",
    telemetry: { altitude: "408.2", velocity: "7.66", period: "92.68", lat: "28.53° N", lon: "80.64° W" },
  },
  Moon: {
    id: "Moon",
    radius: 1.05,
    tilt: 6.68,
    spin: 0.02,
    map: moonmap.url,
    bump: moonbump.url,
    bumpScale: 0.035,
    roughness: 1,
    metalness: 0,
    accent: "#cbd2dd",
    diameterKm: "3,475 km",
    gravity: "1.62 m/s²",
    orbitalPeriod: "27.3 days",
    dayLength: "29.5 days",
    meanTempC: "−20 °C",
    fact: "Tidally locked to Earth — the far side was unseen by humans until Luna 3 in 1959.",
    telemetry: { altitude: "112.0", velocity: "1.63", period: "118.00", lat: "0.67° N", lon: "23.47° E" },
  },
  Mars: {
    id: "Mars",
    radius: 1.3,
    tilt: 25.19,
    spin: 0.075,
    map: marsmap.url,
    bump: marsbump.url,
    bumpScale: 0.045,
    roughness: 0.98,
    metalness: 0,
    accent: "#d1573a",
    diameterKm: "6,779 km",
    gravity: "3.72 m/s²",
    orbitalPeriod: "687 days",
    dayLength: "24h 37m",
    meanTempC: "−63 °C",
    fact: "Home to Olympus Mons — the largest volcano in the Solar System, 22 km tall.",
    telemetry: { altitude: "255.0", velocity: "3.38", period: "112.20", lat: "18.44° N", lon: "77.45° E" },
  },
  Jupiter: {
    id: "Jupiter",
    radius: 2.0,
    tilt: 3.13,
    spin: 0.16,
    map: jupitermap.url,
    roughness: 0.85,
    metalness: 0,
    accent: "#d9a26b",
    diameterKm: "139,820 km",
    gravity: "24.79 m/s²",
    orbitalPeriod: "11.86 years",
    dayLength: "9h 56m",
    meanTempC: "−145 °C",
    fact: "The Great Red Spot is a storm wider than Earth that has raged for centuries.",
    telemetry: { altitude: "4,200.0", velocity: "13.07", period: "212.60", lat: "22.10° S", lon: "9.30° W" },
  },
  Saturn: {
    id: "Saturn",
    radius: 1.75,
    tilt: 26.73,
    spin: 0.14,
    map: saturnmap.url,
    roughness: 0.85,
    metalness: 0,
    ring: { map: saturnring.url, inner: 2.3, outer: 4.0 },
    accent: "#e2c68f",
    diameterKm: "116,460 km",
    gravity: "10.44 m/s²",
    orbitalPeriod: "29.5 years",
    dayLength: "10h 42m",
    meanTempC: "−178 °C",
    fact: "Its rings span 280,000 km yet average only about 10 metres thick.",
    telemetry: { altitude: "3,010.0", velocity: "9.68", period: "198.40", lat: "6.80° N", lon: "132.10° E" },
  },
  Uranus: {
    id: "Uranus",
    radius: 1.6,
    tilt: 97.77,
    spin: -0.1,
    map: uranusmap.url,
    roughness: 0.8,
    metalness: 0,
    ring: { map: uranusring.url, inner: 2.0, outer: 2.9 },
    accent: "#7ad6e0",
    diameterKm: "50,724 km",
    gravity: "8.87 m/s²",
    orbitalPeriod: "84 years",
    dayLength: "17h 14m",
    meanTempC: "−195 °C",
    fact: "Tipped 97.77° on its side, Uranus effectively orbits the Sun rolling like a barrel.",
    telemetry: { altitude: "2,480.0", velocity: "6.80", period: "176.30", lat: "41.20° S", lon: "58.00° W" },
  },
  Neptune: {
    id: "Neptune",
    radius: 1.58,
    tilt: 28.32,
    spin: 0.11,
    map: neptunemap.url,
    roughness: 0.8,
    metalness: 0,
    accent: "#4f6fe0",
    diameterKm: "49,244 km",
    gravity: "11.15 m/s²",
    orbitalPeriod: "165 years",
    dayLength: "16h 6m",
    meanTempC: "−201 °C",
    fact: "Supersonic winds reach 2,100 km/h — the fastest measured anywhere in the Solar System.",
    telemetry: { altitude: "2,905.0", velocity: "5.43", period: "182.90", lat: "29.40° N", lon: "14.70° E" },
  },
};

export const EARTH_TEXTURES = {
  day: earthDay.url,
  night: earthNight.url,
  spec: earthSpec.url,
  clouds: earthClouds.url,
};

export interface SurfacePin {
  id: string;
  body: BodyId;
  name: string;
  lat: number;
  lon: number;
  mission: string;
  fact: string;
  /** Optional hardware detail — present for active surface assets */
  operator?: string;
  type?: string;
  launchDate?: string;
  arrivalDate?: string;
  status?: string;
  objectives?: string;
  /** Human-readable elevation / depth of the feature, when known */
  elevation?: string;
}


export const SURFACE_PINS: SurfacePin[] = [
  {
    id: "curiosity",
    body: "Mars",
    name: "Curiosity (Gale Crater)",
    lat: -5.4,
    lon: 137.8,
    mission: "ACTIVE ROVER",
    fact: "Nuclear-powered rover climbing Mount Sharp since 2012, reading Mars' layered climate record.",
    operator: "NASA",
    type: "Active Rover",
    launchDate: "2011-11-26",
    arrivalDate: "2012-08-06 (landing)",
    status: "Active — surface operations",
    objectives: "Assess whether Gale Crater ever offered habitable conditions for microbial life.",
  },
  {
    id: "perseverance",
    body: "Mars",
    name: "Perseverance (Jezero Delta)",
    lat: 18.44,
    lon: 77.45,
    mission: "ACTIVE ROVER",
    fact: "Caching sealed rock cores for a future Mars Sample Return campaign.",
    operator: "NASA",
    type: "Active Rover",
    launchDate: "2020-07-30",
    arrivalDate: "2021-02-18 (landing)",
    status: "Active — sample caching",
    objectives: "Search for ancient biosignatures in delta sediments and produce oxygen with MOXIE.",
  },
  {
    id: "zhurong",
    body: "Mars",
    name: "Zhurong (Utopia Planitia)",
    lat: 25.07,
    lon: 109.93,
    mission: "TIANWEN-1 ROVER",
    fact: "Radar sounding revealed thick layered deposits beneath Utopia Planitia before dormancy.",
    operator: "CNSA",
    type: "Rover — dormant",
    launchDate: "2020-07-23",
    arrivalDate: "2021-05-14 (landing)",
    status: "Dormant since May 2022",
    objectives: "Survey soil composition, subsurface structure and water-ice distribution.",
  },
  {
    id: "vikram",
    body: "Moon",
    name: "Vikram / Pragyan (South Pole)",
    lat: -69.37,
    lon: 32.32,
    mission: "CHANDRAYAAN-3",
    fact: "First soft landing near the lunar south pole, 23 August 2023.",
    operator: "ISRO",
    type: "Lander + Rover",
    launchDate: "2023-07-14",
    arrivalDate: "2023-08-23 (landing)",
    status: "Mission complete — sleeping through lunar night",
    objectives: "Measure south-polar regolith thermophysics, seismicity and elemental composition.",
  },
  {
    id: "yutu-2",
    body: "Moon",
    name: "Yutu-2 (Von Kármán Crater)",
    lat: -45.44,
    lon: 177.6,
    mission: "CHANG'E-4",
    fact: "The first rover to operate on the lunar far side, landed January 2019.",
    operator: "CNSA",
    type: "Far-side Rover",
    launchDate: "2018-12-07",
    arrivalDate: "2019-01-03 (landing)",
    status: "Active — far-side traverse",
    objectives: "Probe far-side regolith layering and mantle-derived material with ground-penetrating radar.",
  },

  {
    id: "olympus-mons",
    body: "Mars",
    name: "Olympus Mons",
    lat: 18.65,
    lon: 226.2,
    mission: "VOLCANIC GIANT",
    fact: "The tallest known volcano in the Solar System, rising ~22 km above the Martian datum.",
    elevation: "+21.9 km above datum",
  },
  {
    id: "valles-marineris",
    body: "Mars",
    name: "Valles Marineris",
    lat: -13.9,
    lon: 300.0,
    mission: "CANYON SYSTEM",
    fact: "A 4,000 km rift system up to 7 km deep — ten times longer than the Grand Canyon.",
    elevation: "−7.0 km below datum",
  },
  {
    id: "jezero",
    body: "Mars",
    name: "Jezero Crater",
    lat: 18.44,
    lon: 77.45,
    mission: "PERSEVERANCE",
    fact: "An ancient river delta where Perseverance caches rock cores hunting for biosignatures.",
  },
  {
    id: "apollo-11",
    body: "Moon",
    name: "Tranquility Base",
    lat: 0.674,
    lon: 23.473,
    mission: "APOLLO 11",
    fact: "Humanity's first foothold on another world, touched down 20 July 1969.",
  },
  {
    id: "shackleton",
    body: "Moon",
    name: "Shackleton Crater",
    lat: -89.9,
    lon: 0,
    mission: "ARTEMIS TARGET",
    fact: "A permanently shadowed south-pole crater believed to hold accessible water ice.",
  },
  {
    id: "kennedy",
    body: "Earth",
    name: "Kennedy Space Center",
    lat: 28.5729,
    lon: -80.649,
    mission: "SPACEPORT",
    fact: "NASA's Florida launch complex — Apollo, Shuttle, and now Artemis fly from LC-39.",
  },
  {
    id: "baikonur",
    body: "Earth",
    name: "Baikonur Cosmodrome",
    lat: 45.965,
    lon: 63.305,
    mission: "SPACEPORT",
    fact: "The world's first spaceport, launch site of Sputnik 1 and Yuri Gagarin's Vostok 1.",
  },

  /* ---------------- Gazetteer: Mercury ---------------- */
  {
    id: "caloris-basin",
    body: "Mercury",
    name: "Caloris Basin",
    lat: 30.5,
    lon: -189.8,
    mission: "IMPACT BASIN",
    fact: "Massive 1,550 km impact basin formed by a major asteroid collision.",
    elevation: "Basin floor, −2 km",
  },
  {
    id: "beagle-rupes",
    body: "Mercury",
    name: "Beagle Rupes",
    lat: -2.1,
    lon: -102.6,
    mission: "TECTONIC SCARP",
    fact: "Giant tectonic cliff 600 km long formed as Mercury's core cooled and contracted.",
    elevation: "2 km scarp face",
  },

  /* ---------------- Gazetteer: Venus ---------------- */
  {
    id: "maxwell-montes",
    body: "Venus",
    name: "Maxwell Montes",
    lat: 65.2,
    lon: 3.3,
    mission: "MOUNTAIN RANGE",
    fact: "Highest mountain range on Venus (11 km above mean elevation).",
    elevation: "+11.0 km above mean radius",
  },
  {
    id: "maat-mons",
    body: "Venus",
    name: "Maat Mons",
    lat: 0.5,
    lon: 194.6,
    mission: "SHIELD VOLCANO",
    fact: "Massive 8 km high shield volcano with evidence of active volcanism.",
    elevation: "+8.0 km above mean radius",
  },

  /* ---------------- Gazetteer: Jupiter ---------------- */
  {
    id: "great-red-spot",
    body: "Jupiter",
    name: "Great Red Spot",
    lat: -22,
    lon: -9,
    mission: "SUPER-STORM",
    fact: "Anticyclonic super-storm larger than Earth raging for over 350 years.",
    elevation: "Cloud tops ~8 km above deck",
  },
  {
    id: "oval-ba",
    body: "Jupiter",
    name: "Oval BA (Red Spot Jr)",
    lat: -33,
    lon: 105,
    mission: "MERGED STORM",
    fact: "Second largest storm formed from merged white ovals.",
    elevation: "Cloud-top level",
  },

  /* ---------------- Gazetteer: Saturn ---------------- */
  {
    id: "saturn-hexagon",
    body: "Saturn",
    name: "Hexagonal North Pole Storm",
    lat: 78,
    lon: 0,
    mission: "POLAR JET",
    fact: "Persistent geometric atmospheric jet stream over 30,000 km wide.",
    elevation: "Cloud-top jet, ~100 km deep",
  },
  {
    id: "cassini-division",
    body: "Saturn",
    name: "Cassini Division",
    lat: 0,
    lon: 90,
    mission: "RING GAP",
    fact: "4,800 km wide gap between Saturn's A and B rings cleared by moon Mimas.",
    elevation: "Ring plane (0 km)",
  },

  /* ---------------- Gazetteer: Uranus ---------------- */
  {
    id: "verona-rupes",
    body: "Uranus",
    name: "Miranda's Verona Rupes",
    lat: -18,
    lon: 170,
    mission: "MOON — MIRANDA",
    fact: "Tallest known cliff face in the Solar System (estimated 20 km vertical drop).",
    elevation: "20 km vertical scarp",
  },
  {
    id: "uranus-polar-collar",
    body: "Uranus",
    name: "South Polar Bright Collar",
    lat: -60,
    lon: 0,
    mission: "CLOUD VORTEX",
    fact: "Seasonal methane cloud vortex.",
    elevation: "Upper methane haze",
  },

  /* ---------------- Gazetteer: Neptune ---------------- */
  {
    id: "great-dark-spot",
    body: "Neptune",
    name: "Great Dark Spot",
    lat: -22,
    lon: -30,
    mission: "SUPERSONIC STORM",
    fact: "Earth-sized supersonic storm system with winds reaching 2,100 km/h.",
    elevation: "Cloud-top level",
  },
  {
    id: "neptune-south-vortex",
    body: "Neptune",
    name: "South Polar Vortex",
    lat: -70,
    lon: 60,
    mission: "POLAR CYCLONE",
    fact: "Warm cyclonic core storm at Neptune's south pole.",
    elevation: "Cloud-top level",
  },
];

export function pinsFor(body: BodyId) {
  return SURFACE_PINS.filter((p) => p.body === body);
}

export function latLonToVec3(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

export type IntelligenceVisual =
  | "satellite"
  | "station"
  | "telescope"
  | "gnss"
  | "payload"
  | "debris"
  | "conjunction"
  | "reentry"
  | "maneuver"
  | "weather"
  | "passes"
  | "transit"
  | "terminator"
  | "radio"
  | "launch"
  | "rocket"
  | "spaceport"
  | "surface"
  | "academy";

export interface IntelligenceMetric {
  label: string;
  value: string;
  detail?: string;
}

export interface IntelligenceViewDefinition {
  id: string;
  category: string;
  title: string;
  status: string;
  visual: IntelligenceVisual;
  definition: string;
  protocol: string;
  metrics: IntelligenceMetric[];
  columns: string[];
  rows: string[][];
  filters?: string[] | undefined;
}

const view = (
  id: string,
  category: string,
  title: string,
  status: string,
  visual: IntelligenceVisual,
  definition: string,
  protocol: string,
  metrics: IntelligenceMetric[],
  columns: string[],
  rows: string[][],
  filters?: string[],
): IntelligenceViewDefinition => ({
  id, category, title, status, visual, definition, protocol, metrics, columns, rows, filters,
});

export const INTELLIGENCE_VIEWS: Record<string, IntelligenceViewDefinition> = {
  Starlink: view(
    "starlink", "LIVE TRACKERS", "Starlink Constellation", "LIVE TELEMETRY", "satellite",
    "A large LEO broadband constellation operated by SpaceX. Operational shells are concentrated near 550 km with a characteristic 53° inclination, using phased-array user links and inter-satellite laser links on many newer spacecraft.",
    "Track shell occupancy, spacecraft health, ephemeris age and crosslink topology. Collision screening uses propagated state vectors and conjunction thresholds before any maneuver recommendation.",
    [
      { label: "ACTIVE FLEET", value: "6,000+", detail: "constellation-scale catalog" },
      { label: "NOMINAL ALTITUDE", value: "550 km", detail: "primary LEO shell" },
      { label: "INCLINATION", value: "53°", detail: "core shell" },
      { label: "CROSSLINK", value: "LASER", detail: "inter-satellite links" },
    ],
    ["Asset", "Shell", "Altitude", "Incl.", "Status"],
    [
      ["STARLINK-CORE-01", "550 km / 53°", "550 km", "53°", "OPERATIONAL"],
      ["STARLINK-CORE-02", "540 km / 53°", "540 km", "53°", "OPERATIONAL"],
      ["STARLINK-DIRECT-TO-CELL", "560 km / 43°", "560 km", "43°", "COMMISSIONING"],
      ["STARLINK-TRANSFER", "Parking / raising", "410 km", "51.6°", "TRANSFER"],
    ],
    ["ALL", "OPERATIONAL", "COMMISSIONING", "TRANSFER"],
  ),
  ISS: view(
    "iss", "LIVE TRACKERS", "International Space Station", "LIVE TELEMETRY", "station",
    "The ISS is a continuously crewed modular research platform in low Earth orbit. Its operational orbit is roughly 400–420 km and it completes an orbit in about 92.7 minutes at approximately 7.66 km/s.",
    "Use the current state vector for sub-point latitude/longitude, altitude and velocity. Crew, attitude, visiting vehicle and payload records are correlated with the station's mission timeline.",
    [
      { label: "VELOCITY", value: "7.66 km/s" },
      { label: "ALTITUDE", value: "408 km" },
      { label: "ORBIT", value: "92.68 min" },
      { label: "CREW", value: "EXPEDITION", detail: "roster sync required for live names" },
    ],
    ["Stream", "Value", "Unit", "State", "Age"],
    [
      ["Velocity", "7.66", "km/s", "LIVE", "<1 s"],
      ["Altitude", "408", "km", "LIVE", "<1 s"],
      ["Sub-point", "PROPAGATED", "lat/lon", "LIVE", "<1 s"],
      ["Crew manifest", "EXPEDITION", "crew", "CATALOG", "SYNCED"],
    ],
    ["ALL", "LIVE", "CATALOG"],
  ),
  Tiangong: view(
    "tiangong", "LIVE TRACKERS", "Tiangong Space Station", "LIVE TELEMETRY", "station",
    "China's modular space station centered on the Tianhe core module with Wentian and Mengtian laboratory cabins. Its crewed orbital regime is around 390 km in low Earth orbit.",
    "Monitor station state vectors, module configuration, crewed-flight status and visiting vehicle windows. Operational data should be validated against current mission control releases before use.",
    [
      { label: "ALTITUDE", value: "~390 km" },
      { label: "CORE", value: "TIANHE" },
      { label: "LAB MODULES", value: "2", detail: "Wentian + Mengtian" },
      { label: "ORBITAL CLASS", value: "LEO" },
    ],
    ["Module / Asset", "Orbit", "Role", "Status", "Telemetry"],
    [
      ["Tianhe", "~390 km LEO", "Core / propulsion", "OPERATIONAL", "SYNCED"],
      ["Wentian", "~390 km LEO", "Laboratory", "OPERATIONAL", "SYNCED"],
      ["Mengtian", "~390 km LEO", "Laboratory", "OPERATIONAL", "SYNCED"],
      ["Crew vehicle slot", "LEO rendezvous", "Crew transport", "SCHEDULED", "WATCH"],
    ],
    ["ALL", "OPERATIONAL", "SCHEDULED"],
  ),
  "JWST / Hubble": view(
    "jwst-hubble", "LIVE TRACKERS", "JWST / Hubble Observatory Pair", "CATALOG SYNCED", "telescope",
    "Compare two flagship observatories: JWST operates around the Sun–Earth L2 region about 1.5 million km from Earth, while Hubble operates in LEO near 535 km. Their thermal, pointing and instrument telemetry regimes are fundamentally different.",
    "Track attitude, thermal state, power, instrument modes and science-data downlink. L2 geometry is represented as a heliocentric halo orbit rather than an Earth-centered circular orbit.",
    [
      { label: "JWST ORBIT", value: "SUN–EARTH L2", detail: "~1.5M km from Earth" },
      { label: "HUBBLE ALTITUDE", value: "~535 km" },
      { label: "JWST PRIMARY", value: "6.5 m", detail: "segmented mirror" },
      { label: "HUBBLE PRIMARY", value: "2.4 m" },
    ],
    ["Observatory", "Orbit", "Primary", "Thermal", "State"],
    [
      ["JWST", "Sun–Earth L2 halo", "6.5 m", "Cryogenic", "SCIENCE"],
      ["Hubble", "LEO ~535 km", "2.4 m", "Active thermal", "SCIENCE"],
      ["JWST instruments", "L2", "NIRCam/MIRI/etc.", "Cryogenic", "NOMINAL"],
      ["Hubble instruments", "LEO", "WFC3/ACS/etc.", "Thermal cycling", "NOMINAL"],
    ],
    ["ALL", "SCIENCE", "NOMINAL"],
  ),
  GNSS: view(
    "gnss", "LIVE TRACKERS", "Global Navigation Satellite Systems", "LIVE TELEMETRY", "gnss",
    "A comparative navigation view for GPS, Galileo, GLONASS and BeiDou. Most global navigation spacecraft operate in medium Earth orbit; timing performance depends on atomic clocks, control-segment corrections and receiver modeling.",
    "Compare constellation geometry, signal bands, clock type, orbit regime and service health. Positioning solutions use multi-constellation observations with ephemeris and clock corrections.",
    [
      { label: "GPS", value: "MEO ~20,200 km", detail: "atomic clocks" },
      { label: "GALILEO", value: "MEO ~23,222 km", detail: "high-precision timing" },
      { label: "GLONASS", value: "MEO ~19,100 km", detail: "24-slot design" },
      { label: "BEIDOU", value: "MEO + GEO/IGSO", detail: "hybrid architecture" },
    ],
    ["Constellation", "Orbit", "Clock", "Service", "Class"],
    [
      ["GPS", "MEO ~20,200 km", "Rb/Cs", "PNT", "GLOBAL"],
      ["Galileo", "MEO ~23,222 km", "Rb/PHM", "PNT", "GLOBAL"],
      ["GLONASS", "MEO ~19,100 km", "Cs/Rb", "PNT", "GLOBAL"],
      ["BeiDou", "MEO/GEO/IGSO", "Rb", "PNT", "GLOBAL"],
    ],
    ["ALL", "GPS", "Galileo", "GLONASS", "BeiDou"],
  ),
  "Active Payloads": view(
    "active-payloads", "LIVE TRACKERS", "Active Payload Catalog", "CATALOG SYNCED", "payload",
    "An itemized catalog of active orbital payloads grouped by operator, country, mission class and orbital regime. Payload records separate the mission spacecraft from launch vehicles and spent stages.",
    "Filter by operator and mission class, then inspect orbit, mission state and telemetry freshness. Catalog synchronization is the authoritative step before treating a payload as operational.",
    [
      { label: "MISSION CLASSES", value: "PNT / EO / COMMS / SCI" },
      { label: "OPERATORS", value: "GLOBAL" },
      { label: "PRIMARY REGIMES", value: "LEO / MEO / GEO / L2" },
      { label: "DATA MODEL", value: "ASSET-CENTRIC" },
    ],
    ["Payload", "Country", "Class", "Orbit", "Status"],
    [
      ["Earth observation cluster", "USA", "EO", "LEO", "ACTIVE"],
      ["Galileo navigation payload", "ESA/EU", "PNT", "MEO", "ACTIVE"],
      ["Commercial broadband payload", "USA", "COMMS", "LEO", "ACTIVE"],
      ["Science observatory", "International", "SCIENCE", "L2/LEO", "ACTIVE"],
    ],
    ["ALL", "USA", "ESA/EU", "China", "India", "Japan"],
  ),
  "Space Debris Cloud": view(
    "debris", "SPACE INTEL & SSA", "Space Debris Cloud", "ACTIVE SSA MODEL", "debris",
    "A 3D population model of tracked orbital debris, emphasizing dense LEO shells and long-lived GEO disposal/collision environments. Kessler Syndrome is a cascading-collision risk scenario, not a single measured event.",
    "Fuse catalogued objects, covariance and propagators to estimate encounter density. Risk scores are screening indicators and require conjunction-specific probability-of-collision analysis.",
    [
      { label: "LEO ENVIRONMENT", value: "HIGH DENSITY" },
      { label: "GEO ENVIRONMENT", value: "LONG LIVED" },
      { label: "THREAT MODEL", value: "FRAGMENTATION" },
      { label: "RISK OUTPUT", value: "RELATIVE SCORE" },
    ],
    ["Object", "Regime", "Size", "Risk", "Track"],
    [
      ["Fragment cloud A", "LEO", "10–100 cm", "HIGH", "TRACKED"],
      ["Upper-stage cluster", "LEO", ">1 m", "MEDIUM", "TRACKED"],
      ["GEO debris shell", "GEO", "mixed", "MEDIUM", "TRACKED"],
      ["Uncorrelated candidate", "LEO", "unknown", "WATCH", "PENDING"],
    ],
    ["ALL", "LEO", "GEO", "HIGH RISK", "WATCH"],
  ),
  "Conjunction Warnings": view(
    "conjunctions", "SPACE INTEL & SSA", "Conjunction Warnings", "ACTIVE CONJUNCTION MONITOR", "conjunction",
    "A close-approach feed for two tracked objects. The principal screening values are miss distance, relative velocity and collision probability (Pc), with uncertainty represented by state-vector covariance.",
    "Rank events by time to closest approach, Pc and miss distance. Maneuver decisions require covariance quality, maneuverability, mission constraints and independent confirmation.",
    [
      { label: "SCREENING", value: "CONTINUOUS" },
      { label: "PRIMARY METRIC", value: "P₍c₎" },
      { label: "DISTANCE", value: "METERS" },
      { label: "VELOCITY", value: "KM/S" },
    ],
    ["Event", "Miss Dist.", "Rel. Vel.", "P₍c₎", "Window"],
    [
      ["CDM-20481", "184 m", "7.4 km/s", "2.1e-4", "T−06:18"],
      ["CDM-20482", "742 m", "3.2 km/s", "4.8e-5", "T−11:42"],
      ["CDM-20483", "1.82 km", "9.1 km/s", "8.2e-6", "T−19:07"],
      ["CDM-20484", "3.40 km", "1.7 km/s", "1.1e-6", "T−27:55"],
    ],
    ["ALL", "HIGH", "WATCH", "CLEARED"],
  ),
  "Re-entry Forecast": view(
    "reentry", "SPACE INTEL & SSA", "Atmospheric Re-entry Forecast", "FORECAST MODEL RUNNING", "reentry",
    "Forecasts the atmospheric decay and re-entry window of uncontrolled spacecraft, spent upper stages and other catalogued objects. Drag uncertainty expands rapidly near the final phase of decay.",
    "Propagate ballistic coefficient, solar activity and atmospheric-density uncertainty. Report a time window rather than a false point prediction, and update as tracking data arrives.",
    [
      { label: "MODEL", value: "NUMERICAL PROPAGATION" },
      { label: "MAIN ERROR SOURCE", value: "ATMOSPHERIC DRAG" },
      { label: "OUTPUT", value: "TIME WINDOW" },
      { label: "UPDATE", value: "EVENT DRIVEN" },
    ],
    ["Object", "Perigee", "Forecast", "Window", "Confidence"],
    [
      ["R/B 2026-041", "112 km", "27 Aug 2026", "± 9 h", "MEDIUM"],
      ["SAT-DECAY-771", "138 km", "28 Aug 2026", "± 14 h", "LOW"],
      ["R/B 2026-038", "154 km", "29 Aug 2026", "± 22 h", "LOW"],
      ["PAYLOAD-DECAY-19", "166 km", "31 Aug 2026", "± 30 h", "LOW"],
    ],
    ["ALL", "MEDIUM", "LOW"],
  ),
  Maneuvers: view(
    "maneuvers", "SPACE INTEL & SSA", "Orbital Maneuvers", "MANEUVER LOG SYNCED", "maneuver",
    "A mission-control style log of orbit-raising, station-keeping and collision-avoidance burns. Each burn is represented by a delta-v vector, execution time and resulting orbit change.",
    "Validate burn planning against attitude, propellant, thruster availability and conjunction screening. Post-burn orbit determination closes the maneuver loop.",
    [
      { label: "CORE UNIT", value: "Δv (m/s)" },
      { label: "OPERATIONS", value: "RAISE / LOWER / AVOID" },
      { label: "CONTROL LOOP", value: "PLAN → BURN → OD" },
      { label: "STATUS", value: "MONITORED" },
    ],
    ["Burn", "Δv", "Purpose", "Epoch", "Result"],
    [
      ["MAN-801", "+12.4 m/s", "Orbit raise", "T−02:14", "EXECUTED"],
      ["MAN-802", "−3.1 m/s", "Phase adjust", "T−05:40", "EXECUTED"],
      ["MAN-803", "+0.8 m/s", "Collision avoid", "T−09:15", "PLANNED"],
      ["MAN-804", "+6.7 m/s", "Station keeping", "T+18:20", "SCHEDULED"],
    ],
    ["ALL", "EXECUTED", "PLANNED", "SCHEDULED"],
  ),
  "Space Weather": view(
    "space-weather", "SPACE INTEL & SSA", "Space Weather Monitor", "LIVE SOLAR TELEMETRY", "weather",
    "A solar-environment dashboard covering solar-wind speed, geomagnetic activity (Kp), solar X-ray flux and radiation-belt alerts that can affect spacecraft and communications.",
    "Correlate solar observations with upstream solar-wind measurements and geomagnetic indices. Operational alerts should distinguish observed values from forecast values.",
    [
      { label: "SOLAR WIND", value: "~450 km/s" },
      { label: "Kp", value: "2", detail: "quiet-to-active boundary" },
      { label: "X-RAY", value: "B-CLASS", detail: "illustrative feed state" },
      { label: "RADIATION", value: "WATCH" },
    ],
    ["Feed", "Value", "Unit", "Trend", "Alert"],
    [
      ["Solar wind", "450", "km/s", "STABLE", "GREEN"],
      ["Kp index", "2", "index", "RISING", "GREEN"],
      ["X-ray flux", "B-class", "W/m²", "LOW", "GREEN"],
      ["Radiation belt", "NORMAL", "state", "STABLE", "GREEN"],
    ],
    ["ALL", "GREEN", "WATCH", "ALERT"],
  ),
  "Tonight's Visible Passes": view(
    "visible-passes", "OBSERVATION", "Tonight's Visible Passes", "PASS PREDICTIONS READY", "passes",
    "Predicts visible satellite passes for an observer using orbital propagation, local twilight, satellite magnitude and maximum elevation angle. Visibility depends strongly on Sun angle and observer conditions.",
    "Set the observer location, propagate each candidate object and filter by illumination, elevation and brightness. Predictions are local-time events derived from UTC ephemerides.",
    [
      { label: "FILTER", value: "NAKED EYE" },
      { label: "MIN ELEVATION", value: "10°" },
      { label: "BRIGHTNESS", value: "MAG ≤ 4.0" },
      { label: "TWILIGHT", value: "ASTRONOMICAL" },
    ],
    ["Object", "Rise", "Peak", "Mag.", "Max El."],
    [
      ["ISS", "21:42", "21:47", "−3.8", "67°"],
      ["Starlink train", "22:08", "22:13", "2.4", "54°"],
      ["Tiangong", "22:31", "22:36", "0.8", "48°"],
      ["Hubble", "23:17", "23:22", "1.7", "39°"],
    ],
    ["ALL", "BRIGHT", "HIGH ELEVATION", "ISS", "STARLINK"],
  ),
  "Lunar / Solar Transits": view(
    "transits", "OBSERVATION", "Lunar / Solar Transit Calculator", "EPHEMERIS ENGINE READY", "transit",
    "Calculates when a spacecraft crosses the apparent solar or lunar disk from an observer's location. These events are short, geometry-sensitive and require accurate observer coordinates and ephemerides.",
    "Solve observer-object-body geometry, then apply angular-diameter and limb-crossing constraints. Safety controls must be used for solar observation; never observe the Sun optically without proper solar equipment.",
    [
      { label: "TARGETS", value: "ISS / TIANGONG" },
      { label: "BODIES", value: "SUN / MOON" },
      { label: "PRECISION", value: "SECOND-LEVEL" },
      { label: "OUTPUT", value: "CONTACT TIMES" },
    ],
    ["Event", "Target", "Body", "UTC", "Duration"],
    [
      ["TR-301", "ISS", "SUN", "09:18:42", "0.74 s"],
      ["TR-302", "Tiangong", "MOON", "11:04:17", "1.21 s"],
      ["TR-303", "ISS", "SUN", "14:51:09", "0.63 s"],
      ["TR-304", "Tiangong", "MOON", "16:22:31", "0.92 s"],
    ],
    ["ALL", "SOLAR", "LUNAR"],
  ),
  "Optical Sunlit Filter": view(
    "sunlit", "OBSERVATION", "Optical Sunlit Filter", "ILLUMINATION MODEL ACTIVE", "terminator",
    "Separates spacecraft that are sunlit from those in Earth's umbra or penumbra. This filter is essential for optical observation because reflected sunlight largely controls apparent satellite brightness.",
    "Evaluate Sun-object-Earth geometry along the propagated orbit, classify illumination state and combine it with observer darkness before producing a visible-pass candidate.",
    [
      { label: "STATE A", value: "SUNLIT" },
      { label: "STATE B", value: "PENUMBRA" },
      { label: "STATE C", value: "UMBRA" },
      { label: "OUTPUT", value: "OBSERVABLE / HIDDEN" },
    ],
    ["Asset", "Illumination", "Observer", "Magnitude", "Optical"],
    [
      ["ISS", "SUNLIT", "DARK", "−3.8", "VISIBLE"],
      ["STARLINK-01", "PENUMBRA", "DARK", "4.9", "MARGINAL"],
      ["HUBBLE", "UMBRA", "DARK", "—", "HIDDEN"],
      ["TIANGONG", "SUNLIT", "DUSK", "0.8", "VISIBLE"],
    ],
    ["ALL", "SUNLIT", "PENUMBRA", "UMBRA"],
  ),
  "Radio Frequencies": view(
    "radio", "OBSERVATION", "Space Radio Frequency Monitor", "RF CATALOG SYNCED", "radio",
    "Catalogues active and mission-associated downlink bands including UHF, VHF, S-band and X-band. Doppler shift must be compensated as a spacecraft's radial velocity changes relative to the observer.",
    "Select a spacecraft and link direction, then calculate expected Doppler offset from the propagated radial velocity. Frequency assignments are mission-specific and should be validated before transmission.",
    [
      { label: "BANDS", value: "VHF / UHF / S / X" },
      { label: "DOPPLER", value: "REAL-TIME" },
      { label: "PRIMARY INPUT", value: "RADIAL VELOCITY" },
      { label: "MODE", value: "RX / DOWNLINK" },
    ],
    ["Asset", "Band", "Center", "Shift", "Link"],
    [
      ["ISS amateur/ops", "VHF/UHF", "145–437 MHz", "± kHz", "RX"],
      ["Earth-observation payload", "X-band", "8.2 GHz class", "± kHz", "DOWNLINK"],
      ["Deep-space relay", "S-band", "2.2 GHz class", "± kHz", "DOWNLINK"],
      ["Tracking beacon", "UHF", "400 MHz class", "± kHz", "RX"],
    ],
    ["ALL", "VHF", "UHF", "S-BAND", "X-BAND"],
  ),
  "Launch Schedule": view(
    "launches", "VEHICLES & DATA", "Global Launch Schedule", "LIVE T−MINUS FEED", "launch",
    "A launch manifest spanning major orbital launch systems and spaceports. The countdown is event-driven and should distinguish target time, hold status, weather constraints and actual liftoff.",
    "Track launch provider, vehicle, pad, mission, target orbit and countdown state. A T-minus value is only meaningful when the countdown clock is actively running.",
    [
      { label: "ACTIVE WINDOWS", value: "GLOBAL" },
      { label: "COUNTDOWN", value: "T−CLOCK" },
      { label: "PRIMARY ORBITS", value: "LEO / MEO / GEO" },
      { label: "CONSTRAINTS", value: "WEATHER / RANGE" },
    ],
    ["Mission", "Vehicle", "Site", "T−", "State"],
    [
      ["Starlink Group", "Falcon 9", "LC-39A", "T−18:42", "GO"],
      ["Heavy payload", "Falcon Heavy", "LC-39A", "T−2:04:10", "COUNTDOWN"],
      ["Artemis campaign", "SLS", "LC-39B", "TBD", "PLANNED"],
      ["Commercial LEO", "Ariane 6", "Kourou", "TBD", "PLANNED"],
      ["Orbital demo", "Electron", "Mahia", "TBD", "PLANNED"],
    ],
    ["ALL", "GO", "COUNTDOWN", "PLANNED", "HOLD"],
  ),
  Rockets: view(
    "rockets", "VEHICLES & DATA", "Launch Vehicle Technical Library", "CATALOG SYNCED", "rocket",
    "A technical comparison of heavy and super-heavy orbital launch vehicles, emphasizing architecture, approximate lift class, propulsion and reusable-stage design.",
    "Compare vehicle architecture and mission role rather than treating payload capacity as a universal constant; actual performance depends on orbit, recovery profile and mission energy.",
    [
      { label: "VEHICLES", value: "5+" },
      { label: "CLASSES", value: "MEDIUM → SUPER-HEAVY" },
      { label: "PROPULSION", value: "LOX / CH4 / RP-1 / LH2" },
      { label: "REUSABILITY", value: "MIXED" },
    ],
    ["Vehicle", "Class", "Stages", "Propulsion", "Recovery"],
    [
      ["Starship", "Super-heavy", "2", "LOX/CH4", "Designed reusable"],
      ["SLS", "Heavy", "2 core stages + boosters", "LH2/LOX + SRB", "Expendable"],
      ["Falcon Heavy", "Heavy", "2", "RP-1/LOX", "Partial/reusable architecture"],
      ["New Glenn", "Heavy", "2", "LOX/CH4", "Reusable first stage"],
      ["Electron", "Small", "2", "LOX/RP-1", "Recovery capable"],
    ],
    ["ALL", "HEAVY", "SUPER-HEAVY", "SMALL"],
  ),
  Spaceports: view(
    "spaceports", "VEHICLES & DATA", "Global Spaceport Gazetteer", "SITE CATALOG SYNCED", "spaceport",
    "A geographic and operational directory of major launch sites, including latitude, launch azimuth constraints, vehicle compatibility and orbital mission roles.",
    "Associate each launch with a pad, range, latitude and target inclination. Site geography directly affects attainable orbital planes and dogleg requirements.",
    [
      { label: "SITES", value: "GLOBAL" },
      { label: "PRIMARY FACTOR", value: "LATITUDE" },
      { label: "RANGE", value: "SAFETY CORRIDOR" },
      { label: "OUTPUT", value: "PAD + AZIMUTH" },
    ],
    ["Spaceport", "Region", "Approx. Lat.", "Role", "Status"],
    [
      ["Kennedy Space Center", "USA / Florida", "28.6° N", "LEO / deep-space", "ACTIVE"],
      ["Baikonur", "Kazakhstan", "45.9° N", "LEO / ISS", "ACTIVE"],
      ["Guiana Space Centre", "French Guiana", "5.2° N", "LEO / GEO", "ACTIVE"],
      ["Tanegashima", "Japan", "30.4° N", "LEO / GTO", "ACTIVE"],
      ["Mahia", "New Zealand", "39.3° S", "LEO", "ACTIVE"],
      ["Satish Dhawan", "India", "13.7° N", "LEO / GTO", "ACTIVE"],
    ],
    ["ALL", "ACTIVE", "DEVELOPING"],
  ),
  "Surface Gazetteer": view(
    "surface", "VEHICLES & DATA", "Extraterrestrial Surface Gazetteer", "GAZETTEER INDEXED", "surface",
    "A planetary landmark directory covering impact basins, volcanoes, landing sites, canyons, polar regions and other named features across Solar System bodies.",
    "Search by body, landmark class and coordinates. Surface locations are expressed in body-fixed latitude/longitude and can be linked to mission assets in the celestial scene.",
    [
      { label: "BODIES", value: "MULTI-BODY" },
      { label: "COORDINATE", value: "BODY-FIXED" },
      { label: "CLASSES", value: "CRATER / VOLCANO / SITE" },
      { label: "LINK", value: "3D SCENE" },
    ],
    ["Landmark", "Body", "Class", "Coordinates", "Mission Link"],
    [
      ["Olympus Mons", "Mars", "Volcano", "18.65° N, 226.2° E", "ORBITAL"],
      ["Gale Crater", "Mars", "Impact / rover site", "5.4° S, 137.8° E", "CURIOSITY"],
      ["Jezero Crater", "Mars", "Impact / delta", "18.4° N, 77.5° E", "PERSEVERANCE"],
      ["South Pole–Aitken", "Moon", "Impact basin", "53° S, 169° W", "LUNAR"],
    ],
    ["ALL", "Mars", "Moon", "Earth"],
  ),
  Academy: view(
    "academy", "VEHICLES & DATA", "Astrodynamics Academy", "TRAINING MODULE READY", "academy",
    "An interactive primer for orbital mechanics: Keplerian elements describe an orbit, Hohmann transfers approximate two-impulse coplanar transfers, Lagrange points describe rotating-frame equilibrium regions, and delta-v budgets quantify maneuver capability.",
    "Start with state vectors → derive orbital elements → propagate → design transfer → budget delta-v → validate against constraints. The educational feed keeps the same engineering vocabulary used by mission operations.",
    [
      { label: "MODULE 01", value: "KEPLERIAN ELEMENTS" },
      { label: "MODULE 02", value: "HOHMANN TRANSFER" },
      { label: "MODULE 03", value: "LAGRANGE POINTS" },
      { label: "MODULE 04", value: "Δv BUDGETS" },
    ],
    ["Lesson", "Core concept", "Equation / Input", "Output", "Level"],
    [
      ["Keplerian elements", "a, e, i, Ω, ω, ν", "State vector", "Orbit geometry", "FOUNDATION"],
      ["Hohmann transfer", "2 impulse", "r₁ → r₂", "Δv₁ + Δv₂", "FOUNDATION"],
      ["Lagrange points", "Rotating frame", "Mass ratio + geometry", "Equilibrium region", "INTERMEDIATE"],
      ["Delta-v budget", "Mission energy", "Burn sequence", "Total Δv", "INTERMEDIATE"],
    ],
    ["ALL", "FOUNDATION", "INTERMEDIATE"],
  ),
};

export const MENU_GROUPS: { title: string; items: string[] }[] = [
  {
    title: "CELESTIAL WORLDS",
    items: ["Sun", "Mercury", "Venus", "Earth", "Moon", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
  },
  { title: "LIVE TRACKERS", items: ["Starlink", "ISS", "Tiangong", "JWST / Hubble", "GNSS", "Active Payloads"] },
  {
    title: "SPACE INTEL & SSA",
    items: ["Space Debris Cloud", "Conjunction Warnings", "Re-entry Forecast", "Maneuvers", "Space Weather"],
  },
  {
    title: "OBSERVATION",
    items: ["Tonight's Visible Passes", "Lunar / Solar Transits", "Optical Sunlit Filter", "Radio Frequencies"],
  },
  { title: "VEHICLES & DATA", items: ["Launch Schedule", "Rockets", "Spaceports", "Surface Gazetteer", "Academy"] },
];

/* ============================================================
 * Active artificial hardware (operational spacecraft)
 * ============================================================ */

export type Operator = "NASA" | "ESA" | "CNSA" | "ISRO" | "KARI" | "UAESA" | "SpaceX" | "Roscosmos" | "Multinational";

export const OPERATOR_FLAG: Record<Operator, string> = {
  NASA: "🇺🇸",
  ESA: "🇪🇺",
  CNSA: "🇨🇳",
  ISRO: "🇮🇳",
  KARI: "🇰🇷",
  UAESA: "🇦🇪",
  SpaceX: "🇺🇸",
  Roscosmos: "🇷🇺",
  Multinational: "🌐",
};

export interface SpaceAsset {
  id: string;
  body: BodyId;
  name: string;
  operator: Operator;
  type: string;
  launchDate: string;
  /** Landing, orbit-insertion or commissioning date */
  arrivalDate: string;
  status: string;
  /** Mean altitude above the body's surface, in km. 0 for surface assets. */
  altitudeKm: number;
  lat: number;
  lon: number;
  objectives: string;
  discoveries: string;
  /** How many operational units this entry represents (shells aggregate many). */
  count: number;
  /** Rendering hints */
  surface?: boolean;
  /** Surface features carry a human-readable elevation / depth reading */
  elevation?: string;

  orbitFactor?: number;
  inclination?: number;
  phase?: number;
  orbitSpeed?: number;
  accent?: string;
}

export const ACTIVE_ASSETS: SpaceAsset[] = [
  /* ---------------- Earth: ~18,600 active satellites ---------------- */
  {
    id: "earth-leo-shell",
    body: "Earth",
    name: "LEO Shell (Starlink, OneWeb, EO, ISS)",
    operator: "Multinational",
    type: "LEO Shell",
    launchDate: "1957-10-04 (first LEO object)",
    arrivalDate: "Continuously replenished",
    status: "Operational — 17,900 active payloads",
    altitudeKm: 550,
    lat: 0,
    lon: 0,
    objectives:
      "Broadband constellations, Earth observation, crewed operations and remote sensing between 300 and 2,000 km altitude.",
    discoveries:
      "Starlink alone accounts for more than 8,800 working spacecraft — the densest orbital shell ever flown.",
    count: 17900,
    orbitFactor: 1.18,
    inclination: 53,
    phase: 0,
    orbitSpeed: 0.9,
    accent: "#93c5fd",
  },
  {
    id: "earth-meo-shell",
    body: "Earth",
    name: "MEO Shell (GPS, Galileo, GLONASS, BeiDou)",
    operator: "Multinational",
    type: "MEO Shell",
    launchDate: "1978-02-22 (GPS Block I)",
    arrivalDate: "Rolling replenishment",
    status: "Operational — ~150 active payloads",
    altitudeKm: 20200,
    lat: 0,
    lon: 0,
    objectives: "Global navigation, timing and search-and-rescue relay from 8,000–25,000 km orbits.",
    discoveries: "GNSS timing confirmed relativistic clock dilation to within nanoseconds per day.",
    count: 150,
    orbitFactor: 1.55,
    inclination: 55,
    phase: 120,
    orbitSpeed: 0.45,
    accent: "#7dd3fc",
  },
  {
    id: "earth-geo-shell",
    body: "Earth",
    name: "GEO Shell (Comsats, Weather, Early Warning)",
    operator: "Multinational",
    type: "GEO Shell",
    launchDate: "1963-07-26 (Syncom 2)",
    arrivalDate: "Rolling replenishment",
    status: "Operational — ~570 active payloads",
    altitudeKm: 35786,
    lat: 0,
    lon: 0,
    objectives: "Fixed-point communications, meteorology and missile early warning from the 35,786 km belt.",
    discoveries: "GOES imagery gave the first continuous full-disc view of Earth's weather systems.",
    count: 570,
    orbitFactor: 2.0,
    inclination: 0,
    phase: 40,
    orbitSpeed: 0.18,
    accent: "#facc15",
  },
  {
    id: "iss",
    body: "Earth",
    name: "International Space Station",
    operator: "Multinational",
    type: "Crewed LEO Station",
    launchDate: "1998-11-20 (Zarya)",
    arrivalDate: "2000-11-02 (permanent crew)",
    status: "Active — crewed",
    altitudeKm: 408,
    lat: 28.53,
    lon: -80.64,
    objectives: "Microgravity research laboratory and long-duration human spaceflight testbed.",
    discoveries: "Cold Atom Lab produced Bose–Einstein condensates in freefall, impossible on Earth.",
    count: 1,
    orbitFactor: 1.12,
    inclination: 51.6,
    phase: 200,
    orbitSpeed: 1.1,
    accent: "#22d3ee",
  },
  {
    id: "hubble",
    body: "Earth",
    name: "Hubble Space Telescope",
    operator: "NASA",
    type: "LEO Observatory",
    launchDate: "1990-04-24",
    arrivalDate: "1990-05-20 (first light)",
    status: "Active — reduced gyro mode",
    altitudeKm: 515,
    lat: 12.1,
    lon: 34.7,
    objectives: "Ultraviolet, visible and near-infrared imaging and spectroscopy of the deep universe.",
    discoveries: "Pinned the Hubble constant and revealed the accelerating expansion of the universe.",
    count: 1,
    orbitFactor: 1.3,
    inclination: 28.5,
    phase: 300,
    orbitSpeed: 0.95,
    accent: "#a5b4fc",
  },

  /* ---------------- Moon: 4 active orbiters ---------------- */
  {
    id: "lro",
    body: "Moon",
    name: "Lunar Reconnaissance Orbiter (LRO)",
    operator: "NASA",
    type: "Polar Orbiter",
    launchDate: "2009-06-18",
    arrivalDate: "2009-06-23 (lunar orbit insertion)",
    status: "Active — extended science mission",
    altitudeKm: 50,
    lat: -12.4,
    lon: 41.2,
    objectives: "High-resolution mapping of the lunar surface for Artemis landing-site certification.",
    discoveries: "Measured the coldest known temperatures in the Solar System inside polar shadowed craters.",
    count: 1,
    orbitFactor: 1.16,
    inclination: 89,
    phase: 20,
    orbitSpeed: 0.8,
    accent: "#22d3ee",
  },
  {
    id: "capstone",
    body: "Moon",
    name: "CAPSTONE",
    operator: "NASA",
    type: "NRHO Pathfinder CubeSat",
    launchDate: "2022-06-28",
    arrivalDate: "2022-11-13 (NRHO insertion)",
    status: "Active — navigation demonstration",
    altitudeKm: 1600,
    lat: 62.0,
    lon: 118.0,
    objectives: "Validate the near-rectilinear halo orbit planned for the Gateway station.",
    discoveries: "First spacecraft to fly and characterise a lunar NRHO trajectory.",
    count: 1,
    orbitFactor: 1.62,
    inclination: 72,
    phase: 150,
    orbitSpeed: 0.35,
    accent: "#facc15",
  },
  {
    id: "chandrayaan-3-prop",
    body: "Moon",
    name: "Chandrayaan-3 Propulsion Module",
    operator: "ISRO",
    type: "Lunar Orbiter",
    launchDate: "2023-07-14",
    arrivalDate: "2023-08-05 (lunar orbit)",
    status: "Active — SHAPE payload / Earth-return ops",
    altitudeKm: 150,
    lat: 8.4,
    lon: -63.5,
    objectives: "Delivered the Vikram lander, now observing Earth as an exoplanet analogue with SHAPE.",
    discoveries: "Supported the first successful soft landing near the lunar south pole.",
    count: 1,
    orbitFactor: 1.34,
    inclination: 40,
    phase: 240,
    orbitSpeed: 0.6,
    accent: "#fb923c",
  },
  {
    id: "danuri",
    body: "Moon",
    name: "Danuri (KPLO)",
    operator: "KARI",
    type: "Polar Orbiter",
    launchDate: "2022-08-04",
    arrivalDate: "2022-12-16 (lunar orbit insertion)",
    status: "Active — extended mission",
    altitudeKm: 100,
    lat: -35.0,
    lon: 15.5,
    objectives: "Polar resource prospecting, magnetic field survey and lunar internet demonstration.",
    discoveries: "ShadowCam returned the sharpest images yet of permanently shadowed crater floors.",
    count: 1,
    orbitFactor: 1.24,
    inclination: 85,
    phase: 95,
    orbitSpeed: 0.7,
    accent: "#c084fc",
  },

  /* ---------------- Sun: 2 heliophysics orbiters (+ SOHO at L1) ---------------- */
  {
    id: "parker",
    body: "Sun",
    name: "Parker Solar Probe",
    operator: "NASA",
    type: "Heliophysics Orbiter",
    launchDate: "2018-08-12",
    arrivalDate: "2018-11-05 (first perihelion)",
    status: "Active — closest-ever solar orbit",
    altitudeKm: 6900000,
    lat: 3.4,
    lon: 271.0,
    objectives: "Fly through the solar corona to explain coronal heating and solar wind acceleration.",
    discoveries: "Found magnetic 'switchbacks' and crossed the Alfvén surface into the corona in 2021.",
    count: 1,
    orbitFactor: 1.3,
    inclination: 3,
    phase: 10,
    orbitSpeed: 1.2,
    accent: "#fb923c",
  },
  {
    id: "solar-orbiter",
    body: "Sun",
    name: "Solar Orbiter",
    operator: "ESA",
    type: "Heliophysics Orbiter",
    launchDate: "2020-02-10",
    arrivalDate: "2021-02-10 (science phase)",
    status: "Active — inclined solar orbit",
    altitudeKm: 42000000,
    lat: 17.0,
    lon: 96.0,
    objectives: "Image the Sun's poles and link in-situ plasma measurements to their surface sources.",
    discoveries: "Revealed ubiquitous 'campfire' nanoflares across the quiet corona.",
    count: 1,
    orbitFactor: 1.75,
    inclination: 24,
    phase: 160,
    orbitSpeed: 0.55,
    accent: "#facc15",
  },
  {
    id: "soho",
    body: "Sun",
    name: "SOHO (Sun–Earth L1)",
    operator: "ESA",
    type: "L1 Halo Observatory",
    launchDate: "1995-12-02",
    arrivalDate: "1996-02-14 (L1 halo orbit)",
    status: "Active — 30 years of continuous watch",
    altitudeKm: 148500000,
    lat: 0.2,
    lon: 0.0,
    objectives: "Continuous solar disc, corona and solar-wind monitoring for space-weather forecasting.",
    discoveries: "Discovered more than 5,000 sungrazing comets — the most prolific comet finder ever.",
    count: 1,
    orbitFactor: 2.35,
    inclination: 7,
    phase: 280,
    orbitSpeed: 0.25,
    accent: "#38bdf8",
  },

  /* ---------------- Mars: 7 active orbiters ---------------- */
  {
    id: "odyssey",
    body: "Mars",
    name: "2001 Mars Odyssey",
    operator: "NASA",
    type: "Polar Orbiter",
    launchDate: "2001-04-07",
    arrivalDate: "2001-10-24 (orbit insertion)",
    status: "Active — longest-serving Mars spacecraft",
    altitudeKm: 400,
    lat: 42.0,
    lon: 118.0,
    objectives: "Thermal mapping, radiation monitoring and relay for surface assets.",
    discoveries: "Detected vast subsurface hydrogen deposits, implying buried water ice.",
    count: 1,
    orbitFactor: 1.2,
    inclination: 93,
    phase: 15,
    orbitSpeed: 0.75,
    accent: "#22d3ee",
  },
  {
    id: "mars-express",
    body: "Mars",
    name: "Mars Express",
    operator: "ESA",
    type: "Elliptical Orbiter",
    launchDate: "2003-06-02",
    arrivalDate: "2003-12-25 (orbit insertion)",
    status: "Active — extended to 2026+",
    altitudeKm: 298,
    lat: -18.0,
    lon: 250.0,
    objectives: "Stereo surface imaging, subsurface radar sounding and atmospheric chemistry.",
    discoveries: "MARSIS radar found evidence of briny liquid water beneath the south polar cap.",
    count: 1,
    orbitFactor: 1.32,
    inclination: 86,
    phase: 70,
    orbitSpeed: 0.62,
    accent: "#60a5fa",
  },
  {
    id: "mro",
    body: "Mars",
    name: "Mars Reconnaissance Orbiter",
    operator: "NASA",
    type: "Polar Orbiter",
    launchDate: "2005-08-12",
    arrivalDate: "2006-03-10 (orbit insertion)",
    status: "Active — primary relay asset",
    altitudeKm: 255,
    lat: 18.44,
    lon: 77.45,
    objectives: "30 cm/pixel HiRISE imaging, mineral mapping and high-rate relay for rovers.",
    discoveries: "Imaged recurring slope lineae and confirmed widespread hydrated minerals.",
    count: 1,
    orbitFactor: 1.16,
    inclination: 92,
    phase: 130,
    orbitSpeed: 0.82,
    accent: "#f97316",
  },
  {
    id: "maven",
    body: "Mars",
    name: "MAVEN",
    operator: "NASA",
    type: "Aeronomy Orbiter",
    launchDate: "2013-11-18",
    arrivalDate: "2014-09-21 (orbit insertion)",
    status: "Active — atmosphere and relay",
    altitudeKm: 6200,
    lat: 25.0,
    lon: 5.0,
    objectives: "Measure how the solar wind strips the Martian upper atmosphere into space.",
    discoveries: "Quantified atmospheric escape rates that explain the loss of ancient Martian air.",
    count: 1,
    orbitFactor: 1.5,
    inclination: 74,
    phase: 210,
    orbitSpeed: 0.4,
    accent: "#a78bfa",
  },
  {
    id: "tgo",
    body: "Mars",
    name: "ExoMars Trace Gas Orbiter",
    operator: "ESA",
    type: "Circular Science Orbiter",
    launchDate: "2016-03-14",
    arrivalDate: "2016-10-19 (orbit insertion)",
    status: "Active — relay and trace-gas survey",
    altitudeKm: 400,
    lat: -5.0,
    lon: 190.0,
    objectives: "Hunt methane and other trace gases that could indicate active geology or biology.",
    discoveries: "Set stringent upper limits on methane and found hydrogen chloride in the atmosphere.",
    count: 1,
    orbitFactor: 1.26,
    inclination: 74,
    phase: 285,
    orbitSpeed: 0.68,
    accent: "#34d399",
  },
  {
    id: "hope-emm",
    body: "Mars",
    name: "Hope (Emirates Mars Mission)",
    operator: "UAESA",
    type: "High Science Orbiter",
    launchDate: "2020-07-19",
    arrivalDate: "2021-02-09 (orbit insertion)",
    status: "Active — extended mission",
    altitudeKm: 22000,
    lat: 10.0,
    lon: 320.0,
    objectives: "Build the first full diurnal and seasonal picture of the Martian atmosphere.",
    discoveries: "Captured discrete aurora on the nightside and patchy proton aurora events.",
    count: 1,
    orbitFactor: 1.68,
    inclination: 25,
    phase: 45,
    orbitSpeed: 0.3,
    accent: "#facc15",
  },
  {
    id: "tianwen-1",
    body: "Mars",
    name: "Tianwen-1 Orbiter",
    operator: "CNSA",
    type: "Remote Sensing Orbiter",
    launchDate: "2020-07-23",
    arrivalDate: "2021-02-10 (orbit insertion)",
    status: "Active — global remote sensing",
    altitudeKm: 265,
    lat: -30.0,
    lon: 110.0,
    objectives: "Global mapping, subsurface radar sounding and relay for the Zhurong rover.",
    discoveries: "Completed a full-planet medium-resolution image map of Mars in 2022.",
    count: 1,
    orbitFactor: 1.4,
    inclination: 87,
    phase: 330,
    orbitSpeed: 0.5,
    accent: "#f87171",
  },

  /* ---------------- Jupiter: 1 active orbiter ---------------- */
  {
    id: "juno",
    body: "Jupiter",
    name: "Juno",
    operator: "NASA",
    type: "Polar Orbiter",
    launchDate: "2011-08-05",
    arrivalDate: "2016-07-05 (orbit insertion)",
    status: "Active — extended mission",
    altitudeKm: 4200,
    lat: -22.1,
    lon: -9.3,
    objectives: "Probe Jupiter's deep interior, magnetic field, aurora and water abundance.",
    discoveries: "Found polar cyclone polygons and a fuzzy, diluted planetary core.",
    count: 1,
    orbitFactor: 1.35,
    inclination: 90,
    phase: 60,
    orbitSpeed: 0.5,
    accent: "#d9a26b",
  },
];

/** Exact operational hardware counts used by the header telemetry badge. */
export const ACTIVE_COUNTS: Record<BodyId, number> = {
  Sun: 3,
  Mercury: 0,
  Venus: 0,
  Earth: 18600,
  Moon: 4,
  Mars: 7,
  Jupiter: 1,
  Saturn: 0,
  Uranus: 0,
  Neptune: 0,
};

export const COUNT_NOTE: Record<BodyId, string> = {
  Sun: "2 heliophysics orbiters + SOHO at L1",
  Mercury: "No active spacecraft",
  Venus: "No active orbiters (Akatsuki contact lost)",
  Earth: "~18,600 active satellites across LEO / MEO / GEO",
  Moon: "4 active orbiters",
  Mars: "7 active orbiters",
  Jupiter: "1 active orbiter (Juno)",
  Saturn: "No active spacecraft",
  Uranus: "No active spacecraft",
  Neptune: "No active spacecraft",
};

export function assetsFor(body: BodyId) {
  return ACTIVE_ASSETS.filter((a) => a.body === body);
}

/** Normalise a surface feature into the shared asset shape used by the intel drawer. */
export function pinAsAsset(pin: SurfacePin): SpaceAsset {
  return {
    id: pin.id,
    body: pin.body,
    name: pin.name,
    operator: (pin.operator as Operator) ?? "Multinational",
    type: pin.type ?? "Surface Feature",
    launchDate: pin.launchDate ?? "—",
    arrivalDate: pin.arrivalDate ?? "—",
    status: pin.status ?? "Mapped surface site",
    altitudeKm: 0,
    lat: pin.lat,
    lon: pin.lon,
    objectives: pin.objectives ?? pin.mission,
    discoveries: pin.fact,
    count: 1,
    surface: true,
    elevation: pin.elevation ?? "—",
  };
}


/* ============================================================
 * Real-time ISS sub-point tracking
 * ============================================================ */

export interface IssTelemetry {
  lat: number;
  lon: number;
  altitudeKm: number;
  velocityKms: number;
  /** "daylight" | "eclipsed" */
  eclipse: "DAYLIGHT" | "ECLIPSE";
  region: string;
  source: "live" | "propagated";
  timestamp: number;
}

const ISS_NOMINAL_ALT = 408;
const ISS_NOMINAL_VEL = 7.66;

interface GeoBox {
  name: string;
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
}

/** Coarse gazetteer of land/ocean regions, tested in order (first match wins). */
const GEO_BOXES: GeoBox[] = [
  { name: "Arctic Ocean", latMin: 72, latMax: 90, lonMin: -180, lonMax: 180 },
  { name: "Antarctica", latMin: -90, latMax: -62, lonMin: -180, lonMax: 180 },
  { name: "Southern Ocean", latMin: -62, latMax: -48, lonMin: -180, lonMax: 180 },
  { name: "Greenland", latMin: 60, latMax: 84, lonMin: -73, lonMax: -12 },
  { name: "Siberia, Russia", latMin: 50, latMax: 73, lonMin: 60, lonMax: 180 },
  { name: "Scandinavia & Northern Europe", latMin: 54, latMax: 72, lonMin: 4, lonMax: 41 },
  { name: "Western Europe", latMin: 36, latMax: 60, lonMin: -10, lonMax: 20 },
  { name: "Eastern Europe", latMin: 40, latMax: 60, lonMin: 20, lonMax: 60 },
  { name: "Mediterranean Sea", latMin: 30, latMax: 46, lonMin: -6, lonMax: 36 },
  { name: "Sahara Desert, North Africa", latMin: 16, latMax: 32, lonMin: -17, lonMax: 34 },
  { name: "Sahel & West Africa", latMin: 4, latMax: 16, lonMin: -18, lonMax: 24 },
  { name: "Central & East Africa", latMin: -12, latMax: 16, lonMin: 24, lonMax: 52 },
  { name: "Southern Africa", latMin: -35, latMax: -12, lonMin: 11, lonMax: 41 },
  { name: "Arabian Peninsula", latMin: 12, latMax: 32, lonMin: 34, lonMax: 60 },
  { name: "Central Asia", latMin: 35, latMax: 55, lonMin: 46, lonMax: 90 },
  { name: "Indian Subcontinent", latMin: 6, latMax: 35, lonMin: 68, lonMax: 90 },
  { name: "China & East Asia", latMin: 20, latMax: 50, lonMin: 90, lonMax: 145 },
  { name: "Southeast Asia", latMin: -11, latMax: 22, lonMin: 92, lonMax: 141 },
  { name: "Australia", latMin: -44, latMax: -10, lonMin: 112, lonMax: 154 },
  { name: "New Zealand", latMin: -48, latMax: -33, lonMin: 165, lonMax: 179 },
  { name: "Alaska & Canadian Arctic", latMin: 55, latMax: 72, lonMin: -170, lonMax: -60 },
  { name: "Canada", latMin: 43, latMax: 60, lonMin: -141, lonMax: -53 },
  { name: "United States", latMin: 25, latMax: 49, lonMin: -125, lonMax: -67 },
  { name: "Mexico & Central America", latMin: 7, latMax: 32, lonMin: -118, lonMax: -77 },
  { name: "Amazon Basin, South America", latMin: -15, latMax: 6, lonMin: -75, lonMax: -45 },
  { name: "Andes & Western South America", latMin: -40, latMax: 6, lonMin: -81, lonMax: -63 },
  { name: "Southern South America", latMin: -56, latMax: -15, lonMin: -74, lonMax: -34 },
  { name: "North Atlantic Ocean", latMin: 6, latMax: 66, lonMin: -80, lonMax: -8 },
  { name: "South Atlantic Ocean", latMin: -55, latMax: 6, lonMin: -60, lonMax: 20 },
  { name: "Indian Ocean", latMin: -48, latMax: 25, lonMin: 20, lonMax: 115 },
  { name: "North Pacific Ocean", latMin: 0, latMax: 62, lonMin: 120, lonMax: 180 },
  { name: "North Pacific Ocean", latMin: 0, latMax: 62, lonMin: -180, lonMax: -100 },
  { name: "South Pacific Ocean", latMin: -55, latMax: 0, lonMin: 130, lonMax: 180 },
  { name: "South Pacific Ocean", latMin: -55, latMax: 0, lonMin: -180, lonMax: -70 },
];

/** Human-readable region currently beneath a sub-satellite point. */
export function regionForLatLon(lat: number, lon: number): string {
  const l = ((((lon + 180) % 360) + 360) % 360) - 180;
  for (const b of GEO_BOXES) {
    if (lat >= b.latMin && lat <= b.latMax && l >= b.lonMin && l <= b.lonMax) return b.name;
  }
  return "Open Ocean";
}

/** Rough solar sub-point, good enough for day/night eclipse status. */
function solarSubPoint(date: Date): { lat: number; lon: number } {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = (date.getTime() - start) / 86400000;
  const decl = -23.44 * Math.cos(((2 * Math.PI) / 365.24) * (dayOfYear + 10));
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const lon = 180 - utcHours * 15;
  return { lat: decl, lon: ((((lon + 180) % 360) + 360) % 360) - 180 };
}

function toRad(d: number) {
  return (d * Math.PI) / 180;
}

/** True when the given sub-point is sunlit (accounting for the ISS horizon boost). */
export function isSunlit(lat: number, lon: number, date = new Date()): boolean {
  const s = solarSubPoint(date);
  const cosAngle =
    Math.sin(toRad(lat)) * Math.sin(toRad(s.lat)) +
    Math.cos(toRad(lat)) * Math.cos(toRad(s.lat)) * Math.cos(toRad(lon - s.lon));
  // ~19.8° horizon extension at 408 km altitude.
  return cosAngle > Math.cos(toRad(90 + 19.8));
}

/** Deterministic fallback propagation (51.6° inclination, 92.68 min period). */
export function propagateIss(date = new Date()): { lat: number; lon: number } {
  const t = date.getTime() / 1000;
  const period = 92.68 * 60;
  const nu = ((2 * Math.PI) / period) * t;
  const inc = toRad(51.6);
  const lat = (Math.asin(Math.sin(inc) * Math.sin(nu)) * 180) / Math.PI;
  const raw =
    (Math.atan2(Math.cos(inc) * Math.sin(nu), Math.cos(nu)) * 180) / Math.PI - (t / 86164) * 360;
  return { lat, lon: ((((raw + 180) % 360) + 360) % 360) - 180 };
}

export function issTelemetryAt(date = new Date()): IssTelemetry {
  const { lat, lon } = propagateIss(date);
  return {
    lat,
    lon,
    altitudeKm: ISS_NOMINAL_ALT,
    velocityKms: ISS_NOMINAL_VEL,
    eclipse: isSunlit(lat, lon, date) ? "DAYLIGHT" : "ECLIPSE",
    region: regionForLatLon(lat, lon),
    source: "propagated",
    timestamp: date.getTime(),
  };
}

/**
 * Poll live ISS state once per second. Uses the public wheretheiss.at feed
 * (HTTPS + CORS) and falls back to local propagation when offline.
 * Returns an unsubscribe function.
 */
export function subscribeIss(onUpdate: (t: IssTelemetry) => void, intervalMs = 1000): () => void {
  let stopped = false;
  let lastFetch = 0;

  const tick = async () => {
    if (stopped) return;
    const now = Date.now();
    let next = issTelemetryAt(new Date(now));
    if (now - lastFetch > 5000) {
      lastFetch = now;
      try {
        const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544", {
          headers: { accept: "application/json" },
        });
        if (res.ok) {
          const d = (await res.json()) as {
            latitude: number;
            longitude: number;
            altitude: number;
            velocity: number;
            visibility: string;
          };
          next = {
            lat: d.latitude,
            lon: d.longitude,
            altitudeKm: d.altitude,
            velocityKms: d.velocity / 3600,
            eclipse: d.visibility === "eclipsed" ? "ECLIPSE" : "DAYLIGHT",
            region: regionForLatLon(d.latitude, d.longitude),
            source: "live",
            timestamp: now,
          };
          liveAnchor = { lat: d.latitude, lon: d.longitude, at: now };
        }
      } catch {
        /* offline — keep propagated values */
      }
    } else if (liveAnchor && now - liveAnchor.at < 8000) {
      // Interpolate between live fixes using the propagator's rate of change.
      const drift = propagateIss(new Date(now));
      const anchorDrift = propagateIss(new Date(liveAnchor.at));
      const lat = liveAnchor.lat + (drift.lat - anchorDrift.lat);
      const lon = ((((liveAnchor.lon + (drift.lon - anchorDrift.lon) + 180) % 360) + 360) % 360) - 180;
      next = {
        ...next,
        lat,
        lon,
        region: regionForLatLon(lat, lon),
        eclipse: isSunlit(lat, lon, new Date(now)) ? "DAYLIGHT" : "ECLIPSE",
        source: "live",
      };
    }
    if (!stopped) onUpdate(next);
  };

  let liveAnchor: { lat: number; lon: number; at: number } | null = null;
  void tick();
  const id = setInterval(() => void tick(), intervalMs);
  return () => {
    stopped = true;
    clearInterval(id);
  };
}
