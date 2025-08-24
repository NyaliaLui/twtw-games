'use client';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export { GroundAndSky, GroundDim };

const GroundDim = 100;

function GroundAndSky() {
  const grass = useTexture('/textures/grass.jpg');
  grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
  grass.repeat.set(10, 10);

  const sky = useTexture('/textures/sky.jpg');
  const { scene } = useThree();
  scene.background = sky;

  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow={true}>
      <planeGeometry args={[GroundDim, GroundDim]} />
      <meshStandardMaterial map={grass} />
    </mesh>
  );
}