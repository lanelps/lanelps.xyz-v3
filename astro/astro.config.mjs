import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import sanity from "@sanity/astro";
import { loadEnv } from "vite";

const env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV, process.cwd(), ["SANITY_"]),
};

// https://astro.build/config
export default defineConfig({
  integrations: [
    svelte(),
    tailwind(),
    sanity({
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET,
      token: env.SANITY_TOKEN,
      useCdn: false,
    }),
  ],
  prefetch: true,
});
