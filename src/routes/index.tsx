import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/components/space/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orbital Intelligence — Live Satellite & Planetary Tracker" },
      {
        name: "description",
        content:
          "Track satellites and explore photorealistic 3D planets, moons and the Sun with live telemetry, surface gazetteer pins and mission-time controls.",
      },
      { property: "og:title", content: "Orbital Intelligence — Live Satellite & Planetary Tracker" },
      {
        property: "og:description",
        content:
          "A deep-space HUD for orbital radar: 3D planetary engine, telemetry panels, map layers and a mission time controller.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Dashboard />;
}
