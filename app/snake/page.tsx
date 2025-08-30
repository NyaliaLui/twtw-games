'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';

import { KeyState, Controls, initKeyState } from '@/app/components/Controls';
import { makeHeadProps, Head } from '@/app/components/snake/Head';
import { makeFruitProps, Fruit } from '@/app/components/snake/Fruit';
import { makeBoundaryProps, Boundary } from '@/app/components/snake/Boundary';
import { makeBodyProps, BodyPart } from '@/app/components/snake/BodyPart';
import {
  isBoundaryHit,
  getCollectedFruitSet,
  breakpointSM,
  isWindowDefined,
} from '@/app/utils';
import { snakeConfig } from '@/app/constants';

function getConditionalSizes(): {
  gameBoundarySize: number;
  gameHalfBoundarySize: number;
  cubeDim: number;
} {
  const ret = {
    gameBoundarySize: 0,
    gameHalfBoundarySize: 0,
    cubeDim: 0,
  };

  // On screens larger than small breakpoint use larger sizes
  // otherwise use smaller sizes.
  if (isWindowDefined() && breakpointSM(window.innerWidth)) {
    ret.gameBoundarySize = snakeConfig.boundarySize;
    ret.cubeDim = snakeConfig.blockSize;
  } else {
    ret.gameBoundarySize = snakeConfig.boundarySize / 2;
    ret.cubeDim = snakeConfig.blockSize * snakeConfig.cubeDimSmallMultiplier;
  }

  ret.gameHalfBoundarySize = ret.gameBoundarySize / 2;

  return ret;
}

