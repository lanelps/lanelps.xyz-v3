<script lang="ts">
  import { T } from "@threlte/core";
  import { RigidBody, Collider } from "@threlte/rapier";

  import type { Vector3 } from "three";

  interface Props {
    position: Vector3;
  }

  let { position }: Props = $props();
</script>

<T.Group position={position.toArray()} castShadow>
  <RigidBody type="dynamic">
    <Collider shape="ball" args={[0.5]} />

    <T.Mesh>
      <T.SphereGeometry args={[0.5]} />
      <T.MeshStandardMaterial color="orange" />
    </T.Mesh>
  </RigidBody>
</T.Group>
