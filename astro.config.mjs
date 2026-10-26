import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://sibutradingplc.com",
  output: "static",
  devToolbar: { enabled: false },
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      // Rebuild the dev JSX runtime after a production build.
      force: true,
      include: ["gsap", "gsap/ScrollTrigger"],
    },
  },
});
