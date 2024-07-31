<script>
  import { project } from "@stores/project.svelte";

  let { description, categories, collaborators, software } = $props();

  const handleKeyDown = (event) => {
    if (!project.isActive) return;

    if (event.key === "Escape") {
      project.close();
    }
  };
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="grid-main pointer-events-none absolute top-0 h-full w-full">
  <section
    class="text-b1 pointer-events-auto z-40 col-span-2 col-start-1 grid h-full w-full -translate-x-full grid-cols-subgrid grid-rows-[repeat(4,_fit-content(100%))] place-content-center gap-y-4 mix-blend-difference transition-transform ease-in-out"
    class:!translate-x-0={project.isActive}
  >
    {#if categories.length > 0}
      <h3 class="text-grey-invert">At a Glance</h3>
      <p class="text-deep-purple-invert">{categories.join(", ")}</p>
    {/if}

    {#if collaborators.length > 0}
      <h3 class="text-grey-invert">Collaborators</h3>
      <p class="text-deep-purple-invert">{collaborators.join(", ")}</p>
    {/if}

    {#if software.length > 0}
      <h3 class="text-grey-invert">Software</h3>
      <p class="text-deep-purple-invert">{software.join(", ")}</p>
    {/if}
    <h3 class="text-grey-invert">Description</h3>
    <p class="text-deep-purple-invert">{description}</p>
  </section>

  <div
    class="absolute top-0 z-30 col-span-2 col-start-1 h-full w-full -translate-x-full bg-white/30 backdrop-blur-[32px] transition-transform"
    class:!translate-x-0={project.isActive}
  ></div>
</div>
