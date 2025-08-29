// app/animation/page.tsx
'use client';
import { useRef, useCallback, useReducer } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { KeyState, Controls } from '@/app/components/Controls';
import { Soldier } from '@/app/components/animation/Soldier';
import { World } from '@/app/components/animation/World';

export default function Animation() {
  const keysRef = useRef<KeyState>({ w: false, a: false, s: false, d: false, shift: false });
  // TODO(@NyaliaLui): Forcing a re-render this way seems like a waste of memory. Look into an alternative.
  // Add state to force re-renders. Addressed CSS Class change problem in https://github.com/NyaliaLui/twtw-games/issues/9
  const [, forceUpdate] = useReducer(dummy => !dummy, true);
  const handleKeyDown = useCallback(() => {
    forceUpdate();
  }, []);

  const handleKeyUp = useCallback(() => {
    forceUpdate();
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-40">
      <Canvas shadows={true} camera={{ position: [0, 2, 5], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <directionalLight castShadow position={[3, 10, 5]} intensity={0.8} />

        <Soldier keys={keysRef.current} gltfPath='/models/Soldier.glb' />
        <World />

        <OrbitControls enableRotate={false} target={[0, 1, 0]} />
      </Canvas>
      
      {/* Controls */}
      <Controls keys={keysRef.current} shiftLabel='RUN' onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
    </div>
  );
}