<script>
  import { contact } from "@stores/contact.svelte.ts";
  import { project } from "@stores/project.svelte.ts";

  const handleClick = () => {
    contact.toggle();
    project.close();
  };
</script>

<footer
  class="grid-main fixed bottom-0 left-0 z-50 w-full pb-4 mix-blend-difference"
>
  <a
    href="/development"
    class="link-invert col-span-2 col-start-1 sm-t:col-span-1 sm-t:col-start-2"
    >Development</a
  >
  <button onclick={handleClick} class="link-invert">Contact</button>
  <a href="/lab" class="link-invert">Lab</a>
</footer>
