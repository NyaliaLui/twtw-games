// app/page.tsx
'use client';
import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { KeyState, KeyboardHandler } from '@/app/components/KeyboardHandler';
import { Soldier } from '@/app/components/animation/Soldier';
import { GroundAndSky } from '@/app/components/animation/GroundAndSky';

export default function Animation() {
  const keysRef = useRef<KeyState>({ w: false, a: false, s: false, d: false, shift: false });

  return (
    <div className="w-screen h-screen bg-black">
      <Canvas shadows={true} camera={{ position: [0, 2, 5], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <directionalLight castShadow position={[3, 10, 5]} intensity={0.8} />

        <Soldier keys={keysRef.current} gltfPath='/models/Soldier.glb' />
        <GroundAndSky />

        <OrbitControls enableRotate={false} target={[0, 1, 0]} />
      </Canvas>
      <KeyboardHandler onKeyDown={() => {}} onKeyUp={() => {}} keys={keysRef.current} msg="WASD to move • Shift to run" />
    </div>
  );
}
