import { Vector3 } from "three";
import { RootState } from "@react-three/fiber";

export { rootConfig, snakeConfig, animationConfig };

const rootConfig = {
    strokeWidth: 2
};

const snakeConfig = {
    renderer: {
        antialias: true,
        alpha: true
    },
    camera: {
        position: new Vector3(0, 1000, 0),
        fov: 75,
        near: 0.1,
        far: 2000,
    },
    onCreated: (state: RootState) => { state.camera.lookAt(0, 0, 0); },
    orbitControls: {
        enableRotate: false,
        enablePan: false,
        enableZoom: false
    },
    blockSize: 20,
    boundarySize: 1000,
    breakpoints: {
        // Use the same breakpoint philosophy as TailwindCSS which is based on the
        // Root Element (<html>) size. https://tailwindcss.com/docs/responsive-design
        SM: 40 // rem units
    },
    colors: {
        snakeHead: 0x00ff00,
        snakeBody: 0x00aa00,
        fruit: 0xff0000,
        bondary: 0xffffff
    },
    cubeDimSmallMultiplier: 0.75,
    origin: new Vector3(0, 0, 0),
    initSpeed: 5,
    initStaminaBlocks: 0,
    initFruitCount: 1,
    initScore: 0,
    initLevel: 1,
    initFruitCollectedCount: 0,
    initBodyParts: [],
    initIsBoosting: false,
    initStaminaTimer: null,
    initShowLevelUp: false,
    initFruits: [],
    initHead: null,
    boostMultiplier: 3,
    maxStaminaBlocks: 4,
    staminaDepletionRate: 2500,
    initMaxScore: 50,
    incrementScore: 5,
    incrementFruitCollected: 1,
    incrementStaminaBlock: 1,
    decrementStaminaBlock: 1,
    incrementLevel: 1,
    incrementBaseSpeed: 3,
    fruitPerStaminaBlock: 5,
    incrementFruitCount: 1,
    levelsToIncrementFruit: 3,
    levelUpTimeout: 2000,
    numPartsToGrow: 3
};

const animationConfig = {
    enableShadows: true,
    ambientLight: {
        intensity: 0.6
    },
    directionalLight: {
        position: new Vector3(3, 10, 5),
        intensity: 0.8
    },
    camera: {
        position: new Vector3(0, 2, 5),
        fov: 75
    },
    orbitControls: {
        enableRotate: false,
        target: new Vector3(0, 1, 0)
    },
    moveUnit: 1,
    groundDim: 100,
    groundRotation: -Math.PI / 2,
    scale: {
        world: {
            default: 1.5,
            sm: 1
        },
        soldier: {
            default: 0.5,
            sm: 1
        }
    },
    fadeDuration: 0.2,
    baseSpeed: 0.08,
    runMultiplier: (shift: boolean) => shift ? 2.5 : 1,
};
