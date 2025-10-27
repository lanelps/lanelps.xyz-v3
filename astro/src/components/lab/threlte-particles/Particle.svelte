<script lang="ts">
  import { T } from "@threlte/core";
  import { RigidBody, Collider } from "@threlte/rapier";

  import type { Vector3 } from "three";

  interface Props {
    position: Vector3;
    size?: number;
    color?: string;
  }

  let { position, size = 0.5, color = "orange" }: Props = $props();
</script>

<T.Group position={position.toArray()} castShadow>
  <RigidBody type="dynamic">
    <Collider shape="ball" args={[size]} />

    <T.Mesh>
      <T.SphereGeometry args={[size]} />
      <T.MeshStandardMaterial {color} />
    </T.Mesh>
  </RigidBody>
</T.Group>
