<script>
  import { contact } from "@stores/contact.svelte";

  const handleKeyDown = (event) => {
    if (!contact.isActive) return;

    if (event.key === "Escape") {
      contact.close();
    }
  };
</script>

<svelte:window on:keydown={handleKeyDown} />

<section
  class="absolute w-full h-full sm-t:col-start-3 col-span-full pointer-events-none z-40 mix-blend-difference translate-x-full transition-transform ease-in-out"
  class:!translate-x-0={contact.isActive}
>
  <ul
    class="relative w-full h-full text-h1 flex flex-col justify-center"
    class:pointer-events-auto={contact.isActive}
  >
    <li>
      <h3 class="inline text-grey-invert">Email</h3>
      <a
        class="text-dark-grey-invert text-stroke-0.2 text-stroke-blue-invert"
        href="mailto:lanelps@gmail.com"
        target="_blank"
        rel="noopener noreferrer">lanelps@gmail.com</a
      >
    </li>
    <li>
      <h3 class="inline text-grey-invert">Github</h3>
      <a
        class="text-dark-grey-invert text-stroke-0.2 text-stroke-blue-invert"
        href="https://github.com/lanelps"
        target="_blank"
        rel="noopener noreferrer">@lanelps</a
      >
    </li>
    <li>
      <h3 class="inline text-grey-invert">Instagram</h3>
      <a
        class="text-dark-grey-invert text-stroke-0.2 text-stroke-blue-invert"
        href="https://www.instagram.com/lane_lps/"
        target="_blank"
        rel="noopener noreferrer">@lane_lps</a
      >
    </li>
    <li>
      <h3 class="inline text-grey-invert">LinkedIn</h3>
      <a
        class="text-dark-grey-invert text-stroke-0.2 text-stroke-blue-invert"
        href="https://www.linkedin.com/in/lane-lps/"
        target="_blank"
        rel="noopener noreferrer">lane-lps</a
      >
    </li>
  </ul>
</section>

<div
  class="absolute w-full h-full sm-t:col-start-3 col-span-full pointer-events-none z-30 bg-white/30 backdrop-blur-[32px] translate-x-full transition-transform"
  class:!translate-x-0={contact.isActive}
></div>