export default function Snake() {
  const { gameBoundarySize, gameHalfBoundarySize, cubeDim } =
    getConditionalSizes();

  // game state
  const [bodyParts, setBodyParts] = useState<Vector3[]>(
    snakeConfig.initBodyParts,
  ); // array of Vector3
  // TODO(@NyaliaLui): Re-examine head. According to React Docs, it may not be a suitable
  // candidate for a ref object because I believe the head (and body) are always changed during the
  // rendering process. Therefore, useState may be more appropriate. https://react.dev/learn/referencing-values-with-refs#when-to-use-refs
  const headRef = useRef<Mesh | null>(snakeConfig.initHead);
  const keysRef = useRef<KeyState>(initKeyState());

  const [fruits, setFruits] = useState<Vector3[]>(snakeConfig.initFruits);
  const [fruitCount, setFruitCount] = useState(snakeConfig.initFruitCount);

  const [score, setScore] = useState(snakeConfig.initScore);
  const [maxScore, setMaxScore] = useState(snakeConfig.initMaxScore);
  const [level, setLevel] = useState(snakeConfig.initLevel);
  const [showLevelUp, setShowLevelUp] = useState(snakeConfig.initShowLevelUp);

  const [baseSpeed, setBaseSpeed] = useState(snakeConfig.initSpeed);
  const [speed, setSpeed] = useState(snakeConfig.initSpeed);
  const [isBoosting, setIsBoosting] = useState(snakeConfig.initIsBoosting);

  const [staminaBlocks, setStaminaBlocks] = useState(
    snakeConfig.initStaminaBlocks,
  );
  const staminaTimerRef = useRef<NodeJS.Timeout | null>(
    snakeConfig.initStaminaTimer,
  );

  const [fruitCollectedCount, setFruitCollectedCount] = useState(
    snakeConfig.initFruitCollectedCount,
  );

  // Helpers
  const randPos = useCallback(() => {
    const x = Math.random() * gameBoundarySize - gameHalfBoundarySize;
    const z = Math.random() * gameBoundarySize - gameHalfBoundarySize;
    return new Vector3(
      snakeConfig.origin.x + x,
      snakeConfig.origin.y,
      snakeConfig.origin.z + z,
    );
  }, [gameBoundarySize, gameHalfBoundarySize]);

  const spawnFruits = useCallback(
    (count: number = fruitCount) => {
      // TOOD(@NyaliaLui): What happens if the snake collects two or more fruits in the same frame?
      //                  A: Currently, there is potential for fruits to spawn in the same location as the last one.
      //                 This appears in the game when it looks like collecting 1 fruit led to a double count in the score.
      const arr: Vector3[] = [];
      for (let i = 0; i < count; i++) arr.push(randPos());
      setFruits(arr);
    },
    [randPos, fruitCount],
  );

  const growSnake = useCallback(
    (parts: number = snakeConfig.numPartsToGrow) => {
      setBodyParts((prev) => {
        const headPos = headRef.current
          ? headRef.current.position.clone()
          : new Vector3();
        const newParts = new Array(parts).fill(0).map(() => headPos.clone());
        return [...prev, ...newParts];
      });
    },
    [],
  );

  const resetSnake = useCallback(() => {
    setBodyParts(snakeConfig.initBodyParts);
    growSnake();
    setScore(snakeConfig.initScore);
    setBaseSpeed(snakeConfig.initSpeed);
    setSpeed(snakeConfig.initSpeed);
    setFruitCount(snakeConfig.initFruitCount);
    setLevel(snakeConfig.initLevel);
    setMaxScore(snakeConfig.initMaxScore);
    setStaminaBlocks(snakeConfig.initStaminaBlocks);
    setFruitCollectedCount(snakeConfig.initFruitCollectedCount);
    setIsBoosting(snakeConfig.initIsBoosting);
    if (staminaTimerRef.current) {
      clearInterval(staminaTimerRef.current);
      staminaTimerRef.current = snakeConfig.initStaminaTimer;
    }
    spawnFruits(1);
  }, [growSnake, spawnFruits]);

  const startBoost = useCallback(() => {
    if (staminaTimerRef.current) return;
    setSpeed(baseSpeed * snakeConfig.boostMultiplier);
    setIsBoosting(true);
    staminaTimerRef.current = setInterval(() => {
      setStaminaBlocks((sb) => sb - snakeConfig.decrementStaminaBlock);
    }, snakeConfig.staminaDepletionRate);
  }, [baseSpeed, staminaTimerRef]);

  const stopBoost = useCallback(() => {
    if (!staminaTimerRef.current) return;
    setSpeed(baseSpeed);
    setIsBoosting(false);
    clearInterval(staminaTimerRef.current);
    staminaTimerRef.current = null;
  }, [baseSpeed, staminaTimerRef]);

  const handleKeyDown = useCallback(
    (keys: KeyState) => {
      if (keys.shift && staminaBlocks > 0) {
        startBoost();
      }
    },
    [staminaBlocks, startBoost],
  );

  const handleKeyUp = useCallback(
    (keys: KeyState) => {
      if (!keys.shift) {
        stopBoost();
      }
    },
    [stopBoost],
  );

  useEffect(() => {
    // initial placement
    resetSnake();
  }, [resetSnake]);

  // main game loop via useFrame
  function SceneUpdater() {
    useFrame(() => {
      if (!headRef.current) return;

      if (staminaBlocks === 0) stopBoost();

      const vel = new Vector3();
      if (keysRef.current.w) vel.z -= speed;
      if (keysRef.current.s) vel.z += speed;
      if (keysRef.current.a) vel.x -= speed;
      if (keysRef.current.d) vel.x += speed;
      headRef.current.position.add(vel);

      // boundary check
      const boundCheck = isBoundaryHit(
        headRef.current,
        gameHalfBoundarySize,
        snakeConfig.origin,
      );
      if (boundCheck.isHit) {
        headRef.current.position.copy(boundCheck.pos);
        resetSnake();
        return;
      }

      // move body parts
      setBodyParts((prev) => {
        if (prev.length === 0 || !headRef.current) return prev;
        const newParts = prev.map((p) => p.clone());
        for (let i = newParts.length - 1; i > 0; i--)
          newParts[i].copy(newParts[i - 1]);
        newParts[0].copy(headRef.current.position);
        return newParts;
      });

      // fruit collision
      const collectedFruitSet = getCollectedFruitSet(
        fruits,
        headRef.current,
        cubeDim,
      );

      if (collectedFruitSet.size > 0) {
        setScore((s) => s + snakeConfig.incrementScore);
        growSnake();
        setFruitCollectedCount(
          (fc) => fc + snakeConfig.incrementFruitCollected,
        );
        const newFruitsSet = new Set(fruits).difference(collectedFruitSet);
        setFruits([...newFruitsSet]);
      }

      if (
        fruitCollectedCount >= snakeConfig.fruitPerStaminaBlock &&
        staminaBlocks < snakeConfig.maxStaminaBlocks
      ) {
        setStaminaBlocks((sb) => sb + snakeConfig.incrementStaminaBlock);
        setFruitCollectedCount(snakeConfig.initFruitCollectedCount);
      }

      if (fruits.length === 0) {
        spawnFruits();
      }

      if (score >= maxScore) {
        // Check the level on the current frame first since we do not
        // know when the next frame will load.
        if ((level + 1) % snakeConfig.levelsToIncrementFruit === 0) {
          setFruitCount((fc) => fc + snakeConfig.incrementFruitCount);
          // TODO(@NyaliaLui): This is a hack for spawing the correct amount of fruits
          // between frames. Please clean this up.
          spawnFruits(fruitCount + snakeConfig.incrementFruitCount);
        } else {
          spawnFruits();
        }

        setLevel((l) => l + snakeConfig.incrementLevel);
        setBaseSpeed((bs) => bs + snakeConfig.incrementBaseSpeed);
        // Add to the current frame's base speed so we don't have
        // to wait for the next frame.
        const nb = baseSpeed + snakeConfig.incrementBaseSpeed;
        setSpeed(isBoosting ? nb * snakeConfig.boostMultiplier : nb);
        setMaxScore((ms) => ms + snakeConfig.initMaxScore);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), snakeConfig.levelUpTimeout);
      }
    });

    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-40">
      {/* HUD */}
      <div
        id="score-board"
        className="absolute top-2 lg:top-4 right-4 text-white font-mono text-lg sm:text-2xl"
      >
        <div id="max-score">Max: {maxScore}</div>
        <div id="score">Score: {score}</div>
      </div>
      <div
        id="level-up"
        className="absolute top-1/2 left-1/2 text-white font-mono text-2xl sm:text-5xl"
        style={{
          opacity: showLevelUp ? 1 : 0,
          transform: 'translate(-50%, -80%)',
        }}
      >
        Level: {level}
      </div>
      <div
        id="stamina"
        className="absolute left-2.5 top-[40vh] sm:top-[32vh] w-6 sm:w-8 h-24 gap-1 flex flex-col-reverse border-2 border-solid border-white rounded-md"
      >
        {new Array(staminaBlocks).fill(0).map((_, i) => (
          <div key={i} className="w-full h-5 bg-lime-400"></div>
        ))}
      </div>

      {/* Game Canvas */}
      <Canvas
        gl={{
          antialias: snakeConfig.renderer.antialias,
          alpha: snakeConfig.renderer.alpha,
        }}
        camera={{
          fov: snakeConfig.camera.fov,
          near: snakeConfig.camera.near,
          far: snakeConfig.camera.far,
          position: snakeConfig.camera.position,
        }}
        onCreated={snakeConfig.onCreated}
      >
        <Boundary
          boundProps={makeBoundaryProps(
            [snakeConfig.origin.x, snakeConfig.origin.y, snakeConfig.origin.z],
            [gameBoundarySize, 0.1, gameBoundarySize],
          )}
        />
        <Head
          headProps={makeHeadProps(
            headRef,
            [snakeConfig.origin.x, snakeConfig.origin.y, snakeConfig.origin.z],
            cubeDim,
          )}
        />
        {bodyParts.map((pos, i) => (
          <BodyPart
            key={i}
            bodyProps={makeBodyProps([pos.x, pos.y, pos.z], cubeDim)}
          />
        ))}
        {fruits.map((pos, i) => (
          <Fruit
            key={i}
            fruitProps={makeFruitProps([pos.x, pos.y, pos.z], cubeDim)}
          />
        ))}
        <OrbitControls
          enableRotate={snakeConfig.orbitControls.enableRotate}
          enablePan={snakeConfig.orbitControls.enablePan}
          enableZoom={snakeConfig.orbitControls.enableZoom}
        />
        <SceneUpdater />
      </Canvas>

      {/* Controls */}
      <Controls
        keys={keysRef.current}
        shiftLabel="BOOST"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
    </div>
  );
}
