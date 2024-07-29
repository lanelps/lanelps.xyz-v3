<script lang="ts">
  import type { ProjectType } from "../types";

  let { projects }: { projects: Array<ProjectType> } = $props();

  let activeProject = $state(0);
  let mouseY = $state(0);
  let mouseX = $state(0);

  let projectList: HTMLUListElement;

  const handlePrev = () => {
    if (activeProject === 0) {
      activeProject = projects.length - 1;
    } else {
      activeProject--;
    }
  };

  const handleNext = () => {
    if (activeProject === projects.length - 1) {
      activeProject = 0;
    } else {
      activeProject++;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    mouseY = e.clientY;
    mouseX = e.clientX;
  };

  $effect(() => {
    if (projectList) {
      projectList.scrollTo({
        top: activeProject * window.innerHeight,
      });
    }
  });
</script>

<svelte:window on:mousemove={handleMouseMove} />

<section class="w-full h-full mt-[--logo-mobile] sm-t:mt-0">
  <ul bind:this={projectList} class="w-full h-full overflow-hidden">
    {#each projects as project, projectIndex}
      <li class="relative w-full h-full text-b2">
        <header
          style="--ty: {mouseY}px;"
          class="absolute top-0 left-0 w-full grid-main h-max pointer-events-none select-none will-change-transform sm-t:translate-y-[var(--ty)] z-10 mix-blend-difference text-deep-purple-invert"
        >
          <span class="space-x-[0.25ch] col-span-3 sm-t:col-span-2">
            <span>{projectIndex + 1}/{projects.length}</span>
            <h2 class="text-blue-invert inline">{project.title}</h2>
            <p class="inline">{project.category.join(", ")}</p>
          </span>

          <p class="sm-t:col-span-2">{project.description}</p>
          <p class="hidden sm-t:block">{project.year}</p>
        </header>

        <div class="w-full h-full grid-main">
          <div class="bg-[#89A39D] col-start-2 col-span-3"></div>
        </div>
      </li>
    {/each}
  </ul>

  <div
    class="fixed top-[var(--logo-mobile)] sm-t:top-[var(--logo-desktop)] left-0 w-full h-[calc(100%-var(--logo-mobile)-var(--footer-height))] sm-t:h-[calc(100%-var(--logo-desktop)-var(--footer-height))] grid-main"
  >
    <button
      class="relative sm-t:[position:unset] col-start-1 col-span-1 group hover:cursor-none block"
      onclick={handlePrev}
    >
      <span
        style="--tx: {mouseX}px; --ty:{mouseY}px;"
        class="link absolute sm-t:fixed top-[3lh] sm-t:top-0 left-0 sm-t:opacity-0 sm-t:translate-x-[var(--tx)] sm-t:translate-y-[var(--ty)] transition-opacity group-hover:opacity-100 pointer-events-none"
        >Prev</span
      >
    </button>
    <button class="col-start-3 col-span-1 group hover:cursor-none block">
      <span
        style="--tx: {mouseX}px; --ty:{mouseY}px;"
        class="link hidden sm-t:block fixed top-0 left-0 opacity-0 sm-t:translate-x-[var(--tx)] sm-t:translate-y-[var(--ty)] transition-opacity group-hover:opacity-100 pointer-events-none"
        >View</span
      >
    </button>
    <button
      class="relative sm-t:[position:unset] sm-t:col-start-5 col-span-1 group hover:cursor-none block"
      onclick={handleNext}
    >
      <span
        style="--tx: {mouseX}px; --ty:{mouseY}px;"
        class="link absolute sm-t:fixed top-[3lh] sm-t:top-0 right-0 sm-t:right-[unset] sm-t:left-0 sm-t:opacity-0 sm-t:translate-x-[var(--tx)] sm-t:translate-y-[var(--ty)] transition-opacity group-hover:opacity-100 pointer-events-none"
        >Next</span
      >
    </button>
  </div>
</section>
