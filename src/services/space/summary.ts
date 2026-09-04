/**
 * Dashboard summary service — feeds the intelligence cards and status bar.
 */
import { ACTIVE_ASSETS, ACTIVE_COUNTS } from "@/lib/space-data";
import { VIEW_REGISTRY } from "@/lib/space-intel";
import type { DataEnvelope, DataState } from "@/lib/space-types";

export interface DashboardCard {
  id: string;
  label: string;
  value: string;
  detail: string;
  state: DataState;
  /** Registry key of the intelligence view this card opens. */
  viewKey: string;
}

export interface DashboardSummary {
  objectsTracked: number;
  activeMissions: number;
  weatherPosture: string;
  neoWatch: number;
  systemHealth: "NOMINAL" | "DEGRADED";
  cards: DashboardCard[];
}

export async function loadDashboardSummary(): Promise<DataEnvelope<DashboardSummary>> {
  await new Promise((resolve) => setTimeout(resolve, 220));

  const objectsTracked = Object.values(ACTIVE_COUNTS).reduce((sum, n) => sum + n, 0);
  const activeMissions = VIEW_REGISTRY["Active Missions"]?.rows.length ?? 0;
  const neoWatch = VIEW_REGISTRY["Near-Earth Objects"]?.rows.length ?? 0;
  const registrySize = Object.keys(VIEW_REGISTRY).length;

  const cards: DashboardCard[] = [
    {
      id: "objects",
      label: "OBJECTS TRACKED",
      value: objectsTracked.toLocaleString(),
      detail: `${ACTIVE_ASSETS.length} catalogued asset groups`,
      state: "SIMULATED",
      viewKey: "Satellites",
    },
    {
      id: "missions",
      label: "ACTIVE MISSIONS",
      value: String(activeMissions),
      detail: "Reference mission board",
      state: "SIMULATED",
      viewKey: "Active Missions",
    },
    {
      id: "weather",
      label: "SPACE WEATHER",
      value: "MODEL",
      detail: "No live provider connected",
      state: "SIMULATED",
      viewKey: "Solar Activity",
    },
    {
      id: "neo",
      label: "NEO EVENTS",
      value: String(neoWatch),
      detail: "Watch-list entries",
      state: "SIMULATED",
      viewKey: "Near-Earth Objects",
    },
    {
      id: "system",
      label: "SYSTEM STATUS",
      value: "NOMINAL",
      detail: `${registrySize} intelligence views online`,
      state: "LIVE",
      viewKey: "Data Explorer",
    },
  ];

  return {
    data: {
      objectsTracked,
      activeMissions,
      weatherPosture: "MODEL",
      neoWatch,
      systemHealth: "NOMINAL",
      cards,
    },
    state: "SIMULATED",
    source: "Local intelligence registry",
    updatedAt: new Date().toISOString(),
  };
}
