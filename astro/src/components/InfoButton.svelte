<script>
  import { contact } from "@stores/contact.svelte";
  import { project } from "@stores/project.svelte";

  const handleClick = () => {
    project.toggle();
    contact.close();
  };
</script>

<button class="inline text-dark-grey-invert" onclick={handleClick}
  >{project.isActive ? "Close" : "Info"}</button
>
