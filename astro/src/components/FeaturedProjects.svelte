<script lang="ts">
  import type { Project } from "../types";

  let { projects }: { projects: Array<Project> } = $props();

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

<section class="mt-[--logo-mobile] h-full w-full sm-t:mt-0">
  <ul bind:this={projectList} class="h-full w-full overflow-hidden">
    {#each projects as project, projectIndex}
      <li class="text-b2 relative h-full w-full">
        <header
          style="--ty: {mouseY}px;"
          class="grid-main pointer-events-none absolute left-0 top-0 z-10 h-max w-full select-none text-deep-purple-invert mix-blend-difference will-change-transform sm-t:translate-y-[var(--ty)]"
        >
          <span class="col-span-3 space-x-[0.25ch] sm-t:col-span-2">
            <span>{projectIndex + 1}/{projects.length}</span>
            <h2 class="inline text-blue-invert">{project.title}</h2>
            <p class="inline">{project.category.join(", ")}</p>
          </span>

          <p class="sm-t:col-span-2">{project.description}</p>
          <p class="hidden sm-t:block">{project.year}</p>
        </header>

        <div class="grid-main h-full w-full">
          <div
            class="col-span-full bg-[#89A39D] sm-t:col-span-3 sm-t:col-start-2"
          ></div>
        </div>
      </li>
    {/each}
  </ul>

  <div class="top-logo h-body grid-main fixed left-0 w-full">
    <button
      class="group relative col-span-1 col-start-1 block hover:cursor-none sm-t:[position:unset]"
      onclick={handlePrev}
    >
      <span
        style="--tx: {mouseX}px; --ty:{mouseY}px;"
        class="link pointer-events-none absolute left-0 top-[3lh] transition-opacity group-hover:opacity-100 sm-t:fixed sm-t:top-0 sm-t:translate-x-[var(--tx)] sm-t:translate-y-[var(--ty)] sm-t:opacity-0"
        >Prev</span
      >
    </button>
    <button class="group col-span-1 col-start-3 block hover:cursor-none">
      <span
        style="--tx: {mouseX}px; --ty:{mouseY}px;"
        class="link pointer-events-none fixed left-0 top-0 hidden opacity-0 transition-opacity group-hover:opacity-100 sm-t:block sm-t:translate-x-[var(--tx)] sm-t:translate-y-[var(--ty)]"
        >View</span
      >
    </button>
    <button
      class="group relative col-span-1 block hover:cursor-none sm-t:col-start-5 sm-t:[position:unset]"
      onclick={handleNext}
    >
      <span
        style="--tx: {mouseX}px; --ty:{mouseY}px;"
        class="link pointer-events-none absolute right-0 top-[3lh] transition-opacity group-hover:opacity-100 sm-t:fixed sm-t:left-0 sm-t:right-[unset] sm-t:top-0 sm-t:translate-x-[var(--tx)] sm-t:translate-y-[var(--ty)] sm-t:opacity-0"
        >Next</span
      >
    </button>
  </div>
</section>
