import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 30001,
    proxy: {
      "/mwapi": {
        target: "http://10.180.5.186:30081",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/mwapi"),
      },
    },
  },
  plugins: [react()],
});
