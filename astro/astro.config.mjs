import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import sanity from "@sanity/astro";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

import { loadEnv } from "vite";

const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN } = loadEnv(
  process.env.NODE_ENV || "development",
  process.cwd(),
  ""
);

// Check if required environment variables are present
if (!SANITY_PROJECT_ID || !SANITY_DATASET) {
  console.warn(
    "Warning: Sanity project ID or dataset not defined in environment variables"
  );
}

// https://astro.build/config
export default defineConfig({
  site: "https://lanelps.xyz",

  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    svelte(),
    sanity({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      token: SANITY_TOKEN,
      apiVersion: "2026-04-01",
      useCdn: false,
    }),
    sitemap(),
  ],

  redirects: {
    "/about": "/",
    // "/work/[...slug]": "/development/[...slug]",
    "/contact": "/",
  },
  adapter: cloudflare(),
});
