<script lang="ts">
  import { Euler, Quaternion, Vector3 } from "three";
  import { T, useTask } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import { Collider, Debug, RigidBody } from "@threlte/rapier";
  import type { RigidBody as RigidBodyType } from "@dimforge/rapier3d-compat";

  import Particle from "./Particle.svelte";

  let rotation = $state(0);
  let cubeBody: RigidBodyType | undefined = $state();
  const rotationEuler = new Euler();
  const rotationQuat = new Quaternion();

  useTask((delta) => {
    rotation += delta;
    rotationEuler.set(0, rotation * 0.5, rotation / 1.5);
    rotationQuat.setFromEuler(rotationEuler);

    // The cubeBody is now the API object, so we can call methods on it directly.
    if (cubeBody) {
      cubeBody.setNextKinematicRotation(rotationQuat);
    }
  });
</script>

<T.PerspectiveCamera makeDefault fov={45} position={[30, 1, 30]}>
  <OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.DirectionalLight position={[1, 3, 1]} castShadow />

<!-- Rotation Collision Cube -->
<T.Group position={[0, 2, 0]}>
  <RigidBody type="kinematicPosition" bind:rigidBody={cubeBody}>
    <T.Group position={[5, 0, 0]}>
      <Collider shape="cuboid" args={[0.1, 5, 5]} />
    </T.Group>

    <T.Group position={[-5, 0, 0]}>
      <Collider shape="cuboid" args={[0.1, 5, 5]} />
    </T.Group>

    <T.Group position={[0, 5, 0]}>
      <Collider shape="cuboid" args={[5, 0.1, 5]} />
    </T.Group>

    <T.Group position={[0, -5, 0]}>
      <Collider shape="cuboid" args={[5, 0.1, 5]} />
    </T.Group>

    <T.Group position={[0, 0, 5]}>
      <Collider shape="cuboid" args={[5, 5, 0.1]} />
    </T.Group>

    <T.Group position={[0, 0, -5]}>
      <Collider shape="cuboid" args={[5, 5, 0.1]} />
    </T.Group>
  </RigidBody>
</T.Group>

<!-- Ground -->
<T.Group position={[0, 0, 0]}>
  <T.Mesh
    position.y={-5}
    rotation.x={-Math.PI / 2}
    rotation.z={Math.PI / 4}
    receiveShadow
  >
    <T.PlaneGeometry args={[100, 100]} />
    <T.MeshStandardMaterial color="white" />
  </T.Mesh>

  <T.Mesh
    position.x={-17.5}
    position.z={-17.5}
    position.y={20}
    rotation.y={Math.PI / 4}
    receiveShadow
  >
    <T.PlaneGeometry args={[100, 50]} />
    <T.MeshStandardMaterial color="white" />
  </T.Mesh>
</T.Group>

<!-- Particles -->
<Particle position={new Vector3(0, 2, 0)} />

<Debug depthTest={false} depthWrite={false} />
