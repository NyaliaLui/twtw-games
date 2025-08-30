'use client';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { RepeatWrapping } from 'three';

import { breakpointSM } from '@/app/utils';
import { animationConfig } from '@/app/constants';

export { World };

function World() {
  const grass = useTexture('/textures/grass.jpg');
  grass.wrapS = grass.wrapT = RepeatWrapping;
  grass.repeat.set(10, 10);

  const sky = useTexture('/textures/sky.jpg');
  const { scene, size } = useThree();
  scene.background = sky;

  // On screens larger than small breakpoint use small scale
  // otherwise use the default scale.
  scene.scale.setScalar(breakpointSM(size.width) ? animationConfig.scale.world.sm : animationConfig.scale.world.default);

  return (
    <mesh rotation-x={animationConfig.groundRotation} receiveShadow={true}>
      <planeGeometry args={[animationConfig.groundDim, animationConfig.groundDim]} />
      <meshStandardMaterial map={grass} />
    </mesh>
  );
}