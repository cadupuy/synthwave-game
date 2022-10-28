import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: "8000",
    https: false,
    open: true,
  },
  root: "sources",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [glsl()],
});
