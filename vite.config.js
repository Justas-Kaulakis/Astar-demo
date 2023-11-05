import { defineConfig } from "vite";

export default defineConfig({
  base: "https://justas-kaulakis.github.io/Astar-demo/",
  build: {
    target: "esnext", //browsers can handle the latest ES features
  },
});
