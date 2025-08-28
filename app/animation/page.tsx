// app/animation/page.tsx
'use client';
import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { KeyState, Controls } from '@/app/components/Controls';
import { Soldier } from '@/app/components/animation/Soldier';
import { World } from '@/app/components/animation/World';

export default function Animation() {
  const keysRef = useRef<KeyState>({ w: false, a: false, s: false, d: false, shift: false });

  return (
    <div className="w-screen h-screen bg-black">
      <Canvas shadows={true} camera={{ position: [0, 2, 5], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <directionalLight castShadow position={[3, 10, 5]} intensity={0.8} />

        <Soldier keys={keysRef.current} gltfPath='/models/Soldier.glb' />
        <World />

        <OrbitControls enableRotate={false} target={[0, 1, 0]} />
      </Canvas>
      
      {/* Controls */}
      <Controls keys={keysRef.current} shiftLabel='RUN' onKeyDown={() => {}} onKeyUp={() => {}} />
    </div>
  );
}