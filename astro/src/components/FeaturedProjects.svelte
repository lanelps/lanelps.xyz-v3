<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Project } from "../types";

  let { projects, children }: { projects: Project[]; children: Snippet } =
    $props();

  let activeProject = $state(0);
  let mouseY = $state(0);
  let mouseX = $state(0);

  let textActive = $state(false);
  let buttonText = $state("");

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

  const setButtonText = (text: string) => {
    textActive = true;

    if (text === buttonText) return;
    buttonText = text;
  };

  const hideButtonText = () => {
    textActive = false;
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

<section class="h-full w-full sm-t:mt-0">
  <header
    class="grid-main text-b2 pointer-events-none absolute left-0 top-1/2 z-10 h-max w-full select-none text-grey-invert mix-blend-difference will-change-transform sm-t:translate-y-1/2"
  >
    <span class="col-span-3 space-x-[0.25ch] sm-t:col-span-2">
      <span>{activeProject + 1}/{projects.length}</span>
      <h2 class="inline text-blue-invert">{projects[activeProject].title}</h2>
      {#if projects[activeProject]?.categories && projects[activeProject]?.categories?.length > 0}
        <p class="inline">{projects[activeProject].categories?.join(", ")}</p>
      {/if}
    </span>

    {#if projects[activeProject]?.collaborators && projects[activeProject]?.collaborators?.length > 0}
      <p class="sm-t:col-span-2">
        {projects[activeProject].collaborators.join(", ")}
      </p>
    {/if}

    {#if projects[activeProject]?.date}
      <p class="hidden sm-t:block">
        {new Date(projects[activeProject].date).getFullYear()}
      </p>
    {/if}
  </header>

  <ul bind:this={projectList} class="h-[100dvh] w-full overflow-hidden">
    {@render children()}
  </ul>

  <nav
    class="top-logo h-body grid-main fixed left-0 w-full mix-blend-difference"
  >
    <span
      style="--ty: {mouseY}px; --tx: {mouseX}px"
      class="link-invert pointer-events-none fixed left-0 top-0 hidden h-max w-max transition-opacity group-hover:opacity-100 sm-t:block sm-t:translate-x-[var(--tx)] sm-t:translate-y-[var(--ty)] sm-t:opacity-0"
      class:!opacity-100={textActive}>{buttonText}</span
    >

    {#if projects.length > 1}
      <button
        class="group relative col-span-1 col-start-1 block sm-t:cursor-none"
        onclick={handlePrev}
        onmouseenter={() => setButtonText("Prev")}
        onmouseleave={hideButtonText}
      >
        <span
          class="link-invert pointer-events-none absolute left-0 top-[3lh] sm-t:hidden"
          >Prev</span
        >
      </button>
    {/if}

    <a
      href={`/development/${projects[activeProject].slug.current}`}
      class="group relative col-span-1 col-start-3 block sm-t:cursor-none"
      onmouseenter={() => setButtonText("View")}
      onmouseleave={hideButtonText}
    >
      <span
        class="link-invert pointer-events-none absolute left-0 top-[3lh] sm-t:hidden"
        >View</span
      >
    </a>

    {#if projects.length > 1}
      <button
        class="group relative col-span-1 block sm-t:col-start-5 sm-t:cursor-none"
        onclick={handleNext}
        onmouseenter={() => setButtonText("Next")}
        onmouseleave={hideButtonText}
      >
        <span
          class="link-invert pointer-events-none absolute right-0 top-[3lh] sm-t:hidden"
          >Next</span
        >
      </button>
    {/if}
  </nav>
</section>
