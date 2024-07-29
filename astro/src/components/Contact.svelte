<script>
  import { contact } from "@stores/contact.svelte";

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      contact.toggle();
    }
  };
</script>

<svelte:window on:keydown={handleKeyDown} />

<section
  class="absolute w-full h-full col-start-3 col-span-full pointer-events-none z-40 mix-blend-difference translate-x-full transition-transform ease-in-out"
  class:!translate-x-0={contact.isActive}
>
  <ul
    class="relative w-full h-full text-h1 flex flex-col justify-center"
    class:pointer-events-auto={contact.isActive}
  >
    <li>
      <h3 class="inline text-grey">Email</h3>
      <a
        class="text-blue-invert"
        href="mailto:lanelps@gmail.com"
        target="_blank"
        rel="noopener noreferrer">lanelps@gmail.com</a
      >
    </li>
    <li>
      <h3 class="inline text-grey">Github</h3>
      <a
        href="https://github.com/lanelps"
        target="_blank"
        rel="noopener noreferrer">@lanelps</a
      >
    </li>
    <li>
      <h3 class="inline text-grey">Instagram</h3>
      <a
        href="https://www.instagram.com/lane_lps/"
        target="_blank"
        rel="noopener noreferrer">@lane_lps</a
      >
    </li>
    <li>
      <h3 class="inline text-grey">LinkedIn</h3>
      <a
        href="https://www.linkedin.com/in/lane-lps/"
        target="_blank"
        rel="noopener noreferrer">lane-lps</a
      >
    </li>
  </ul>
</section>
<div
  class="absolute w-full h-full col-start-3 col-span-full pointer-events-none z-30 bg-white/20 backdrop-blur-sm translate-x-full transition-transform"
  class:!translate-x-0={contact.isActive}
></div>
