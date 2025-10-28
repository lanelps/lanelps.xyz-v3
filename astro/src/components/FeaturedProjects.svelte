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

<section class="sm-t:mt-0 h-full w-full">
  <header
    class="grid-main text-b2 text-grey-invert sm-t:translate-y-1/2 pointer-events-none absolute top-1/2 left-0 z-10 h-max w-full mix-blend-difference will-change-transform select-none"
  >
    <span class="sm-t:col-span-2 col-span-3 space-x-[0.25ch]">
      <span>{activeProject + 1}/{projects.length}</span>
      <h2 class="text-blue-invert inline">{projects[activeProject].title}</h2>
      {#if Array.isArray(projects[activeProject]?.categories) && projects[activeProject]?.categories?.length}
        <p class="inline">{projects[activeProject].categories?.join(", ")}</p>
      {/if}
    </span>

    {#if Array.isArray(projects[activeProject]?.collaborators) && projects[activeProject]?.collaborators?.length}
      <p class="sm-t:col-span-2">
        {projects[activeProject].collaborators?.join(", ")}
      </p>
    {/if}

    {#if projects[activeProject]?.date}
      <p class="sm-t:block hidden">
        {new Date(projects[activeProject].date as string).getFullYear()}
      </p>
    {/if}
  </header>

  <ul bind:this={projectList} class="h-dvh w-full overflow-hidden">
    {@render children()}
  </ul>

  <nav
    class="top-logo h-body grid-main fixed left-0 w-full mix-blend-difference"
  >
    <span
      style="--ty: {mouseY}px; --tx: {mouseX}px"
      class={[
        "link-invert sm-t:block sm-t:translate-x-[var(--tx)] sm-t:translate-y-[var(--ty)] sm-t:opacity-0 pointer-events-none fixed top-0 left-0 hidden h-max w-max transition-opacity group-hover:opacity-100",
        textActive && "opacity-100!",
      ]}>{buttonText}</span
    >

    {#if projects.length > 1}
      <button
        class="group sm-t:cursor-none relative col-span-1 col-start-1 block"
        onclick={handlePrev}
        onmouseenter={() => setButtonText("Prev")}
        onmouseleave={hideButtonText}
      >
        <span
          class="link-invert sm-t:hidden pointer-events-none absolute top-[3lh] left-0"
          >Prev</span
        >
      </button>
    {/if}

    <a
      href={`/development/${projects[activeProject].slug.current}`}
      class="group sm-t:cursor-none relative col-span-1 col-start-3 block"
      onmouseenter={() => setButtonText("View")}
      onmouseleave={hideButtonText}
    >
      <span
        class="link-invert sm-t:hidden pointer-events-none absolute top-[3lh] left-0"
        >View</span
      >
    </a>

    {#if projects.length > 1}
      <button
        class="group sm-t:col-start-5 sm-t:cursor-none relative col-span-1 block"
        onclick={handleNext}
        onmouseenter={() => setButtonText("Next")}
        onmouseleave={hideButtonText}
      >
        <span
          class="link-invert sm-t:hidden pointer-events-none absolute top-[3lh] right-0"
          >Next</span
        >
      </button>
    {/if}
  </nav>
</section>
