'use client';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

import { breakpointSM } from '@/app/utils';

export { World, GroundDim };

const GroundDim = 100;

function World() {
  const grass = useTexture('/textures/grass.jpg');
  grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
  grass.repeat.set(10, 10);

  const sky = useTexture('/textures/sky.jpg');
  const { scene, size } = useThree();
  scene.background = sky;

  // On screens larger than small breakpoint use scale 1
  // otherwise use scale 1.5.
  scene.scale.setScalar(breakpointSM(size.width) ? 1 : 1.5);

  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow={true}>
      <planeGeometry args={[GroundDim, GroundDim]} />
      <meshStandardMaterial map={grass} />
    </mesh>
  );
}