import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "/grillio-website/",

  build: {
    rolldownOptions: {
      input: {
        index: resolve(process.cwd(), "index.html"),
        menu: resolve(process.cwd(), "menu.html"),
        about: resolve(process.cwd(), "about.html"),
        checkout: resolve(process.cwd(), "checkout.html"),
        tracking: resolve(process.cwd(), "tracking.html"),
      },
    },
  },
});