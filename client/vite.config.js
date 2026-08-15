import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on("error", (err, req, res) => {
            // Handle ECONNREFUSED gracefully without dumping stack traces in Vite dev output
            if (err.code === "ECONNREFUSED" && !res.headersSent) {
              res.writeHead(503, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({ error: "Backend server (node server.js) is not running on port 5000." }),
              );
            }
          });
        },
      },
    },
  },
});
