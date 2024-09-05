<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();

  let canDrag = $state(false);
  let translateX = $state(0);
  let translateY = $state(0);

  const onDrag = (event: DragEvent) => {
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
  class="group relative flex w-max h-max cursor-grab flex-col items-end active:cursor-grabbing"
  class:z-30={canDrag}
  onmousedown={handleDragStart}
  onmouseup={handleDragEnd}
  onmouseleave={handleDragEnd}
  onmousemove={onDrag}
  role="presentation"
>
  {@render children()}
</div>
