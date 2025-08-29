"use client";
import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import { KeyState, Controls } from '@/app/components/Controls';
import { makeHeadProps, Head } from '@/app/components/snake/Head';
import { makeFruitProps, Fruit } from '@/app/components/snake/Fruit';
import { makeBoundaryProps, Boundary } from '@/app/components/snake/Boundary';
import { makeBodyProps, BodyPart } from '@/app/components/snake/BodyPart';
import { boundarySize, blockSize, gameOrigin, isBoundaryHit, getCollectedFruitSet, breakpointSM, isWindowDefined } from '@/app/utils';

function getConditionalSizes(): { gameBoundarySize: number; gameHalfBoundarySize: number; cubeDim: number; } {
  const ret = {
    gameBoundarySize: 0,
    gameHalfBoundarySize: 0,
    cubeDim: 0
  };

  // On screens larger than small breakpoint use larger sizes
  // otherwise use smaller sizes.
  if (isWindowDefined() && breakpointSM(window.innerWidth)) {
    ret.gameBoundarySize = boundarySize;
    ret.cubeDim = blockSize;
  } else {
    ret.gameBoundarySize = boundarySize / 2;
    ret.cubeDim = blockSize * 0.75;
  }

  ret.gameHalfBoundarySize = ret.gameBoundarySize / 2;

  return ret;
}

