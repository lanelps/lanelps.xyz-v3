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
  class="pointer-events-none absolute z-40 col-span-full h-full w-full translate-x-full mix-blend-difference transition-transform ease-in-out sm-t:col-start-3"
  class:!translate-x-0={contact.isActive}
>
  <ul
    class="text-h1 relative flex h-full w-full flex-col justify-center"
    class:pointer-events-auto={contact.isActive}
  >
    <li>
      <h3 class="inline text-grey-invert">Email</h3>
      <a
        class="text-dark-grey-invert text-stroke-0.2 text-stroke-blue-invert"
        href="mailto:hello@lanelps.xyz"
        target="_blank"
        rel="noopener noreferrer">hello@lanelps.xyz</a
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
  class="pointer-events-none absolute z-30 col-span-full h-full w-full translate-x-full bg-white/30 backdrop-blur-[32px] transition-transform sm-t:col-start-3"
  class:!translate-x-0={contact.isActive}
></div>
