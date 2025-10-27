<script lang="ts">
  import { twMerge, type ClassNameValue } from "tailwind-merge";
  import Hls from "hls.js";
  import { createBlurUp } from "@mux/blurup";

  import type { MuxVideo } from "../types";

  interface Props {
    class?: ClassNameValue;
    imgClass?: ClassNameValue;
    controls?: boolean;
    cover?: boolean;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    video: MuxVideo;
  }

  // --- PROPS ---
  let {
    controls = false,
    class: className,
    imgClass,
    cover = false,
    autoplay = true,
    loop = true,
    muted = true,
    video,
  }: Props = $props();

  // --- STATE ---

  let videoElement: HTMLVideoElement;
  let placeholder: Awaited<ReturnType<typeof createBlurUp>> | undefined =
    $state();

  // --- DERIVED STATE ---

  const playbackId = $derived(video?.asset?.playbackId);
  const videoSrc = $derived(
    playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : ""
  );

  // --- EFFECTS ---

  // Effect to fetch the placeholder image when the playbackId changes.
  $effect(() => {
    if (playbackId) {
      createBlurUp(playbackId).then((p) => {
        placeholder = p;
      });
    }
  });

  // Effect to setup the HLS video player.
  // This runs when videoElement is mounted and re-runs if videoSrc changes.

  $effect(() => {
    if (!videoElement || !videoSrc) return;

    let hls: Hls | undefined;

    // Check for native HLS support (like in Safari)
    if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = videoSrc;
    } else if (Hls.isSupported()) {
      // Use hls.js for other browsers
      hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(videoElement);
    } else {
      console.error("This browser does not support HLS.");
    }

    // The cleanup function runs before the effect re-runs or when the component unmounts.
    // This is crucial for destroying the Hls.js instance to prevent memory leaks.
    return () => {
      hls?.destroy();
    };
  });
</script>

<figure class={twMerge("relative h-full w-full select-none", className)}>
  <video
    bind:this={videoElement}
    class={twMerge([
      "relative h-auto w-full transition-opacity duration-700 select-none",
      cover ? "h-full object-cover" : "",
      imgClass,
    ])}
    draggable="false"
    {controls}
    {muted}
    {autoplay}
    {loop}
    playsinline={autoplay}
    poster={placeholder?.imageDataURL}
  ></video>
</figure>
