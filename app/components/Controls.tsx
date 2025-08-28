"use client";
import { useEffect, useCallback } from "react";

export type { KeyState, KeyHandlerFn };
export { Controls };

interface KeyState {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  shift: boolean;
};

type KeyHandlerFn = (keys: KeyState) => void;

interface ControlsProps {
  keys: KeyState;
  shiftLabel: string;
  onKeyDown: KeyHandlerFn;
  onKeyUp: KeyHandlerFn;
};

function Controls({ keys, shiftLabel, onKeyDown, onKeyUp }: ControlsProps ) {
  const setKey = useCallback((key: keyof KeyState) => {
    if (!keys[key]) {
      keys[key] = true;
      onKeyDown(keys);
    }
  }, [keys, onKeyDown]);

  const unsetKey = useCallback((key: keyof KeyState) => {
    if (keys[key]) {
      keys[key] = false;
      onKeyUp(keys);
    }
  }, [keys, onKeyUp]);

  const touchStart = useCallback((e: React.TouchEvent, key: keyof KeyState) => {
    // e.preventDefault();
    setKey(key);
  }, [setKey]);

  const touchEnd = useCallback((e: React.TouchEvent, key: keyof KeyState) => {
    // e.preventDefault();
    unsetKey(key);
  }, [unsetKey]);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => { 
      setKey(e.key.toLowerCase() as keyof KeyState);
    };

    const onUp = (e: KeyboardEvent) => {
      unsetKey(e.key.toLowerCase() as keyof KeyState);
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    }
  }, [keys, setKey, unsetKey]);

  const dpadButtonClass = "w-12 h-12 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 border border-gray-500 rounded flex items-center justify-center text-white font-bold text-lg select-none transition-colors duration-75";
  const dpadActiveButtonClass = "w-12 h-12 bg-gray-500 border border-gray-400 rounded flex items-center justify-center text-white font-bold text-lg select-none";
  
  const shiftButtonClass = "w-20 h-20 bg-red-700 hover:bg-red-600 active:bg-red-500 border-2 border-red-500 rounded-lg flex flex-col items-center justify-center text-white font-bold text-sm select-none transition-colors duration-75 shadow-lg";
  const shiftActiveButtonClass = "w-20 h-20 bg-red-500 border-2 border-red-400 rounded-lg flex flex-col items-center justify-center text-white font-bold text-sm select-none shadow-lg";

  const toggleDPadClass = (k: boolean) => {
    if (k) {
      return dpadActiveButtonClass
    }
    
    return dpadButtonClass
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50">
        <div className="grid grid-cols-3 gap-1 w-40 h-40">
          {/* Empty space */}
          <div></div>
          
          {/* Up button (W) */}
          <button
            className={toggleDPadClass(keys.w)}
            onMouseDown={() => setKey('w')}
            onMouseUp={() => unsetKey('w')}
            onTouchStart={(e) => touchStart(e, 'w')}
            onTouchEnd={(e) => touchEnd(e, 'w')}
            aria-label="Move Up (W)"
          >
            ↑ w
          </button>
          
          {/* Empty space */}
          <div></div>
          
          {/* Left button (A) */}
          <button
            className={toggleDPadClass(keys.a)}
            onMouseDown={() => setKey('a')}
            onMouseUp={() => unsetKey('a')}
            onTouchStart={(e) => touchStart(e, 'a')}
            onTouchEnd={(e) => touchEnd(e, 'a')}
            aria-label="Move Left (A)"
          >
            ← a
          </button>
          
          {/* Center (could be used for other actions) */}
          <div className="w-12 h-12 bg-gray-800 border border-gray-600 rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
          
          {/* Right button (D) */}
          <button
            className={toggleDPadClass(keys.d)}
            onMouseDown={() => setKey('d')}
            onMouseUp={() => unsetKey('d')}
            onTouchStart={(e) => touchStart(e, 'd')}
            onTouchEnd={(e) => touchEnd(e, 'd')}
            aria-label="Move Right (D)"
          >
            → d
          </button>
          
          {/* Empty space */}
          <div></div>
          
          {/* Down button (S) */}
          <button
            className={toggleDPadClass(keys.s)}
            onMouseDown={() => setKey('s')}
            onMouseUp={() => unsetKey('s')}
            onTouchStart={(e) => touchStart(e, 's')}
            onTouchEnd={(e) => touchEnd(e, 's')}
            aria-label="Move Down (S)"
          >
            ↓ s
          </button>
          
          {/* Empty space */}
          <div></div>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          className={keys.shift ? shiftActiveButtonClass : shiftButtonClass}
          onMouseDown={() => setKey('shift')}
          onMouseUp={() => unsetKey('shift')}
          onTouchStart={(e) => touchStart(e, 'shift')}
          onTouchEnd={(e) => touchEnd(e, 'shift')}
          aria-label={`${shiftLabel}`}
        >
          <div className="text-xs leading-tight">
            {shiftLabel}
          </div>
        </button>
      </div>
    </>
  );
}
