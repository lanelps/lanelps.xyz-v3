<script>
  import { project } from "@stores/project.svelte";

  const handleKeyDown = (event) => {
    if (!project.isActive) return;

    if (event.key === "Escape") {
      project.close();
    }
  };
</script>

<svelte:window on:keydown={handleKeyDown} />

<section
  class="absolute top-0 w-full h-full col-start-1 col-span-2 pointer-events-none z-40 mix-blend-difference -translate-x-full transition-transform ease-in-out"
  class:!translate-x-0={project.isActive}
></section>

<div
  class="absolute top-0 w-full h-full col-start-1 col-span-2 pointer-events-none z-30 bg-white/30 backdrop-blur-[32px] -translate-x-full transition-transform"
  class:!translate-x-0={project.isActive}
></div>
