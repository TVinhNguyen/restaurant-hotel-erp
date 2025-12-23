import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "admin.thahvinhdevops.online",
      "*.thahvinhdevops.online",
    ],
    host: "0.0.0.0",
    port: 5173,
  },
});
