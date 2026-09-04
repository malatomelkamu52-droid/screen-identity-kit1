/**
 * Intelligence data access layer.
 *
 * Every read returns a DataEnvelope so the UI can always show provenance:
 * nothing is presented as LIVE unless the app actually computed it live.
 */
import { VIEW_REGISTRY } from "@/lib/space-intel";
import type { IntelligenceViewDefinition } from "@/lib/space-data";
import type { DataEnvelope, DataState } from "@/lib/space-types";

/** Views whose numbers are computed in-app rather than snapshotted. */
const LIVE_VIEW_IDS = new Set(["iss"]);

function envelope<T>(data: T, state: DataState, source: string): DataEnvelope<T> {
  return { data, state, source, updatedAt: new Date().toISOString() };
}

export function isKnownView(key: string): boolean {
  return Boolean(VIEW_REGISTRY[key]);
}

export async function loadIntelligenceView(
  key: string,
  signal?: AbortSignal,
): Promise<DataEnvelope<IntelligenceViewDefinition>> {
  // Simulated ingest latency so loading states are real rather than decorative.
  await new Promise((resolve) => setTimeout(resolve, 260));
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  const definition = VIEW_REGISTRY[key];
  if (!definition) throw new Error(`No intelligence view registered for "${key}"`);

  const state: DataState = LIVE_VIEW_IDS.has(definition.id) ? "LIVE" : "SIMULATED";
  return envelope(definition, state, state === "LIVE" ? "In-app SGP4 propagation" : "Reference catalog");
}
