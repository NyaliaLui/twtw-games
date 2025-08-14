// app/page.tsx
'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface KeyState {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  shift: boolean;
}

function Soldier() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/Soldier.glb') as unknown as { scene: THREE.Group; animations: THREE.AnimationClip[] };
  const { actions, mixer } = useAnimations(animations, scene);
  const [current, setCurrent] = useState<string | null>(null);

  const keys = useRef<KeyState>({ w: false, a: false, s: false, d: false, shift: false });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in keys.current) keys.current[k as keyof KeyState] = true;
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in keys.current) keys.current[k as keyof KeyState] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const anims = useRef<Record<string, THREE.AnimationAction>>({});
  useEffect(() => {
    if (!actions) return;
    Object.keys(actions).forEach((name) => {
      const action = actions[name];
      if (action) anims.current[name.toLowerCase()] = action;
    });
    const idle = anims.current['idle'];
    if (idle) {
      idle.reset().fadeIn(0.2).play();
      setCurrent('idle');
    }
    return () => {
      mixer?.stopAllAction();
    };
  }, [actions, mixer]);

  const baseSpeed = 0.08;
  const runMultiplier = 2.5;

  useFrame((_, delta) => {
    if (!group.current) return;
    mixer?.update(delta);

    const moveDir = new THREE.Vector3();
    if (keys.current.w) moveDir.z -= 1;
    if (keys.current.s) moveDir.z += 1;
    if (keys.current.a) moveDir.x -= 1;
    if (keys.current.d) moveDir.x += 1;

    const moving = moveDir.lengthSq() > 0;
    if (moving) {
      moveDir.normalize();
      const speed = baseSpeed * (keys.current.shift ? runMultiplier : 1);
      group.current.position.add(moveDir.clone().multiplyScalar(speed));
      const angle = Math.atan2(moveDir.x, moveDir.z);
      group.current.rotation.y = angle + Math.PI;
    }

    const target = moving ? (keys.current.shift && anims.current['run'] ? 'run' : 'walk') : 'idle';
    if (anims.current[target] && current !== target) {
      if (current && anims.current[current]) anims.current[current].fadeOut(0.2);
      anims.current[target].reset().fadeIn(0.2).play();
      setCurrent(target);
    }
  });

  return <primitive ref={group} object={scene} dispose={null} />;
}

function GroundAndSky() {
  const grass = useTexture('/textures/grass.jpg');
  grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
  grass.repeat.set(10, 10);

  const { scene } = useThree();
  useEffect(() => {
    new THREE.TextureLoader().load('/textures/sky.jpg', (tx) => {
      scene.background = tx;
    });
  }, [scene]);

  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial map={grass} />
    </mesh>
  );
}

export default function Animation() {
  const controlsRef = useRef<React.ElementRef<typeof OrbitControls>>(null);

  return (
    <div className="w-screen h-screen bg-black">
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <directionalLight castShadow position={[3, 10, 5]} intensity={0.8} />

        <Suspense fallback={null}>
          <Soldier />
          <GroundAndSky />
        </Suspense>

        <OrbitControls ref={controlsRef} enableRotate={false} target={[0, 1, 0]} />
      </Canvas>

      <div className="keyboard-controls bg-black/40 p-2 rounded">
        WASD to move • Shift to run
      </div>
    </div>
  );
}
