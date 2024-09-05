<script lang="ts">
  import { page } from "@stores/page.svelte";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<main
  class="min-h-body col-span-full h-full w-full transition-opacity"
  class:opacity-0={!page.hasLoaded}
  class:pointer-events-none={!page.hasLoaded}
>
  {@render children()}
</main>
