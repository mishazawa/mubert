import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: "src",
  plugins: [react()],
  resolve: {
    alias: {
      "@lib": path.resolve(__dirname, "lib"),
    },
  },
  build: {
    outDir: "../dist-app", // output for dev app build
  },
});
