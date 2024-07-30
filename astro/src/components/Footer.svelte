<script>
  import { contact } from "@stores/contact.svelte.ts";
  import { project } from "@stores/project.svelte.ts";

  const handleClick = () => {
    contact.toggle();
    project.close();
  };
</script>

<footer
  class="fixed bottom-0 left-0 w-full grid-main pb-4 z-50 mix-blend-difference"
>
  <a
    href="/development"
    class="col-start-1 col-span-2 sm-t:col-start-2 sm-t:col-span-1 link-invert"
    >Development</a
  >
  <button onclick={handleClick} class="link-invert">Contact</button>
  <a href="/lab" class="link-invert">Lab</a>
</footer>
