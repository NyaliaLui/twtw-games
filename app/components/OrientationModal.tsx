'use client';
import { useState, useEffect } from 'react';

export { OrientationModal };

function OrientationModal() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if it's a mobile device
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase(),
        );
      const isSmallScreen = window.innerWidth <= 768; // Tailwind's md breakpoint
      return isMobileDevice || isSmallScreen;
    };

    // Check orientation
    const checkOrientation = () => {
      const mobile = checkIfMobile();
      setIsMobile(mobile);

      if (!mobile) {
        setIsPortrait(false);
        return;
      }

      // Multiple ways to detect portrait orientation for better compatibility
      const portraitByMatchMedia = window.matchMedia(
        '(orientation: portrait)',
      ).matches;
      const portraitByDimensions = window.innerHeight > window.innerWidth;
      const portraitByOrientation =
        screen.orientation && screen.orientation.angle
          ? Math.abs(screen.orientation.angle) !== 90
          : true;

      // Use multiple indicators for better reliability
      const isPortraitMode =
        portraitByMatchMedia || portraitByDimensions || portraitByOrientation;
      setIsPortrait(isPortraitMode);
    };

    // Initial check
    checkOrientation();

    // Listen for orientation changes
    const mediaQuery = window.matchMedia('(orientation: portrait)');
    const handleOrientationChange = () => {
      // Add small delay to allow for proper dimension updates
      setTimeout(checkOrientation, 100);
    };

    // Add multiple event listeners for broader compatibility
    mediaQuery.addEventListener('change', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // Only show modal on mobile devices in portrait orientation
  if (!isMobile || !isPortrait) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full mx-4">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
            {/* Rotate phone icon */}
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Rotate Your Device
          </h3>

          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            For the best gaming experience, please rotate your device to
            landscape orientation.
          </p>

          {/* Visual representation of phone rotation */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            {/* Portrait phone */}
            <div className="relative">
              <div className="w-8 h-12 bg-gray-300 dark:bg-gray-600 rounded-md border-2 border-gray-400 dark:border-gray-500">
                <div className="w-4 h-8 bg-gray-400 dark:bg-gray-500 rounded-sm mx-auto mt-1"></div>
                <div className="w-2 h-0.5 bg-gray-400 dark:bg-gray-500 rounded-full mx-auto mt-1"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-2 h-2 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Arrow */}
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>

            {/* Landscape phone */}
            <div className="relative">
              <div className="w-12 h-8 bg-gray-300 dark:bg-gray-600 rounded-md border-2 border-gray-400 dark:border-gray-500">
                <div className="w-8 h-4 bg-gray-400 dark:bg-gray-500 rounded-sm mx-auto mt-1"></div>
                <div className="w-0.5 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mx-auto mt-0.5"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-2 h-2 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            This message will disappear automatically when you rotate your
            device.
          </p>
        </div>
      </div>
    </div>
  );
}
