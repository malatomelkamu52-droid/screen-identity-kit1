/**
 * Centralised domain types for the Orbital Intelligence platform.
 * Everything the intelligence layer consumes is typed here so components
 * never invent their own ad-hoc shapes.
 */

export type DataState = "LIVE" | "SIMULATED" | "OFFLINE";

export interface DataEnvelope<T> {
  data: T;
  /** Where the payload came from and how much it can be trusted. */
  state: DataState;
  source: string;
  updatedAt: string; // ISO timestamp
}

export type OrbitRegime = "LEO" | "MEO" | "GEO" | "HEO" | "LAGRANGE" | "INTERPLANETARY" | "SURFACE";

export interface OrbitalData {
  semiMajorAxisKm?: number;
  altitudeKm?: number;
  inclinationDeg?: number;
  eccentricity?: number;
  periodMin?: number;
  regime: OrbitRegime;
}

export interface Satellite {
  id: string;
  name: string;
  operator: string;
  purpose: string;
  status: "OPERATIONAL" | "COMMISSIONING" | "TRANSFER" | "DECAYED" | "RESERVE";
  orbit: OrbitalData;
}

export interface Mission {
  id: string;
  name: string;
  agency: string;
  target: string;
  phase: "ACTIVE" | "CRUISE" | "UPCOMING" | "EXTENDED" | "ARCHIVED";
  launchDate: string;
  summary: string;
}

export interface Asteroid {
  id: string;
  name: string;
  class: "NEO" | "MAIN BELT" | "TROJAN" | "PHA";
  diameterM: number;
  missDistanceKm?: number;
  closeApproach?: string;
}

export interface Comet {
  id: string;
  name: string;
  periodYears: number | null;
  perihelionAu: number;
  lastPerihelion: string;
}

export interface Star {
  id: string;
  name: string;
  constellation: string;
  spectralType: string;
  magnitude: number;
  distanceLy: number;
}

export interface SpaceWeather {
  kpIndex: number;
  solarWindKms: number;
  solarFlux: number;
  flareClass: string;
  auroraLatitude: number;
  alert: "QUIET" | "UNSETTLED" | "STORM";
}

export interface IntelligenceEvent {
  id: string;
  category: string;
  label: string;
  timestamp: string;
  severity: "INFO" | "WATCH" | "ALERT";
  detail: string;
}

export type SearchCategory =
  | "CELESTIAL OBJECTS"
  | "SATELLITES"
  | "MISSIONS"
  | "ASTEROIDS"
  | "STARS"
  | "INTELLIGENCE VIEWS";

export interface SearchResult {
  id: string;
  label: string;
  detail: string;
  category: SearchCategory;
  /** Either switch the 3D scene to a body, or open an intelligence view. */
  action: { kind: "body"; body: string } | { kind: "view"; viewKey: string };
}
