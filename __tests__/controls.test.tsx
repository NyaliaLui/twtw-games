import React from 'react';
import { expect } from '@jest/globals';
import { render, fireEvent, screen } from '@testing-library/react';
import { Controls, KeyState } from '@/app/components/Controls';

// Mock the KeyState for testing
const createMockKeyState = (): KeyState => ({
  w: false,
  a: false,
  s: false,
  d: false,
  shift: false,
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
  });

  describe('D-Pad Buttons', () => {
    describe('W (Up) Button', () => {
      it('should call onKeyDown when mouse is pressed', () => {
        render(
          <Controls
            onKeyDown={mockOnKeyDown}
            onKeyUp={mockOnKeyUp}
            keys={mockKeys}
            shiftLabel="Test message"
          />,
        );

        const upButton = screen.getByLabelText('Move Up (W)');
        fireEvent.mouseDown(upButton);

        expect(mockKeys.w).toBe(true);
        expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);
      });

      it('should call onKeyUp when mouse is released', () => {
        mockKeys.w = true; // Simulate key is already pressed
        render(
          <Controls
            onKeyDown={mockOnKeyDown}
            onKeyUp={mockOnKeyUp}
            keys={mockKeys}
            shiftLabel="Test message"
          />,
        );

        const upButton = screen.getByLabelText('Move Up (W)');
        fireEvent.mouseUp(upButton);

        expect(mockKeys.w).toBe(false);
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

        const upButton = screen.getByLabelText('Move Up (W)');

        // Touch start
        fireEvent.touchStart(upButton);
        expect(mockKeys.w).toBe(true);
        expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);

        // Touch end
        mockKeys.w = true; // Reset for touch end test
        fireEvent.touchEnd(upButton);
        expect(mockKeys.w).toBe(false);
        expect(mockOnKeyUp).toHaveBeenCalledWith(mockKeys);
      });
    });

    describe('A (Left) Button', () => {
      it('should call onKeyDown when mouse is pressed', () => {
        render(
          <Controls
            onKeyDown={mockOnKeyDown}
            onKeyUp={mockOnKeyUp}
            keys={mockKeys}
            shiftLabel="Test message"
          />,
        );

        const leftButton = screen.getByLabelText('Move Left (A)');
        fireEvent.mouseDown(leftButton);

        expect(mockKeys.a).toBe(true);
        expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);
      });

      it('should call onKeyUp when mouse is released', () => {
        mockKeys.a = true;
        render(
          <Controls
            onKeyDown={mockOnKeyDown}
            onKeyUp={mockOnKeyUp}
            keys={mockKeys}
            shiftLabel="Test message"
          />,
        );

        const leftButton = screen.getByLabelText('Move Left (A)');
        fireEvent.mouseUp(leftButton);

        expect(mockKeys.a).toBe(false);
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

        const leftButton = screen.getByLabelText('Move Left (A)');

        fireEvent.touchStart(leftButton);
        expect(mockKeys.a).toBe(true);
        expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);
      });
    });

    describe('S (Down) Button', () => {
      it('should call onKeyDown when mouse is pressed', () => {
        render(
          <Controls
            onKeyDown={mockOnKeyDown}
            onKeyUp={mockOnKeyUp}
            keys={mockKeys}
            shiftLabel="Test message"
          />,
        );

        const downButton = screen.getByLabelText('Move Down (S)');
        fireEvent.mouseDown(downButton);

        expect(mockKeys.s).toBe(true);
        expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);
      });

      it('should call onKeyUp when mouse is released', () => {
        mockKeys.s = true;
        render(
          <Controls
            onKeyDown={mockOnKeyDown}
            onKeyUp={mockOnKeyUp}
            keys={mockKeys}
            shiftLabel="Test message"
          />,
        );

        const downButton = screen.getByLabelText('Move Down (S)');
        fireEvent.mouseUp(downButton);

        expect(mockKeys.s).toBe(false);
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

        const downButton = screen.getByLabelText('Move Down (S)');

        fireEvent.touchStart(downButton);
        expect(mockKeys.s).toBe(true);
        expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);
      });
    });

    describe('D (Right) Button', () => {
      it('should call onKeyDown when mouse is pressed', () => {
        render(
          <Controls
            onKeyDown={mockOnKeyDown}
            onKeyUp={mockOnKeyUp}
            keys={mockKeys}
            shiftLabel="Test message"
          />,
        );

        const rightButton = screen.getByLabelText('Move Right (D)');
        fireEvent.mouseDown(rightButton);

        expect(mockKeys.d).toBe(true);
        expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);
      });

      it('should call onKeyUp when mouse is released', () => {
        mockKeys.d = true;
        render(
          <Controls
            onKeyDown={mockOnKeyDown}
            onKeyUp={mockOnKeyUp}
            keys={mockKeys}
            shiftLabel="Test message"
          />,
        );

        const rightButton = screen.getByLabelText('Move Right (D)');
        fireEvent.mouseUp(rightButton);

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

        const rightButton = screen.getByLabelText('Move Right (D)');

        fireEvent.touchStart(rightButton);
        expect(mockKeys.d).toBe(true);
        expect(mockOnKeyDown).toHaveBeenCalledWith(mockKeys);
      });
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
  });

  describe('Button State Visual Feedback', () => {
    it('should apply active class when key is pressed', () => {
      mockKeys.w = true;
      mockKeys.shift = true;

      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="BOOST"
        />,
      );

      const upButton = screen.getByLabelText('Move Up (W)');
      const shiftButton = screen.getByLabelText('BOOST');

      // Check if active classes are applied (you might need to adjust based on your actual class names)
      expect(upButton.classList).toContain('bg-gray-500');
      expect(shiftButton.classList).toContain('bg-red-500');
    });

    it('should apply normal class when key is not pressed', () => {
      // All keys are false by default

      render(
        <Controls
          onKeyDown={mockOnKeyDown}
          onKeyUp={mockOnKeyUp}
          keys={mockKeys}
          shiftLabel="BOOST"
        />,
      );

      const upButton = screen.getByLabelText('Move Up (W)');
      const shiftButton = screen.getByLabelText('BOOST');

      expect(upButton.classList).toContain('bg-gray-700');
      expect(shiftButton.classList).toContain('bg-red-700');
    });
  });
});
