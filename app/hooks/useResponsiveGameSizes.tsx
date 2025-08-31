'use client';
import { useState, useEffect } from 'react';
import { breakpointSM, isWindowDefined } from '@/app/utils';
import { snakeConfig } from '@/app/constants';

export type { GameSizes };
export { useResponsiveGameSizes };

interface GameSizes {
  gameBoundarySize: number;
  gameHalfBoundarySize: number;
  cubeDim: number;
}

function calculateSizes(): GameSizes {
  const isLarge = isWindowDefined() && breakpointSM(window.innerWidth);
  const gameBoundarySize = isLarge
    ? snakeConfig.boundarySize
    : snakeConfig.boundarySize / 2;

  return {
    gameBoundarySize,
    gameHalfBoundarySize: gameBoundarySize / 2,
    cubeDim: isLarge
      ? snakeConfig.blockSize
      : snakeConfig.blockSize * snakeConfig.cubeDimSmallMultiplier,
  };
}

function useResponsiveGameSizes(): GameSizes {
  const [sizes, setSizes] = useState<GameSizes>(calculateSizes);

  useEffect(() => {
    const handleResize = () => setSizes(calculateSizes());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return sizes;
}
