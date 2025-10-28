<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    class: className = "",
    children,
  }: { class: string; children: Snippet } = $props();

  let canDrag = $state(false);
  let translateX = $state(0);
  let translateY = $state(0);

  const onDrag = (event: MouseEvent) => {
    if (!canDrag) return;

    const { movementX, movementY } = event;

    translateX += movementX;
    translateY += movementY;
  };

  const handleDragStart = () => {
    canDrag = true;
  };

  const handleDragEnd = () => {
    canDrag = false;
  };
</script>

<div
  style={`transform: translate(${translateX}px, ${translateY}px)`}
  class={[
    "group relative flex h-max w-max cursor-grab flex-col items-end active:cursor-grabbing",
    canDrag && "z-30",
    className,
  ]}
  onmousedown={handleDragStart}
  onmouseup={handleDragEnd}
  onmouseleave={handleDragEnd}
  onmousemove={onDrag}
  role="presentation"
>
  {@render children()}
</div>
