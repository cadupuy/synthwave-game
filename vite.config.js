import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";
import path from "path";

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

  resolve: {
    alias: {
      "@experience": path.resolve(__dirname, "./sources/Experience"),
      "@shaders": path.resolve(__dirname, "./sources/Experience/Shaders"),
      "@utils": path.resolve(__dirname, "./sources/Experience/Utils"),
      "@world": path.resolve(__dirname, "./sources/Experience/World"),
    },
  },
  plugins: [glsl()],
});
