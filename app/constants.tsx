import { Vector3 } from "three";

export { rootConfig, snakeConfig, animationConfig };

const rootConfig = {
    strokeWidth: 2
};

const snakeConfig = {
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
    origin: new Vector3(0, 0, 0),
    initSpeed: 5,
    boostMultiplier: 3,
    maxStaminaBlocks: 4,
    staminaDepletionRate: 2500,
    initMaxScore: 50,
    incrementScore: 5,
    incrementFruitCollected: 1,
    incrementStaminaBlock: 1,
    incrementLevel: 1,
    incrementBaseSpeed: 3,
    fruitPerStaminaBlock: 5,
    incrementFruitCount: 1,
    levelsToIncrementFruit: 3,
    levelUpTimeout: 2000
};

const animationConfig = {
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
