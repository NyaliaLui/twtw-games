// app/animation/page.tsx
'use client';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';

import { useGameControls } from '@/app/hooks/useGameControls';
import { Controls } from '@/app/components/Controls';
import { Soldier } from '@/app/components/animation/Soldier';
import { World } from '@/app/components/animation/World';
import { animationConfig } from '../constants';

function LoadingScreen() {
  return (
    <Html
      as="div"
      fullscreen
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
        <h2 className="text-white text-xl font-semibold mb-2">
          Loading Game Assets
        </h2>
        <p className="text-gray-400">Loading 3D models and textures...</p>
      </div>
    </Html>
  );
}

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
        <Suspense fallback={<LoadingScreen />}>
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
        </Suspense>
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
