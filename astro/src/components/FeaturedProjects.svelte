<script lang="ts">
import { onMount } from "svelte";

  let { projects } = $props();

  let activeProject = $state(0);
  let projectList;

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

  $effect(() => {
    if (projectList) {
      projectList.scrollTo({
        top: activeProject * window.innerHeight,
      });
    }
  });

  onMount(() => {
    const projectHeaders = projectList.querySelectorAll("header");

    window.addEventListener("mousemove", (e) => {
      projectHeaders.forEach((header) => {
        header.style.transform = `translateY(${e.clientY}px)`;
      });
    });
  })
</script>

<section class="w-full h-full">
  <ul bind:this={projectList} class="w-full h-full overflow-hidden">
    {#each projects as project, projectIndex}
        <li class="w-full h-full text-b2">
          <header class="w-full grid-main h-max pointer-events-none select-none will-change-transform">
            <span class="flex gap-[0.25ch] col-span-2">
              <span>{projectIndex + 1}/{projects.length}</span>
              <h2 class="text-blue">{project.title}</h2>
              <p>{project.category.join(", ")}</p>
            </span>

            <p class="col-span-2">{project.description}</p>
            <p>{project.year}</p>
          </header>
        </li>
    {/each}
  </ul>

  <div
    class="fixed top-[var(--logo-desktop)] left-0 w-full h-[calc(100%-var(--logo-desktop)-var(--footer-height))] grid-main"
  >
    <button class="col-start-1 col-span-1" onclick={handlePrev}></button>
    <button class="col-start-5 col-span-1" onclick={handleNext}></button>
  </div>
</section>
