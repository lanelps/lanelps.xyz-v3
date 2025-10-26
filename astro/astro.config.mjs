import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import sanity from "@sanity/astro";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";
import partytown from "@astrojs/partytown";
const env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV, process.cwd(), ["SANITY_"]),
};

// https://astro.build/config
export default defineConfig({
  site: "https://lanelps.xyz",

  integrations: [
    svelte(),
    sanity({
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET,
      token: env.SANITY_TOKEN,
      useCdn: false,
    }),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],

  prefetch: true,

  redirects: {
    "/about": "/",
    // "/work/[...slug]": "/development/[...slug]",
    "/contact": "/",
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
