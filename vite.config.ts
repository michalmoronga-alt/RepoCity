import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFile } from "node:fs/promises";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "optional-local-pilot-map",
      apply: "serve",
      configureServer(server) {
        // This optional, ignored file belongs to RepoCity, never the observed repo.
        server.middlewares.use("/local-pilot-map", async (req, res) => {
          if (req.method !== "GET") {
            res.statusCode = 405;
            res.end();
            return;
          }
          res.setHeader("Cache-Control", "no-store");
          try {
            const raw = await readFile(
              new URL("./.local/pilot-map.json", import.meta.url),
              "utf8",
            );
            res.setHeader("Content-Type", "application/json");
            res.end(raw);
          } catch {
            res.statusCode = 404;
            res.end();
          }
        });
      },
    },
  ],
  server: { host: "127.0.0.1", cors: false, port: 5173, strictPort: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) =>
          /node_modules[\/\\](three|@react-three|three-stdlib)[\/\\]/.test(id)
            ? "graphics"
            : undefined,
      },
    },
  },
});
