<script lang="ts">
  import {
    Euler,
    Quaternion,
    Vector3,
    EquirectangularReflectionMapping,
  } from "three";
  import { T, useTask, useThrelte, useLoader } from "@threlte/core";
  import { OrbitControls, Environment } from "@threlte/extras";
  import { HDRLoader } from "three/examples/jsm/Addons.js";
  import { Collider, Debug, RigidBody } from "@threlte/rapier";
  import type { RigidBody as RigidBodyType } from "@dimforge/rapier3d-compat";

  import Particle from "./Particle.svelte";

  const PARTICLE_SIZE = 0.5;
  const COLLISION_CUBE_SIZE = 5;
  const CUBE_WIDTH = COLLISION_CUBE_SIZE * 2;
  const PARTICLE_DIAMETER = PARTICLE_SIZE * 2.5;
  const PARTICLES_PER_AXIS = Math.floor(CUBE_WIDTH / PARTICLE_DIAMETER);

  const particlePositions: Vector3[] = [];
  const spacing = CUBE_WIDTH / PARTICLES_PER_AXIS;
  const offset = (CUBE_WIDTH - spacing) / 2;

  for (let x = 0; x < PARTICLES_PER_AXIS; x++) {
    for (let y = 0; y < PARTICLES_PER_AXIS; y++) {
      for (let z = 0; z < PARTICLES_PER_AXIS; z++) {
        particlePositions.push(
          new Vector3(
            x * spacing - offset,
            y * spacing - offset + 2, // Add vertical offset to match cube position
            z * spacing - offset
          )
        );
      }
    }
  }

  const rotationEuler = new Euler();
  const rotationQuat = new Quaternion();

  let rotation = $state(0);
  let cubeBody: RigidBodyType | undefined = $state();

  useTask((delta) => {
    rotation += delta;
    rotationEuler.set(0, rotation * 0.5, rotation / 1.5);
    rotationQuat.setFromEuler(rotationEuler);

    // The cubeBody is now the API object, so we can call methods on it directly.
    if (cubeBody) {
      cubeBody.setNextKinematicRotation(rotationQuat);
    }
  });

  const { load } = useLoader(HDRLoader);
  const map = load("/studio_small_09_2k.hdr", {
    transform(texture) {
      texture.mapping = EquirectangularReflectionMapping;
      return texture;
    },
  });
</script>

<T.PerspectiveCamera makeDefault fov={45} position={[30, 1, 30]}>
  <OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.DirectionalLight
  position={[0, 5, 0]}
  intensity={3}
  castShadow
  shadow.mapSize.width={2048}
  shadow.mapSize.height={2048}
  shadow.camera.top={10}
  shadow.camera.bottom={-10}
  shadow.camera.left={-10}
  shadow.camera.right={10}
  shadow.radius={4}
  shadow.bias={-0.0001}
/>

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
  <!-- Floor -->
  <T.Mesh
    position.y={-5}
    rotation.x={-Math.PI / 2}
    rotation.z={Math.PI / 4}
    receiveShadow
  >
    <T.PlaneGeometry args={[100, 100]} />
    <T.MeshStandardMaterial color="lightgrey" />
  </T.Mesh>

  <!-- Wall -->
  <!-- <T.Mesh
    position.x={-17.5}
    position.z={-17.5}
    position.y={20}
    rotation.y={Math.PI / 4}
    receiveShadow
  >
    <T.PlaneGeometry args={[100, 50]} />
    <T.MeshStandardMaterial color="lightgrey" />
  </T.Mesh> -->
</T.Group>

<!-- Particles -->
{#each particlePositions as position, i}
  {@const indexIsOverHalf = i > particlePositions.length / 2}
  <Particle
    {position}
    size={PARTICLE_SIZE}
    color={indexIsOverHalf ? "#2174b8" : "#e0d7c1"}
  />
{/each}

<!-- <Debug depthTest={false} depthWrite={false} /> -->

{#await map then texture}
  <Environment {texture} />
{/await}
