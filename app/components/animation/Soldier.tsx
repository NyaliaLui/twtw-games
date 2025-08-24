'use client';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

import { KeyState } from "@/app/components/KeyboardHandler";

export { Soldier };

function Soldier({ keys, gltfPath }: { keys: KeyState, gltfPath: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(gltfPath);
  const { actions, mixer } = useAnimations(animations, scene);
  const [current, setCurrent] = useState<string | null>(null);

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
    if (keys.w) moveDir.z -= 1;
    if (keys.s) moveDir.z += 1;
    if (keys.a) moveDir.x -= 1;
    if (keys.d) moveDir.x += 1;

    const moving = moveDir.lengthSq() > 0;
    if (moving) {
      moveDir.normalize();
      const speed = baseSpeed * (keys.shift ? runMultiplier : 1);
      group.current.position.add(moveDir.clone().multiplyScalar(speed));
      const angle = Math.atan2(moveDir.x, moveDir.z);
      group.current.rotation.y = angle + Math.PI;
    }

    const target = moving ? (keys.shift && anims.current['run'] ? 'run' : 'walk') : 'idle';
    if (anims.current[target] && current !== target) {
      if (current && anims.current[current]) anims.current[current].fadeOut(0.2);
      anims.current[target].reset().fadeIn(0.2).play();
      setCurrent(target);
    }
  });

  return <primitive ref={group} object={scene} dispose={null} />;
}