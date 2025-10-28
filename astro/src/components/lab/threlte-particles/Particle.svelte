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

<T.Group position={position.toArray()}>
  <RigidBody type="dynamic">
    <Collider shape="ball" args={[size]} />

    <T.Mesh castShadow>
      <T.SphereGeometry args={[size, 16, 16]} />
      <T.MeshPhysicalMaterial
        {color}
        transparent
        transmission={1}
        roughness={0}
        metalness={0}
        ior={1.5}
        thickness={2}
      />
    </T.Mesh>
  </RigidBody>
</T.Group>
