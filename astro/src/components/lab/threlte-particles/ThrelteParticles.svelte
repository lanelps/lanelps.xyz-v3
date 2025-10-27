<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { HTML } from "@threlte/extras";
  import { World } from "@threlte/rapier";

  import ParticleScene from "./ParticlesScene.svelte";
</script>

<Canvas>
  <World>
    <ParticleScene />

    {#snippet fallback()}
      <HTML transform>
        <p>
          It seems your browser<br />
          doesn't support WASM.<br />
          I'm sorry.
        </p>
      </HTML>
    {/snippet}
  </World>
</Canvas>
