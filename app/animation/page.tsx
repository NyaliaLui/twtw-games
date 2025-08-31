// app/animation/page.tsx
'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { useGameControls } from '@/app/hooks/useGameControls';
import { Controls } from '@/app/components/Controls';
import { Soldier } from '@/app/components/animation/Soldier';
import { World } from '@/app/components/animation/World';
import { animationConfig } from '../constants';

export default function Animation() {
  const { keys, handleKeyDown, handleKeyUp } = useGameControls();

  return (
    <div className="fixed inset-0 bg-black z-40">
      <Canvas
        shadows={animationConfig.enableShadows}
        camera={{
          position: animationConfig.camera.position,
          fov: animationConfig.camera.fov,
        }}
      >
        <ambientLight intensity={animationConfig.ambientLight.intensity} />
        <directionalLight
          castShadow
          position={animationConfig.directionalLight.position}
          intensity={animationConfig.directionalLight.intensity}
        />

        <Soldier keys={keys} gltfPath="/models/Soldier.glb" />
        <World />

        <OrbitControls
          enableRotate={animationConfig.orbitControls.enableRotate}
          target={animationConfig.orbitControls.target}
        />
      </Canvas>

      {/* Controls */}
      <Controls
        keys={keys}
        shiftLabel="RUN"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
    </div>
  );
}
