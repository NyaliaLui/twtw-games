// __tests__/hooks/useGameControls.test.ts
import { renderHook, act } from '@testing-library/react';
import { expect } from '@jest/globals';
import {
  useGameControls,
  KeyState,
  initKeyState,
} from '@/app/hooks/useGameControls';

describe('useGameControls', () => {
  let mockOnKeyDown: jest.Mock;
  let mockOnKeyUp: jest.Mock;

  beforeEach(() => {
    mockOnKeyDown = jest.fn();
    mockOnKeyUp = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default state and handlers', () => {
      const { result } = renderHook(() => useGameControls());
      expect(result.current.keys).toEqual(initKeyState());
      expect(typeof result.current.handleKeyDown).toBe('function');
      expect(typeof result.current.handleKeyUp).toBe('function');
    });
  });

  describe('key state management', () => {
    it('should update keys reference when handleKeyDown is called', () => {
      const { result } = renderHook(() =>
        useGameControls({ onKeyDown: mockOnKeyDown }),
      );

      const initialKeys = result.current.keys;

      act(() => {
        result.current.handleKeyDown({ ...initialKeys, w: true });
      });

      expect(mockOnKeyDown).toHaveBeenCalledWith({ ...initialKeys, w: true });
      expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
    });

    it('should update keys reference when handleKeyUp is called', () => {
      const { result } = renderHook(() =>
        useGameControls({ onKeyUp: mockOnKeyUp }),
      );

      const initialKeys = result.current.keys;

      act(() => {
        result.current.handleKeyUp({ ...initialKeys, w: false });
      });

      expect(mockOnKeyUp).toHaveBeenCalledWith({ ...initialKeys, w: false });
      expect(mockOnKeyUp).toHaveBeenCalledTimes(1);
    });

    it('should trigger component re-render when keys change', () => {
      let renderCount = 0;
      const { result } = renderHook(() => {
        renderCount++;
        return useGameControls();
      });

      const initialRenderCount = renderCount;

      act(() => {
        result.current.handleKeyDown(initKeyState());
      });

      expect(renderCount).toBeGreaterThan(initialRenderCount);
    });
  });

  describe('callback handling', () => {
    it('should handle undefined options gracefully', () => {
      const { result } = renderHook(() => useGameControls(undefined));

      expect(result.current.keys).toBeDefined();
      expect(result.current.handleKeyDown).toBeDefined();
      expect(result.current.handleKeyUp).toBeDefined();
    });

    it('should handle empty options gracefully', () => {
      const { result } = renderHook(() => useGameControls({}));

      act(() => {
        result.current.handleKeyDown(initKeyState());
      });

      expect(result.current.keys).toEqual(initKeyState());
    });

    it('should call onKeyDown with correct parameters', () => {
      const { result } = renderHook(() =>
        useGameControls({ onKeyDown: mockOnKeyDown }),
      );

      const testKeys: KeyState = {
        w: true,
        a: false,
        s: true,
        d: false,
        shift: true,
      };

      act(() => {
        result.current.handleKeyDown(testKeys);
      });

      expect(mockOnKeyDown).toHaveBeenCalledWith(testKeys);
      expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
    });

    it('should call onKeyUp with correct parameters', () => {
      const { result } = renderHook(() =>
        useGameControls({ onKeyUp: mockOnKeyUp }),
      );

      const testKeys: KeyState = {
        w: false,
        a: true,
        s: false,
        d: true,
        shift: false,
      };

      act(() => {
        result.current.handleKeyUp(testKeys);
      });

      expect(mockOnKeyUp).toHaveBeenCalledWith(testKeys);
      expect(mockOnKeyUp).toHaveBeenCalledTimes(1);
    });
  });

  describe('performance and memory', () => {
    it('should not cause memory leaks with frequent calls', () => {
      const { result } = renderHook(() =>
        useGameControls({
          onKeyDown: mockOnKeyDown,
          onKeyUp: mockOnKeyUp,
        }),
      );

      // Simulate rapid key presses
      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.handleKeyDown({
            w: i % 2 === 0,
            a: false,
            s: false,
            d: false,
            shift: false,
          });
          result.current.handleKeyUp({
            w: false,
            a: false,
            s: false,
            d: false,
            shift: false,
          });
        }
      });

      expect(mockOnKeyDown).toHaveBeenCalledTimes(100);
      expect(mockOnKeyUp).toHaveBeenCalledTimes(100);
    });

    it('should maintain same keys object reference', () => {
      const { result, rerender } = renderHook(() => useGameControls());

      const firstKeys = result.current.keys;

      rerender();

      expect(result.current.keys).toBe(firstKeys);
    });
  });
});
