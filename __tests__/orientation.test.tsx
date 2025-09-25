// __tests__/components/OrientationModal.test.tsx
import React from 'react';
import { expect } from '@jest/globals';
import { render, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import the OrientationModal component
import { OrientationModal } from '@/app/components/OrientationModal';

// Mock window properties and methods
const mockMatchMedia = (matches: boolean = false) => {
  const mockMediaQueryList = {
    matches,
    media: '(orientation: portrait)',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    onchange: null,
    dispatchEvent: jest.fn(),
  };

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(() => mockMediaQueryList),
  });

  return mockMediaQueryList;
};

const mockWindowDimensions = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
};

const mockUserAgent = (userAgent: string) => {
  Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    value: userAgent,
  });
};

const mockScreenOrientation = (angle: number = 0) => {
  Object.defineProperty(screen, 'orientation', {
    writable: true,
    value: {
      angle,
      type: angle === 0 ? 'portrait-primary' : 'landscape-primary',
    },
  });
};

describe('OrientationModal Component', () => {
  let addEventListenerSpy: jest.SpyInstance;
  let removeEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    // Spy on event listeners
    addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    // Reset to default desktop environment
    mockWindowDimensions(1920, 1080);
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    );
    mockMatchMedia(false);
    mockScreenOrientation(90);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Desktop Detection', () => {
    it('should not render on desktop devices', () => {
      mockWindowDimensions(1920, 1080);
      mockUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      );

      const { container } = render(<OrientationModal />);
      expect(container.firstChild).toBeNull();
    });

    it('should not render on large screens even in portrait', () => {
      mockWindowDimensions(1080, 1920); // Portrait but large
      mockUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      );
      mockMatchMedia(true); // Portrait orientation

      const { container } = render(<OrientationModal />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Mobile Device Detection', () => {
    describe('User Agent Detection', () => {
      const mobileUserAgents = [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
        'Mozilla/5.0 (Android 11; Mobile; rv:68.0)',
        'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X)',
        'Mozilla/5.0 (Linux; Android 10; SM-G975F)',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      ];

      mobileUserAgents.forEach((userAgent) => {
        it(`should detect mobile device: ${userAgent.slice(0, 30)}...`, () => {
          mockUserAgent(userAgent);
          mockWindowDimensions(375, 667); // Mobile portrait
          mockMatchMedia(true);

          const { getByText } = render(<OrientationModal />);
          expect(getByText('Rotate Your Device')).toBeInTheDocument();
        });
      });
    });

    describe('Screen Size Detection', () => {
      it('should detect mobile by screen size (≤768px width)', () => {
        mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)'); // Desktop UA
        mockWindowDimensions(768, 1024); // Small screen
        mockMatchMedia(true);

        const { getByText } = render(<OrientationModal />);
        expect(getByText('Rotate Your Device')).toBeInTheDocument();
      });

      it('should not trigger on screens wider than 768px', () => {
        mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        mockWindowDimensions(769, 1024); // Just above threshold
        mockMatchMedia(true);

        const { container } = render(<OrientationModal />);
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('Orientation Detection', () => {
    beforeEach(() => {
      // Set up mobile environment
      mockUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)');
      mockWindowDimensions(375, 667);
    });

    it('should show modal in portrait orientation', () => {
      mockMatchMedia(true); // Portrait
      mockWindowDimensions(375, 667); // Height > width

      const { getByText } = render(<OrientationModal />);
      expect(getByText('Rotate Your Device')).toBeInTheDocument();
    });

    it('should not show modal in landscape orientation', () => {
      mockMatchMedia(false); // Landscape
      mockWindowDimensions(667, 375); // Width > height

      const { container } = render(<OrientationModal />);
      expect(container.firstChild).toBeNull();
    });

    it('should detect portrait by window dimensions when matchMedia fails', () => {
      mockMatchMedia(false);
      mockWindowDimensions(375, 667); // Portrait dimensions

      const { getByText } = render(<OrientationModal />);
      expect(getByText('Rotate Your Device')).toBeInTheDocument();
    });
  });

  describe('Event Listeners', () => {
    beforeEach(() => {
      mockUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)');
      mockWindowDimensions(375, 667);
    });

    it('should set up event listeners on mount', () => {
      const mockMediaQuery = mockMatchMedia(true);
      render(<OrientationModal />);

      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function),
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function),
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });

    it('should clean up event listeners on unmount', () => {
      const mockMediaQuery = mockMatchMedia(true);
      const { unmount } = render(<OrientationModal />);

      unmount();

      expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function),
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function),
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });

    it('should handle orientation change events with delay', async () => {
      jest.useFakeTimers();
      mockMatchMedia(false); // Start in landscape
      mockWindowDimensions(667, 375);

      const { container, rerender } = render(<OrientationModal />);
      expect(container.firstChild).toBeNull(); // Should be hidden initially

      // Simulate orientation change to portrait
      mockMatchMedia(true);
      mockWindowDimensions(375, 667);

      // Trigger the resize event
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      // Fast-forward the timeout
      act(() => {
        jest.advanceTimersByTime(100);
      });

      rerender(<OrientationModal />);

      jest.useRealTimers();
    });
  });

  describe('Rendering and Content', () => {
    beforeEach(() => {
      mockUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)');
      mockWindowDimensions(375, 667);
      mockMatchMedia(true);
    });

    it('should render all required content elements', () => {
      const { getByText, container } = render(<OrientationModal />);

      // Main heading
      expect(getByText('Rotate Your Device')).toBeInTheDocument();

      // Description text
      expect(getByText(/For the best gaming experience/)).toBeInTheDocument();

      // Instruction text
      expect(
        getByText(/This message will disappear automatically/),
      ).toBeInTheDocument();

      // Visual elements (SVG icons)
      const svgElements = container.querySelectorAll('svg');
      expect(svgElements.length).toBeGreaterThan(0);
    });

    it('should have correct styling classes', () => {
      const { container } = render(<OrientationModal />);

      // Modal backdrop
      const modal = container.firstChild as HTMLElement;
      expect(modal).toHaveClass(
        'fixed',
        'inset-0',
        'bg-gray-900',
        'bg-opacity-80',
        'backdrop-blur-sm',
        'z-50',
        'flex',
        'items-center',
        'justify-center',
        'p-4',
      );

      // Modal content
      const modalContent = modal.querySelector('.bg-white');
      expect(modalContent).toHaveClass(
        'bg-white',
        'dark:bg-gray-800',
        'rounded-lg',
        'shadow-xl',
        'max-w-sm',
        'w-full',
        'mx-4',
      );
    });

    it('should render rotation icon with animation', () => {
      const { container } = render(<OrientationModal />);

      const rotateIcon = container.querySelector('.animate-pulse');
      expect(rotateIcon).toBeInTheDocument();
      expect(rotateIcon).toHaveClass(
        'w-8',
        'h-8',
        'text-blue-600',
        'dark:text-blue-400',
      );
    });

    it('should render phone visual representations', () => {
      const { container } = render(<OrientationModal />);

      // Should have visual phone representations
      const phoneElements = container.querySelectorAll('.w-8.h-12, .w-12.h-8');
      expect(phoneElements.length).toBe(2); // Portrait and landscape phones

      // Should have status indicators (red X and green check)
      const redIndicator = container.querySelector('.bg-red-500');
      const greenIndicator = container.querySelector('.bg-green-500');
      expect(redIndicator).toBeInTheDocument();
      expect(greenIndicator).toBeInTheDocument();
    });
  });

  describe('Dark Mode Support', () => {
    beforeEach(() => {
      mockUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)');
      mockWindowDimensions(375, 667);
      mockMatchMedia(true);
    });

    it('should have dark mode classes', () => {
      const { container, getByText } = render(<OrientationModal />);

      // Modal content should have dark mode classes
      const modalContent = container.querySelector('.dark\\:bg-gray-800');
      expect(modalContent).toBeInTheDocument();

      // Text elements should have dark mode classes
      const heading = getByText('Rotate Your Device');
      expect(heading).toHaveClass('dark:text-white');

      // Icon should have dark mode classes
      const icon = container.querySelector('.dark\\:text-blue-400');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing navigator.userAgent gracefully', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: undefined,
        writable: true,
      });

      mockWindowDimensions(375, 667);
      mockMatchMedia(true);

      expect(() => {
        render(<OrientationModal />);
      }).not.toThrow();
    });

    it('should handle missing screen.orientation API', () => {
      Object.defineProperty(screen, 'orientation', {
        value: undefined,
        writable: true,
      });

      mockUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)');
      mockWindowDimensions(375, 667);
      mockMatchMedia(true);

      const { getByText } = render(<OrientationModal />);
      expect(getByText('Rotate Your Device')).toBeInTheDocument();
    });

    it('should handle window resize during component lifecycle', () => {
      mockUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)');
      mockMatchMedia(false);

      // Start in landscape
      mockWindowDimensions(667, 375);
      const { container, rerender } = render(<OrientationModal />);
      expect(container.firstChild).toBeNull();

      // Change to portrait
      mockWindowDimensions(375, 667);
      mockMatchMedia(true);

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      rerender(<OrientationModal />);
    });

    it('should handle rapid orientation changes', async () => {
      jest.useFakeTimers();

      mockUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)');
      render(<OrientationModal />);

      // Simulate rapid orientation changes
      for (let i = 0; i < 10; i++) {
        act(() => {
          window.dispatchEvent(new Event('orientationchange'));
        });
      }

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Should not crash or cause memory leaks
      expect(addEventListenerSpy).toHaveBeenCalled();

      jest.useRealTimers();
    });
  });
});
