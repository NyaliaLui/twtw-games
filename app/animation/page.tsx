// app/animation/page.tsx
'use client';
import { useRef, useCallback, useReducer } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { KeyState, Controls, initKeyState } from '@/app/components/Controls';
import { Soldier } from '@/app/components/animation/Soldier';
import { World } from '@/app/components/animation/World';
import { animationConfig } from '../constants';

export default function Animation() {
  const keysRef = useRef<KeyState>(initKeyState());
  // TODO(@NyaliaLui): Forcing a re-render this way seems like a waste of memory. Look into an alternative.
  // Add state to force re-renders. Addressed CSS Class change problem in https://github.com/NyaliaLui/twtw-games/issues/9
  const [, forceUpdate] = useReducer((dummy) => !dummy, true);
  const handleKeyDown = useCallback(() => {
    forceUpdate();
  }, []);

  const handleKeyUp = useCallback(() => {
    forceUpdate();
  }, []);

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

        <Soldier keys={keysRef.current} gltfPath="/models/Soldier.glb" />
        <World />

        <OrbitControls
          enableRotate={animationConfig.orbitControls.enableRotate}
          target={animationConfig.orbitControls.target}
        />
      </Canvas>

      {/* Controls */}
      <Controls
        keys={keysRef.current}
        shiftLabel="RUN"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
    </div>
  );
}
