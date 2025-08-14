"use client";
import { useRef, useState, useEffect, useCallback, MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import * as THREE from "three";

import { KeyState, KeyboardHandler } from "../components/KeyboardHandler";

const boundarySize = 1000;
const halfBoundary = boundarySize / 2;
const blockSize = 20;
const initSpeed = 5;
const boostMultiplier = 3;
const maxStaminaBlocks = 4;
const staminaDepletionRate = 2500; // ms per block
const initMaxScore = 50;
const origin = new THREE.Vector3(0, 0, -200);

function Head({ headRef }: { headRef: MutableRefObject<THREE.Mesh | null> }) {
  return (
    <mesh ref={headRef} position={[origin.x, origin.y, origin.z]}>
      <boxGeometry args={[blockSize, blockSize, blockSize]} />
      <meshBasicMaterial color={0x00ff00} />
    </mesh>
  );
}

function Fruit({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[blockSize, blockSize, blockSize]} />
      <meshBasicMaterial color={0xff0000} />
    </mesh>
  );
}

function Boundary() {
  return (
    <mesh position={[origin.x, origin.y, origin.z]}>
      <boxGeometry args={[boundarySize, 0.1, boundarySize]} />
      <meshBasicMaterial wireframe={true} color={0xffffff} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function Snake() {
  // game state
  const [bodyParts, setBodyParts] = useState<THREE.Vector3[]>([]); // array of Vector3
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

  // camera setup handled by PerspectiveCamera + OrbitControls

  // Helpers
  const randPos = useCallback(() => {
    const x = Math.random() * boundarySize - halfBoundary;
    const z = Math.random() * boundarySize - halfBoundary;
    return new THREE.Vector3(origin.x + x, origin.y, origin.z + z);
  }, []);

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
  }, [speed, baseSpeed, isBoosting, staminaBlocks, staminaTimerRef]);

  const stopBoost = useCallback(() => {
    if (!staminaTimerRef.current) return;
    setSpeed(baseSpeed);
    setIsBoosting(false);
    clearInterval(staminaTimerRef.current);
    staminaTimerRef.current = null;
  }, [speed, baseSpeed, isBoosting, staminaTimerRef]);

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
  }, []);

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
      let hit = false;
      if (headRef.current.position.x < -halfBoundary) { headRef.current.position.x = -halfBoundary; hit = true; }
      if (headRef.current.position.x > halfBoundary) { headRef.current.position.x = halfBoundary; hit = true; }
      if (headRef.current.position.z < -(halfBoundary + -origin.z)) { headRef.current.position.z = -(halfBoundary + -origin.z); hit = true; }
      if (headRef.current.position.z > (halfBoundary + origin.z)) { headRef.current.position.z = (halfBoundary + origin.z); hit = true; }
      if (hit) {
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
      let collectedFruitSet = new Set(fruits.filter((fruit) => {
        return headRef.current && fruit.distanceTo(headRef.current.position) < blockSize;
      }));

      if (collectedFruitSet.size > 0) {
        setScore(s => s + 5);
        growSnake(3);
        setFruitCollectedCount(fc => fc + 1);
        let newFruitsSet = new Set(fruits).difference(collectedFruitSet);
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
        setSpeed(_ => {
          // Add three to the current frame's base speed so we don't have
          // to wait for the next frame.
          // TODO(@NyaliaLui): Remove magic numbers
          const nb = baseSpeed + 3;
          return isBoosting ? nb * boostMultiplier : nb;
        });
        setMaxScore(ms => ms + initMaxScore);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 2000);
      }
    })

    return null;
  }
  
  return (
    <div style={{ height: "100vh", width: "100vw", background: "black" }}>
      {/* HUD */}
      <div id="score-board">
        <div id="max-score">
          Max: {maxScore}
        </div>
        <div id="score">
          Score: {score}
        </div>
      </div>
      <div id="level-up" style={{ opacity: showLevelUp ? 1 : 0 }}>
        Level: {level}
      </div>
      <div id="stamina">
        {new Array(staminaBlocks).fill(0).map((_, i) => (
          <div key={i} className="stamina-block"></div>
        ))}
      </div>

      {/* Game Canvas */}
      <Canvas gl={{antialias: true, alpha: true}} camera={{ fov: 75, near: 0.1, far: 2000, position: [0, 1000, 0]}} onCreated={(state) => {state.camera.lookAt(0, 0, 0);}}>
        <Boundary />
        <Head headRef={headRef} />
        {bodyParts.map((pos, i) => (
          <mesh key={i} position={[pos.x, pos.y, pos.z]}>
            <boxGeometry args={[blockSize, blockSize, blockSize]} />
            <meshBasicMaterial color={0x00aa00} />
          </mesh>
        ))}
        {fruits.map((pos, i) => (
          <Fruit key={i} position={[pos.x, pos.y, pos.z]} />
        ))}
        <OrbitControls enableRotate={false} enablePan={false} enableZoom={false} />
        <SceneUpdater />
      </Canvas>
      <KeyboardHandler onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} keys={keysRef.current} msg="WASD to move • Shift to boost" />
    </div>
  );
}
