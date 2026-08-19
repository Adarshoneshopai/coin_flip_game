import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression2";

// Vite gives fast dev/build; gzip compression + a vendor chunk keeps the
// production bundle lean, which matters for both Core Web Vitals (SEO)
// and ad viewability (AdSense favors fast, stable pages).
export default defineConfig({
  plugins: [react(), compression()],
  build: {
    target: "es2018",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
