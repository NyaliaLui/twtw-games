'use client';
import { useEffect, useCallback, useState, useRef } from 'react';
import { KeyState, KeyHandlerFn } from '@/app/hooks/useGameControls';

export { AnalogStick, Controls };

interface ControlsProps {
  keys: KeyState;
  shiftLabel: string;
  onKeyDown: KeyHandlerFn;
  onKeyUp: KeyHandlerFn;
}

interface AnalogStickProps {
  onMove: (keys: KeyState) => void;
  keys: KeyState;
}

function AnalogStick({ onMove, keys }: AnalogStickProps) {
  const stickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });

  const stickRadius = 40; // Total stick area radius
  const knobRadius = 12; // Knob radius
  const deadZone = 0.1; // Dead zone threshold (0-1)

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!stickRef.current) return;

      const stickRect = stickRef.current.getBoundingClientRect();
      const stickCenterX = stickRect.left + stickRect.width / 2;
      const stickCenterY = stickRect.top + stickRect.height / 2;

      const deltaX = clientX - stickCenterX;
      const deltaY = clientY - stickCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Limit knob to stick boundary
      const maxDistance = stickRadius - knobRadius;
      const clampedDistance = Math.min(distance, maxDistance);

      let x = 0,
        y = 0;
      if (distance > 0) {
        x = (deltaX / distance) * clampedDistance;
        y = (deltaY / distance) * clampedDistance;
      }

      setKnobPosition({ x, y });

      // Convert to key states
      const normalizedX = x / maxDistance;
      const normalizedY = y / maxDistance;

      const newKeys = { ...keys };
      newKeys.w = normalizedY < -deadZone;
      newKeys.s = normalizedY > deadZone;
      newKeys.a = normalizedX < -deadZone;
      newKeys.d = normalizedX > deadZone;

      onMove(newKeys);
    },
    [keys, onMove, stickRadius, knobRadius, deadZone],
  );

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      setIsDragging(true);
      updatePosition(clientX, clientY);
    },
    [updatePosition],
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;
      updatePosition(clientX, clientY);
    },
    [isDragging, updatePosition],
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setKnobPosition({ x: 0, y: 0 });

    // Reset all movement keys
    const newKeys = { ...keys };
    newKeys.w = false;
    newKeys.a = false;
    newKeys.s = false;
    newKeys.d = false;
    onMove(newKeys);
  }, [keys, onMove]);

  // Mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleStart(e.clientX, e.clientY);
    },
    [handleStart],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    },
    [handleMove],
  );

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch events
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    },
    [handleStart],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    [handleMove],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      handleEnd();
    },
    [handleEnd],
  );

  // Event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  return (
    <div
      className="relative"
      aria-label="Move with the analog stick or WASD keys"
      data-testid="analog-stick"
    >
      {/* Stick Base */}
      <div
        ref={stickRef}
        className="relative w-20 h-20 bg-gray-700 bg-opacity-80 border-2 border-gray-500 rounded-full flex items-center justify-center cursor-pointer select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Stick Knob */}
        <div
          ref={knobRef}
          className="absolute w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded-full transition-all duration-75 shadow-lg"
          style={{
            transform: `translate(${knobPosition.x}px, ${knobPosition.y}px)`,
            backgroundColor: isDragging ? '#e5e7eb' : '#d1d5db',
          }}
        />

        {/* Center dot indicator */}
        {!isDragging && (
          <div className="absolute w-2 h-2 bg-gray-400 rounded-full opacity-50" />
        )}
      </div>
    </div>
  );
}

function Controls({ keys, shiftLabel, onKeyDown, onKeyUp }: ControlsProps) {
  const setKey = useCallback(
    (key: keyof KeyState) => {
      if (!keys[key]) {
        keys[key] = true;
        onKeyDown(keys);
      }
    },
    [keys, onKeyDown],
  );

  const unsetKey = useCallback(
    (key: keyof KeyState) => {
      if (keys[key]) {
        keys[key] = false;
        onKeyUp(keys);
      }
    },
    [keys, onKeyUp],
  );

  const handleAnalogMove = useCallback(
    (newKeys: KeyState) => {
      // Check for key changes and trigger appropriate handlers
      Object.keys(newKeys).forEach((keyName) => {
        const key = keyName as keyof KeyState;
        if (key !== 'shift') {
          // Don't affect shift key
          if (newKeys[key] && !keys[key]) {
            keys[key] = true;
            onKeyDown(keys);
          } else if (!newKeys[key] && keys[key]) {
            keys[key] = false;
            onKeyUp(keys);
          }
        }
      });
    },
    [keys, onKeyDown, onKeyUp],
  );

  const touchStart = useCallback(
    (e: React.TouchEvent, key: keyof KeyState) => {
      setKey(key);
    },
    [setKey],
  );

  const touchEnd = useCallback(
    (e: React.TouchEvent, key: keyof KeyState) => {
      unsetKey(key);
    },
    [unsetKey],
  );

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
    };
  }, [keys, setKey, unsetKey]);

  const shiftButtonClass =
    'w-20 h-18 bg-red-700 hover:bg-red-600 active:bg-red-500 border-2 border-red-500 rounded-lg flex flex-col items-center justify-center text-white text-lg select-none transition-colors duration-75 shadow-lg';
  const shiftActiveButtonClass =
    'w-20 h-18 bg-red-500 border-2 border-red-400 rounded-lg flex flex-col items-center justify-center text-white text-lg select-none shadow-lg';

  return (
    <>
      {/* Analog Stick */}
      <div className="fixed bottom-1/4 lg:bottom-1/3 left-25 lg:left-40 z-50">
        <AnalogStick onMove={handleAnalogMove} keys={keys} />
      </div>

      {/* Shift Button */}
      <div className="fixed bottom-1/4 lg:bottom-1/3 right-25 lg:right-40 z-50">
        <button
          className={keys.shift ? shiftActiveButtonClass : shiftButtonClass}
          onMouseDown={() => setKey('shift')}
          onMouseUp={() => unsetKey('shift')}
          onTouchStart={(e) => touchStart(e, 'shift')}
          onTouchEnd={(e) => touchEnd(e, 'shift')}
          data-testid="shift-btn"
          aria-label={`${shiftLabel}`}
        >
          <div className="flex flex-col items-center">
            <span>Hold to</span>
            <span>{shiftLabel}</span>
          </div>
        </button>
      </div>
    </>
  );
}
