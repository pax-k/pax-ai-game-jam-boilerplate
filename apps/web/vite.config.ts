import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const railwayPublicDomain = process.env.RAILWAY_PUBLIC_DOMAIN;

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  preview: {
    port: 4173,
    allowedHosts: railwayPublicDomain ? [railwayPublicDomain] : []
  }
});
