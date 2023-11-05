import { defineConfig } from "vite";

export default defineConfig({
  base: "https://github.com/Justas-Kaulakis/Astar-demo",
  build: {
    target: "esnext", //browsers can handle the latest ES features
  },
});
