// __tests__/hooks/useResponsiveGameSizes.test.ts
import { renderHook } from '@testing-library/react';
import { expect } from '@jest/globals';
import {
  GameSizes,
  useResponsiveGameSizes,
} from '@/app/hooks/useResponsiveGameSizes';
import { snakeConfig } from '@/app/constants';

function largeScreenSize(): GameSizes {
  return {
    gameBoundarySize: snakeConfig.boundarySize,
    gameHalfBoundarySize: snakeConfig.boundarySize / 2,
    cubeDim: snakeConfig.blockSize,
  };
}

function smallScreenSize(): GameSizes {
  return {
    gameBoundarySize: snakeConfig.boundarySize / 2,
    gameHalfBoundarySize: snakeConfig.boundarySize / 4,
    cubeDim: snakeConfig.blockSize * snakeConfig.cubeDimSmallMultiplier,
  };
}

function setWindowWidth(width: number) {
  // Mock window.innerWidth
  Object.defineProperty(window, 'innerWidth', {
    value: width,
    writable: true,
  });
}

const largeWidth = 1024;
const smallWidth = 320;
const numUnmounts = 3;

describe('useResponsiveGameSizes', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock getComputedStyle
    Object.defineProperty(window, 'getComputedStyle', {
      value: jest.fn(() => ({
        fontSize: '16px',
      })),
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up event listeners
    window.removeEventListener = jest.fn();
  });

  describe('initial render', () => {
    it('should return large screen sizes when the window is defined and SM breakpoint is reached', () => {
      setWindowWidth(largeWidth);

      const { result } = renderHook(() => useResponsiveGameSizes());

      expect(result.current).toEqual(largeScreenSize());
    });

    it('should return small screen sizes when the window is defined and SM breakpoint is not yet reached', () => {
      setWindowWidth(smallWidth);

      const { result } = renderHook(() => useResponsiveGameSizes());

      expect(result.current).toEqual(smallScreenSize());
    });
  });

  describe('edge cases', () => {
    let removeEventListenerSpy: jest.SpyInstance;

    beforeEach(() => {
      removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    });

    it('should return small screen sizes when the window is undefined', () => {
      // Do *not* call setWindowWidth so window is undefined.

      const { result } = renderHook(() => useResponsiveGameSizes());

      expect(result.current).toEqual(smallScreenSize());
    });

    it('should not cause memory leaks with multiple unmounts', () => {
      setWindowWidth(largeWidth);

      const unmounts = new Array(numUnmounts).fill(0).map(() => {
        const { unmount: unmount1 } = renderHook(() =>
          useResponsiveGameSizes(),
        );
        return unmount1;
      });

      unmounts.forEach((um) => {
        um();
      });

      expect(removeEventListenerSpy).toHaveBeenCalledTimes(numUnmounts);
    });
  });
});
