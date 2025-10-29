<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import {
    initWebGL,
    animateCavnas,
    cleanup,
    handleResize,
    updateVirtualScroll,
    setGallery,
  } from "@utils/webgl";

  import type { GalleryItem } from "../../types";

  interface Props {
    gallery: GalleryItem[];
    autoScroll?: boolean;
  }

  const { gallery, autoScroll }: Props = $props();
  let canvasRef: HTMLCanvasElement;

  // Variables for touch controls
  let touchStartY: number = $state(0);
  let lastVelocity: number = $state(0);
  let momentumFrame: number | null = $state(null);

  // Variables for mouse drag
  let isDragging = $state(false);
  let dragStartY: number = $state(0);

  const onWheel = (e: WheelEvent) => {
    if (momentumFrame) {
      cancelAnimationFrame(momentumFrame);
      momentumFrame = null;
    }
    updateVirtualScroll(e.deltaY);
  };

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      // Cancel any ongoing momentum.
      if (momentumFrame) {
        cancelAnimationFrame(momentumFrame);
        momentumFrame = null;
      }
      touchStartY = e.touches[0].clientY;
      // Optionally reset lastVelocity if desired:
      lastVelocity = 0;
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touchCurrentY = e.touches[0].clientY;
      const deltaY = touchStartY - touchCurrentY;
      // Record delta as "velocity" for momentum.
      lastVelocity = deltaY;
      touchStartY = touchCurrentY;
      updateVirtualScroll(deltaY);
    }
  };

  const applyMomentum = () => {
    // Apply friction factor to gradually decay the velocity.
    const friction = 0.975;
    lastVelocity *= friction;
    if (Math.abs(lastVelocity) < 0.01) {
      // Stop the momentum when velocity is low.
      return;
    }
    updateVirtualScroll(lastVelocity);
    momentumFrame = requestAnimationFrame(applyMomentum);
  };

  const onTouchEnd = () => {
    applyMomentum();
  };

  // --- Mouse Drag Handlers for Desktop ---
  const onMouseDown = (e: MouseEvent) => {
    // Cancel any ongoing momentum.
    if (momentumFrame) {
      cancelAnimationFrame(momentumFrame);
      momentumFrame = null;
    }
    isDragging = true;
    dragStartY = e.clientY;
    lastVelocity = 0;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaY = dragStartY - e.clientY;
    dragStartY = e.clientY;
    lastVelocity = deltaY;
    updateVirtualScroll(deltaY);
  };

  const onMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    isDragging = false;
    applyMomentum();
  };

  const beginAutoScroll = () => {
    const scrollSpeed = 1; // Adjust speed as needed
    updateVirtualScroll(scrollSpeed);
    requestAnimationFrame(beginAutoScroll);
  };

  onMount(async () => {
    if (!canvasRef || !gallery.length) return;

    updateVirtualScroll(0);
    setGallery(gallery);

    try {
      // Wait for initWebGL and ensure a full animation cycle completes
      await initWebGL(canvasRef, gallery);
      animateCavnas(canvasRef);

      if (autoScroll) {
        beginAutoScroll();
      }
    } catch (error) {
      console.error("Error setting up WebGL:", error);
      cleanup();
    }
  });

  onDestroy(() => {
    if (momentumFrame) cancelAnimationFrame(momentumFrame);
    cleanup();
  });
</script>

<svelte:window
  on:resize={handleResize}
  on:wheel={onWheel}
  on:touchstart={onTouchStart}
  on:touchmove={onTouchMove}
  on:touchend={onTouchEnd}
  on:mousedown={onMouseDown}
  on:mousemove={onMouseMove}
  on:mouseup={onMouseUp}
/>

<canvas
  bind:this={canvasRef}
  class="pointer-events-none fixed inset-0 h-full w-full"
></canvas>
