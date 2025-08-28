// app/animation/page.tsx
'use client';
import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Link from 'next/link';

import { KeyState, Controls } from '@/app/components/Controls';
import { Soldier } from '@/app/components/animation/Soldier';
import { World } from '@/app/components/animation/World';

export default function Animation() {
  const keysRef = useRef<KeyState>({ w: false, a: false, s: false, d: false, shift: false });

  return (
    <div className="fixed inset-0 bg-black z-40">
      <Link 
        href="/" 
        className="fixed top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        aria-label="Exit to Main Menu"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm">Exit</span>
      </Link>
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