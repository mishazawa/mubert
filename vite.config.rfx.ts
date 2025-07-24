import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: "src",
  base: "/dev/mubert4/", // 👈 deployment base
  plugins: [react()],
  resolve: {
    alias: {
      "@lib": path.resolve(__dirname, "lib"),
    },
  },
  build: {
    outDir: "../dist-rfx",
    emptyOutDir: true,
  },
});