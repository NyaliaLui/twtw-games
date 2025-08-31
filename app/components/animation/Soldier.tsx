'use client';
import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { Group, AnimationAction, Vector3 } from 'three';

import { KeyState } from '@/app/hooks/useGameControls';
import { breakpointSM } from '@/app/utils';
import { animationConfig } from '@/app/constants';

export { Soldier };

function Soldier({ keys, gltfPath }: { keys: KeyState; gltfPath: string }) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(gltfPath);
  const { actions, mixer } = useAnimations(animations, scene);
  const [current, setCurrent] = useState<string | null>(null);

  const anims = useRef<Record<string, AnimationAction>>({});

  const { size } = useThree();

  // On screens larger than small breakpoint use sm scale
  // otherwise use default.
  scene.scale.setScalar(
    breakpointSM(size.width)
      ? animationConfig.scale.soldier.sm
      : animationConfig.scale.soldier.default,
  );

  useEffect(() => {
    if (!actions) return;
    Object.keys(actions).forEach((name) => {
      const action = actions[name];
      if (action) anims.current[name.toLowerCase()] = action;
    });
    const idle = anims.current['idle'];
    if (idle) {
      idle.reset().fadeIn(animationConfig.fadeDuration).play();
      setCurrent('idle');
    }
    return () => {
      mixer?.stopAllAction();
    };
  }, [actions, mixer]);

  useFrame((_, delta) => {
    if (!group.current) return;
    mixer?.update(delta);

    const moveDir = new Vector3();
    if (keys.w) moveDir.z -= animationConfig.moveUnit;
    if (keys.s) moveDir.z += animationConfig.moveUnit;
    if (keys.a) moveDir.x -= animationConfig.moveUnit;
    if (keys.d) moveDir.x += animationConfig.moveUnit;

    const moving = moveDir.lengthSq() > 0;
    if (moving) {
      moveDir.normalize();
      const speed =
        animationConfig.baseSpeed * animationConfig.runMultiplier(keys.shift);
      group.current.position.add(moveDir.clone().multiplyScalar(speed));
      const angle = Math.atan2(moveDir.x, moveDir.z);
      group.current.rotation.y = angle + Math.PI;
    }

    const target = moving
      ? keys.shift && anims.current['run']
        ? 'run'
        : 'walk'
      : 'idle';
    if (anims.current[target] && current !== target) {
      if (current && anims.current[current])
        anims.current[current].fadeOut(animationConfig.fadeDuration);
      anims.current[target].reset().fadeIn(animationConfig.fadeDuration).play();
      setCurrent(target);
    }
  });

  return <primitive ref={group} object={scene} dispose={null} />;
}