export default function Snake() {
  const initSpeed = 5;
  const boostMultiplier = 3;
  const maxStaminaBlocks = 4;
  const staminaDepletionRate = 2500; // ms per block
  const initMaxScore = 50;

  const { gameBoundarySize, gameHalfBoundarySize, cubeDim } = getConditionalSizes();

  // game state
  const [bodyParts, setBodyParts] = useState<THREE.Vector3[]>([]); // array of Vector3
  // TODO(@NyaliaLui): Re-examine head. According to React Docs, it may not be a suitable
  // candidate for a ref object because I believe the head (and body) are always changed during the
  // rendering process. Therefore, useState may be more appropriate. https://react.dev/learn/referencing-values-with-refs#when-to-use-refs
  const headRef = useRef<THREE.Mesh | null>(null);
  const keysRef = useRef<KeyState>({ w: false, a: false, s: false, d: false, shift: false });

  const [fruits, setFruits] = useState<THREE.Vector3[]>([]); // array of Vector3
  const [fruitCount, setFruitCount] = useState(1);

  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(initMaxScore);
  const [level, setLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const [baseSpeed, setBaseSpeed] = useState(initSpeed);
  const [speed, setSpeed] = useState(initSpeed);
  const [isBoosting, setIsBoosting] = useState(false);

  const [staminaBlocks, setStaminaBlocks] = useState(0);
  const staminaTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [fruitCollectedCount, setFruitCollectedCount] = useState(0);

  // Helpers
  const randPos = useCallback(() => {
    const x = Math.random() * gameBoundarySize - gameHalfBoundarySize;
    const z = Math.random() * gameBoundarySize - gameHalfBoundarySize;
    return new THREE.Vector3(gameOrigin.x + x, gameOrigin.y, gameOrigin.z + z);
  }, [gameBoundarySize, gameHalfBoundarySize]);

  const spawnFruits = useCallback((count: number = fruitCount) => {
    // TOOD(@NyaliaLui): What happens if the snake collects two or more fruits in the same frame?
    //                  A: Currently, there is potential for fruits to spawn in the same location as the last one.
    //                 This appears in the game when it looks like collecting 1 fruit led to a double count in the score.
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) arr.push(randPos());
    setFruits(arr);
  }, [randPos, fruitCount]);

  const growSnake = useCallback((parts: number = 3) => {
    setBodyParts(prev => {
      const headPos = headRef.current ? headRef.current.position.clone() : new THREE.Vector3();
      const newParts = new Array(parts).fill(0).map(() => headPos.clone());
      return [...prev, ...newParts];
    });
  }, []);

  const resetSnake = useCallback(() => {
    setBodyParts([]);
    growSnake();
    setScore(0);
    setBaseSpeed(initSpeed);
    setSpeed(initSpeed);
    setFruitCount(1);
    setLevel(1);
    setMaxScore(initMaxScore);
    setStaminaBlocks(0);
    setFruitCollectedCount(0);
    setIsBoosting(false);
    if (staminaTimerRef.current) {
      clearInterval(staminaTimerRef.current);
      staminaTimerRef.current = null;
    }
    spawnFruits(1);
  }, [growSnake, spawnFruits]);
  
  const startBoost = useCallback(() => {
    if (staminaTimerRef.current) return;
    setSpeed(baseSpeed * boostMultiplier);
    setIsBoosting(true);
    staminaTimerRef.current = setInterval(() => {
      setStaminaBlocks(sb => sb - 1);
    }, staminaDepletionRate);
  }, [baseSpeed, staminaTimerRef]);

  const stopBoost = useCallback(() => {
    if (!staminaTimerRef.current) return;
    setSpeed(baseSpeed);
    setIsBoosting(false);
    clearInterval(staminaTimerRef.current);
    staminaTimerRef.current = null;
  }, [baseSpeed, staminaTimerRef]);

  const handleKeyDown = useCallback((keys: KeyState) => {
    if (keys.shift && staminaBlocks > 0) {
      startBoost();
    }
  }, [staminaBlocks, startBoost]);

  const handleKeyUp = useCallback((keys: KeyState) => {
    if (!keys.shift) {
      stopBoost();
    }
  }, [stopBoost]);

  useEffect(() => {
    // initial placement
    resetSnake();
  }, [resetSnake]);

  // main game loop via useFrame
  function SceneUpdater() {
    useFrame(() => {
      if (!headRef.current) return;

      if (staminaBlocks === 0) stopBoost();

      const vel = new THREE.Vector3();
      if (keysRef.current.w) vel.z -= speed;
      if (keysRef.current.s) vel.z += speed;
      if (keysRef.current.a) vel.x -= speed;
      if (keysRef.current.d) vel.x += speed;
      headRef.current.position.add(vel);

      // boundary check
      const boundCheck = isBoundaryHit(headRef.current, gameHalfBoundarySize, gameOrigin);
      if (boundCheck.isHit) {
        headRef.current.position.copy(boundCheck.pos);
        resetSnake();
        return;
      }

      // move body parts
      setBodyParts(prev => {
        if (prev.length === 0 || !headRef.current) return prev;
        const newParts = prev.map(p => p.clone());
        for (let i = newParts.length - 1; i > 0; i--) newParts[i].copy(newParts[i - 1]);
        newParts[0].copy(headRef.current.position);
        return newParts;
      })

      // fruit collision
      const collectedFruitSet = getCollectedFruitSet(fruits, headRef.current, cubeDim);

      if (collectedFruitSet.size > 0) {
        setScore(s => s + 5);
        growSnake(3);
        setFruitCollectedCount(fc => fc + 1);
        const newFruitsSet = new Set(fruits).difference(collectedFruitSet);
        setFruits([...newFruitsSet]);
      }

      if (fruitCollectedCount >= 5 && staminaBlocks < maxStaminaBlocks) {
        setStaminaBlocks(sb => sb + 1);
        setFruitCollectedCount(0);
      }

      if (fruits.length === 0) {
        spawnFruits();
      }

      if (score >= maxScore) {
        // Check the level on the current frame first since we do not
        // know when the next frame will load.
        if ((level+1) % 3 === 0) {
          setFruitCount(fc => fc + 1);
          // TODO(@NyaliaLui): This is a hack for spawing the correct amount of fruits
          // between frames. Please clean this up.
          spawnFruits(fruitCount + 1);
        } else {
          spawnFruits();
        }

        setLevel(l => l + 1);
        setBaseSpeed(bs => bs + 3);
        // Add to the current frame's base speed so we don't have
        // to wait for the next frame.
        // TODO(@NyaliaLui): Remove magic numbers
        const nb = baseSpeed + 3;
        setSpeed(isBoosting ? nb * boostMultiplier : nb);
        setMaxScore(ms => ms + initMaxScore);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 2000);
      }
    })

    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black z-40">
      {/* HUD */}
      <div id="score-board" className="absolute w-full top-[8vh] left-0 flex justify-between pl-5 pr-5 text-white font-mono text-lg sm:text-2xl">
        <div id="max-score">
          Max: {maxScore}
        </div>
        <div id="score">
          Score: {score}
        </div>
      </div>
      <div id="level-up" className="absolute top-1/2 left-1/2 text-white font-mono text-2xl sm:text-5xl" style={{ opacity: showLevelUp ? 1 : 0, transform: 'translate(-50%, -80%)' }}>
        Level: {level}
      </div>
      <div id="stamina" className="absolute left-2.5 top-[40vh] sm:top-[35vh] w-6 sm:w-8 h-24 gap-1 flex flex-col-reverse border-2 border-solid border-white rounded-md">
        {new Array(staminaBlocks).fill(0).map((_, i) => (
          <div key={i} className="w-full h-5 bg-lime-400"></div>
        ))}
      </div>

      {/* Game Canvas */}
      <Canvas gl={{antialias: true, alpha: true}} camera={{ fov: 75, near: 0.1, far: 2000, position: [0, 1000, 0]}} onCreated={(state) => {state.camera.lookAt(0, 0, 0);}}>
        <Boundary boundProps={makeBoundaryProps([gameOrigin.x, gameOrigin.y, gameOrigin.z], [gameBoundarySize, 0.1, gameBoundarySize])}/>
        <Head headProps={makeHeadProps(headRef, [gameOrigin.x, gameOrigin.y, gameOrigin.z], cubeDim)} />
        {bodyParts.map((pos, i) => (
          <BodyPart key={i} bodyProps={makeBodyProps([pos.x, pos.y, pos.z], cubeDim)}/>
        ))}
        {fruits.map((pos, i) => (
          <Fruit key={i} fruitProps={makeFruitProps([pos.x, pos.y, pos.z], cubeDim)} />
        ))}
        <OrbitControls enableRotate={false} enablePan={false} enableZoom={false} />
        <SceneUpdater />
      </Canvas>
      
      {/* Controls */}
      <Controls keys={keysRef.current} shiftLabel='BOOST' onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
    </div>
  );
}