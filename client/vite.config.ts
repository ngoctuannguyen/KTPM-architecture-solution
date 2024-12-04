import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/short": "http://localhost:3000",
      "/create": "http://localhost:3000",
    },
  },
});
