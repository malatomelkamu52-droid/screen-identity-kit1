import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    preview: {
      host: "0.0.0.0",
      allowedHosts: [
        "screen-identity-kit1.onrender.com",
        ".onrender.com",
      ],
    },
  },
  nitro: {
    preset: "node-server",
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
