'use client';
import { useRef, useCallback, useReducer } from 'react';

export type { KeyState, KeyHandlerFn };
export { useGameControls, initKeyState };

interface KeyState {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  shift: boolean;
}

type KeyHandlerFn = (keys: KeyState) => void;

function initKeyState(): KeyState {
  return { w: false, a: false, s: false, d: false, shift: false };
}

interface UseGameControlsProps {
  onKeyDown?: KeyHandlerFn;
  onKeyUp?: KeyHandlerFn;
}

function useGameControls({ onKeyDown, onKeyUp }: UseGameControlsProps = {}) {
  const keysRef = useRef<KeyState>(initKeyState());
  // Add state to force re-renders and address CSS Class change problem in https://github.com/NyaliaLui/twtw-games/issues/9.
  // Forcing a re-render this way seems like a waste of memory. This is tracked at https://github.com/NyaliaLui/twtw-games/issues/26.
  const [, forceUpdate] = useReducer((dummy) => !dummy, true);

  const handleKeyDown = useCallback(
    (keys: KeyState) => {
      onKeyDown?.(keys);
      forceUpdate();
    },
    [onKeyDown],
  );

  const handleKeyUp = useCallback(
    (keys: KeyState) => {
      onKeyUp?.(keys);
      forceUpdate();
    },
    [onKeyUp],
  );

  return {
    keys: keysRef.current,
    handleKeyDown,
    handleKeyUp,
  };
}
