import React from 'react';
import { expect } from '@jest/globals';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { KeyState } from '@/app/hooks/useGameControls';
import { Controls } from '@/app/components/Controls';

// Mock the KeyState for testing
const createMockKeyState = (): KeyState => ({
  w: false,
  a: false,
  s: false,
  d: false,
  shift: false,
});

// Mock getBoundingClientRect for analog stick testing
const mockGetBoundingClientRect = (
  x: number,
  y: number,
  width: number = 80,
  height: number = 80,
) => ({
  left: x,
  top: y,
  right: x + width,
  bottom: y + height,
  width,
  height,
  x,
  y,
  toJSON: () => {},
});

describe('Controls Component', () => {
  let mockOnKeyDown: jest.Mock;
  let mockOnKeyUp: jest.Mock;
  let mockKeys: KeyState;

  beforeEach(() => {
    mockOnKeyDown = jest.fn();
    mockOnKeyUp = jest.fn();
    mockKeys = createMockKeyState();

    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock getBoundingClientRect for analog stick
    Element.prototype.getBoundingClientRect = jest.fn(() =>
      mockGetBoundingClientRect(100, 100),
    );
  });

  describe('Analog Stick', () => {
    it('should render analog stick', () => {
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      // Look for the analog stick container
      const analogStick = document.querySelector('.w-20.h-20.bg-gray-700');
      expect(analogStick).toBeInTheDocument();
    });

    it('should activate W key when dragging upward', () => {
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      const analogStick = document.querySelector(
        '.w-20.h-20.bg-gray-700',
      ) as HTMLElement;
      expect(analogStick).toBeInTheDocument();

      // Mock getBoundingClientRect to return specific position
      analogStick.getBoundingClientRect = jest.fn(() =>
        mockGetBoundingClientRect(100, 100),
      );

      // Simulate mouse down at center (140, 140) and drag up to (140, 120)
      fireEvent.mouseDown(analogStick, { clientX: 140, clientY: 140 });

      // Simulate dragging upward (negative Y direction)
      fireEvent.mouseMove(analogStick, {
        clientX: 140,
        clientY: 120, // 20px up from center
      });

      expect(mockKeys.w).toBe(true);
      expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);
    });

    it('should activate S key when dragging downward', () => {
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      const analogStick = document.querySelector(
        '.w-20.h-20.bg-gray-700',
      ) as HTMLElement;
      analogStick.getBoundingClientRect = jest.fn(() =>
        mockGetBoundingClientRect(100, 100),
      );

      fireEvent.mouseDown(analogStick, { clientX: 140, clientY: 140 });

      // Simulate dragging downward (positive Y direction)
      fireEvent.mouseMove(analogStick, {
        clientX: 140,
        clientY: 160, // 20px down from center
      });

      expect(mockKeys.s).toBe(true);
      expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);
    });

    it('should activate A key when dragging leftward', () => {
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      const analogStick = document.querySelector(
        '.w-20.h-20.bg-gray-700',
      ) as HTMLElement;
      analogStick.getBoundingClientRect = jest.fn(() =>
        mockGetBoundingClientRect(100, 100),
      );

      fireEvent.mouseDown(analogStick, { clientX: 140, clientY: 140 });

      // Simulate dragging leftward (negative X direction)
      fireEvent.mouseMove(analogStick, {
        clientX: 120, // 20px left from center
        clientY: 140,
      });

      expect(mockKeys.a).toBe(true);
      expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);
    });

    it('should activate D key when dragging rightward', () => {
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      const analogStick = document.querySelector(
        '.w-20.h-20.bg-gray-700',
      ) as HTMLElement;
      analogStick.getBoundingClientRect = jest.fn(() =>
        mockGetBoundingClientRect(100, 100),
      );

      fireEvent.mouseDown(analogStick, { clientX: 140, clientY: 140 });

      // Simulate dragging rightward (positive X direction)
      fireEvent.mouseMove(analogStick, {
        clientX: 160, // 20px right from center
        clientY: 140,
      });

      expect(mockKeys.d).toBe(true);
      expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);
    });

    it('should reset all movement keys when mouse is released', () => {
      // Set some keys as active first
      mockKeys.w = true;
      mockKeys.d = true;

      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      const analogStick = document.querySelector(
        '.w-20.h-20.bg-gray-700',
      ) as HTMLElement;
      analogStick.getBoundingClientRect = jest.fn(() =>
        mockGetBoundingClientRect(100, 100),
      );

      fireEvent.mouseDown(analogStick, { clientX: 140, clientY: 140 });
      fireEvent.mouseUp(analogStick);

      expect(mockKeys.w).toBe(false);
      expect(mockKeys.a).toBe(false);
      expect(mockKeys.s).toBe(false);
      expect(mockKeys.d).toBe(false);
      expect(mockOnKeyUp).toHaveBeenCalledWith(mockKeys);
    });

    it('should handle touch events', () => {
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      const analogStick = document.querySelector(
        '.w-20.h-20.bg-gray-700',
      ) as HTMLElement;
      analogStick.getBoundingClientRect = jest.fn(() =>
        mockGetBoundingClientRect(100, 100),
      );

      // Simulate touch start
      fireEvent.touchStart(analogStick, {
        touches: [{ clientX: 140, clientY: 140 }],
      });

      // Simulate touch move upward
      fireEvent.touchMove(analogStick, {
        touches: [{ clientX: 140, clientY: 120 }] as any,
      });

      expect(mockKeys.w).toBe(true);
      expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);

      // Simulate touch end
      fireEvent.touchEnd(analogStick, {
        touches: [] as any,
      });

      expect(mockKeys.w).toBe(false);
      expect(mockOnKeyUp).toHaveBeenCalledWith(mockKeys);
    });

    it('should respect dead zone - small movements should not trigger keys', () => {
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      const analogStick = document.querySelector(
        '.w-20.h-20.bg-gray-700',
      ) as HTMLElement;
      analogStick.getBoundingClientRect = jest.fn(() =>
        mockGetBoundingClientRect(100, 100),
      );

      fireEvent.mouseDown(analogStick, { clientX: 140, clientY: 140 });

      // Simulate very small movement (within dead zone)
      fireEvent.mouseMove(analogStick, {
        clientX: 142, // Only 2px from center
        clientY: 142,
      });

      // No keys should be activated due to dead zone
      expect(mockKeys.w).toBe(false);
      expect(mockKeys.a).toBe(false);
      expect(mockKeys.s).toBe(false);
      expect(mockKeys.d).toBe(false);
      expect(mockOnKeyDown).not.toHaveBeenCalled();
    });

    it('should handle diagonal movement correctly', () => {
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      const analogStick = document.querySelector(
        '.w-20.h-20.bg-gray-700',
      ) as HTMLElement;
      analogStick.getBoundingClientRect = jest.fn(() =>
        mockGetBoundingClientRect(100, 100),
      );

      fireEvent.mouseDown(analogStick, { clientX: 140, clientY: 140 });

      // Simulate diagonal movement (up-right)
      fireEvent.mouseMove(analogStick, {
        clientX: 160, // Right
        clientY: 120, // Up
      });

      // Both W and D should be active for diagonal movement
      expect(mockKeys.w).toBe(true);
      expect(mockKeys.d).toBe(true);
      expect(mockKeys.a).toBe(false);
      expect(mockKeys.s).toBe(false);
      expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);
    });
  });

  describe('Shift Button', () => {
    it('should call onKeyDown when mouse is pressed', () => {
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="BOOST"
        />,
      );

      const shiftButton = screen.getByLabelText('BOOST');
      fireEvent.mouseDown(shiftButton);

      expect(mockKeys.shift).toBe(true);
      expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);
    });

    it('should call onKeyUp when mouse is released', () => {
      mockKeys.shift = true;
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="BOOST"
        />,
      );

      const shiftButton = screen.getByLabelText('BOOST');
      fireEvent.mouseUp(shiftButton);

      expect(mockKeys.shift).toBe(false);
      expect(mockOnKeyUp).toHaveBeenCalledWith(mockKeys);
    });

    it('should handle touch events', () => {
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="RUN"
        />,
      );

      const shiftButton = screen.getByLabelText('RUN');

      // Touch start
      fireEvent.touchStart(shiftButton);
      expect(mockKeys.shift).toBe(true);
      expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);

      // Touch end
      mockKeys.shift = true; // Reset for touch end test
      fireEvent.touchEnd(shiftButton);
      expect(mockKeys.shift).toBe(false);
      expect(mockOnKeyUp).toHaveBeenCalledWith(mockKeys);
    });

    it('should apply inactive CSS class', () => {
      // Test inactive state
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="BOOST"
        />,
      );

      let shiftButton = screen.getByLabelText('BOOST');
      expect(shiftButton.classList).toContain('bg-red-700');
    });

    it('should apply active CSS class', () => {
      // Test active state
      mockKeys.shift = true;
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="BOOST"
        />,
      );

      let shiftButton = screen.getByLabelText('BOOST');
      expect(shiftButton.classList).toContain('bg-red-500');
    });
  });

  describe('Keyboard Events', () => {
    beforeEach(() => {
      // Add event listener spies
      jest.spyOn(window, 'addEventListener');
      jest.spyOn(window, 'removeEventListener');
    });

    it('should handle keyboard keydown events', () => {
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      // Simulate 'w' key press
      fireEvent.keyDown(window, { key: 'w' });
      expect(mockKeys.w).toBe(true);
      expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);

      // Simulate 'shift' key press
      fireEvent.keyDown(window, { key: 'Shift' });
      expect(mockKeys.shift).toBe(true);
      expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);
    });

    it('should handle keyboard keyup events', () => {
      mockKeys.w = true;
      mockKeys.shift = true;

      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      // Simulate 'w' key release
      fireEvent.keyUp(window, { key: 'w' });
      expect(mockKeys.w).toBe(false);
      expect(mockOnKeyUp).toHaveBeenCalledWith(mockKeys);

      // Simulate 'shift' key release
      fireEvent.keyUp(window, { key: 'Shift' });
      expect(mockKeys.shift).toBe(false);
      expect(mockOnKeyUp).toHaveBeenCalledWith(mockKeys);
    });

    it('should ignore duplicate keydown events', () => {
      mockKeys.w = true; // Already pressed

      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      // Try to press 'w' again
      fireEvent.keyDown(window, { key: 'w' });
      expect(mockOnKeyDown).not.toHaveBeenCalled();
    });

    it('should ignore duplicate keyup events', () => {
      // mockKeys.w is already false by default

      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      // Try to release 'w' when it's not pressed
      fireEvent.keyUp(window, { key: 'w' });
      expect(mockOnKeyUp).not.toHaveBeenCalled();
    });

    it('should clean up event listeners on unmount', () => {
      const { unmount } = render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
      );
      expect(window.removeEventListener).toHaveBeenCalledWith(
        'keyup',
        expect.any(Function),
      );
    });

    it('should handle case-insensitive keyboard input', () => {
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      // Test uppercase key input
      fireEvent.keyDown(window, { key: 'W' });
      expect(mockKeys.w).toBe(true);
      expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);

      // Reset for uppercase release test
      mockKeys.w = true;
      fireEvent.keyUp(window, { key: 'W' });
      expect(mockKeys.w).toBe(false);
      expect(mockOnKeyUp).toHaveBeenCalledWith(mockKeys);
    });
  });

  describe('Integration Tests', () => {
    it('should not interfere with shift key when using analog stick', () => {
      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="Test message"
        />,
      );

      // Activate shift key
      fireEvent.keyDown(window, { key: 'shift' });
      expect(mockKeys.shift).toBe(true);

      // Use analog stick
      const analogStick = document.querySelector(
        '.w-20.h-20.bg-gray-700',
      ) as HTMLElement;
      analogStick.getBoundingClientRect = jest.fn(() =>
        mockGetBoundingClientRect(100, 100),
      );

      fireEvent.mouseDown(analogStick, { clientX: 140, clientY: 140 });
      fireEvent.mouseMove(analogStick, {
        clientX: 140,
        clientY: 120, // Up movement
      });

      // Shift should remain active while movement keys are also active
      expect(mockKeys.shift).toBe(true);
      expect(mockKeys.w).toBe(true);
    });
  });
});
