'use client';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState, useEffect } from 'react';

import LogoImage from '@/public/TWTWLogo.png';
import { rootConfig } from '@/app/constants';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const hideHamburger = useCallback(
    () => document.getElementById('navbar-hamburger')?.classList.add('hidden'),
    [],
  );
  const pathname = usePathname();

  // Define pages where navigation/footer should be hidden
  const hideLayoutPages = ['/snake', '/animation'];
  const shouldHideLayout = hideLayoutPages.includes(pathname);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('game-dropdown');
      const button = document.getElementById('dropdown-button');
      if (
        dropdown &&
        button &&
        !dropdown.contains(event.target as Node) &&
        !button.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Auto-show help modal when navigating to game pages
  useEffect(() => {
    if (pathname === '/snake' || pathname === '/animation') {
      setIsHelpModalOpen(true);
    }
  }, [pathname]);

  // Get help content based on current page
  const getHelpContent = () => {
    switch (pathname) {
      case '/snake':
        return {
          title: 'How to play',
          content: (
            <div className="space-y-4">
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>
                  Eat red fruits to grow the snake and increase your score.
                </li>
                <li>
                  You level up when you reach the max score and higher levels =
                  faster base speed.
                </li>
                <li>Gain 1 stamina block for every 5 fruit you eat.</li>
                <li>The vertical bar shows the amount of stamina.</li>
                <li>
                  Use the <strong>WASD</strong> buttons to move.
                </li>
                <li>
                  Use the <strong>Shift</strong> or <strong>BOOST</strong>{' '}
                  button to speed up (consumes stamina).
                </li>
                <li>Avoid hitting the boundaries or the game will reset!</li>
              </ul>
            </div>
          ),
        };
      case '/animation':
        return {
          title: 'How to play',
          content: (
            <div className="space-y-4">
              <div>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                  <li>
                    This project was an exercise on 3D animation, GLTF files,
                    and creating worlds with textures.
                  </li>
                  <li>
                    Watch the soldier's animations change between idle, walk,
                    and run.
                  </li>
                  <li>
                    Use the <strong>WASD</strong> buttons to move.
                  </li>
                  <li>
                    Hold the <strong>Shift</strong> or <strong>RUN</strong>{' '}
                    button to speed up.
                  </li>
                </ul>
              </div>
            </div>
          ),
        };
      default:
        return {
          title: 'Help',
          content: (
            <p className="text-gray-700 dark:text-gray-300">
              No help available for this page.
            </p>
          ),
        };
    }
  };

  const helpContent = getHelpContent();

  if (shouldHideLayout) {
    return (
      <>
        {/* Dropdown Menu */}
        <div className="fixed top-2 lg:top-4 left-4 z-50">
          <button
            id="dropdown-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            aria-label="Game Menu"
            aria-expanded={isDropdownOpen}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={rootConfig.strokeWidth}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="text-xs sm:text-sm">Menu</span>
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Content */}
          {isDropdownOpen && (
            <div
              id="game-dropdown"
              className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg overflow-hidden"
            >
              <button
                onClick={() => {
                  setIsHelpModalOpen(true);
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">Help</span>
              </button>
              <Link
                href="/"
                className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                onClick={() => setIsDropdownOpen(false)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={rootConfig.strokeWidth}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="text-sm">Quit</span>
              </Link>
            </div>
          )}
        </div>

        {/* Help Modal */}
        {isHelpModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {helpContent.title}
                </h3>
                <button
                  onClick={() => setIsHelpModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close help"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6">{helpContent.content}</div>
              <div className="flex justify-center p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setIsHelpModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                  data-testid="close-help-modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {children}
      </>
    );
  }

  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Image
              src={LogoImage}
              className="h-8 w-25 sm:w-30"
              alt="TWTW Logo"
            />
            <span className="self-center text-lg md:text-2xl font-semibold whitespace-nowrap dark:text-white">
              Games & Animations
            </span>
          </Link>
          <button
            data-collapse-toggle="navbar-hamburger"
            type="button"
            className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-hamburger"
            aria-expanded="false"
            onClick={(e) => {
              const target = document.getElementById('navbar-hamburger');
              if (target) {
                target.classList.toggle('hidden');
                e.currentTarget.setAttribute(
                  'aria-expanded',
                  target.classList.contains('hidden') ? 'false' : 'true',
                );
              }
            }}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          {/* Mobile menu - positioned absolutely to overlay content */}
          <div
            className="hidden absolute top-full left-0 right-0 z-40 bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 shadow-lg"
            id="navbar-hamburger"
          >
            <ul className="flex flex-col font-medium p-4 space-y-2">
              <li>
                <Link
                  href="/snake"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                  onClick={hideHamburger}
                >
                  Snake
                </Link>
              </li>
              <li>
                <Link
                  href="/animation"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                  onClick={hideHamburger}
                >
                  Animation Challenge
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main content with proper spacing */}
      <main>{children}</main>

      {/* Footer - not sticky, positioned normally at bottom */}
      <footer className="w-full bg-gray-50 border-t border-gray-300 shadow-sm md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-600 sm:text-center dark:text-gray-400">
              © 2025{' '}
              <Link
                href="https://www.nyaliasoftware.solutions/"
                className="hover:underline"
              >
                Nyalia&apos;s Software Solutions
              </Link>
              . All Rights Reserved.
            </span>
            <div className="flex mt-4 sm:justify-center sm:mt-0">
              <Link
                href="https://www.facebook.com/cityoftopeka"
                className="text-gray-600 hover:text-gray-900 dark:hover:text-white"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 8 19"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://www.instagram.com/cityoftopeka/"
                className="text-gray-600 hover:text-gray-900 dark:hover:text-white ms-5"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://github.com/NyaliaLui/twtw-games"
                className="text-gray-600 hover:text-gray-900 dark:hover:text-white ms-5"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
