"use client";
import { useEffect} from "react";

export type { KeyState, KeyHandlerFn };
export { KeyboardHandler };

interface KeyState {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  shift: boolean;
};

type KeyHandlerFn = (keys: KeyState) => void;

function KeyboardHandler({ onKeyDown, onKeyUp, keys, msg }: { onKeyDown: KeyHandlerFn, onKeyUp: KeyHandlerFn, keys: KeyState, msg: string }) {
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => { 
      keys[e.key.toLowerCase() as keyof KeyState] = true;
      onKeyDown(keys);
    };

    const onUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase() as keyof KeyState] = false;
      onKeyUp(keys);
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    }
  }, [onKeyDown, onKeyUp, keys]);

  return (
    <div className="keyboard-controls bg-black/40 p-2 rounded">
        { msg }
    </div>
  );
}
