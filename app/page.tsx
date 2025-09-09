import { HRTrimmed } from 'flowbite-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="py-4 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        About this project
      </h1>
      <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400 text-justify">
        In the summer of 2025, Brody Hall interned with Omni Circle Group and
        Nyalia&apos;s Software Solutions. His assignment was to develop a game
        with ThreeJS and a core requirement was to use AI and prompt
        engineering. This platform showcases two of his creations.
      </p>

      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
        <Link
          href="/snake"
          className="w-full sm:w-64 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Play Snake
        </Link>
        <Link
          href="/animation"
          className="w-full sm:w-64 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-center text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-900 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Animation Challenge
        </Link>
      </div>

      <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400 text-justify">
        The internship was through the Topeka Way to Work program and the City
        of Topeka. Show support for these efforts by following the City of
        Topeka on social media.
      </p>
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
        <Link
          href="https://www.facebook.com/cityoftopeka"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-64 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
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
          City of Topeka
        </Link>
        <Link
          href="https://www.instagram.com/cityoftopeka/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-64 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-center text-white bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] rounded-lg hover:bg-gradient-to-br focus:ring-4 focus:outline-none dark:focus:ring-pink-800"
        >
          <svg
            className="w-4 h-4 pr-0.5"
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
          City of Topeka
        </Link>
      </div>
      <HRTrimmed />
      <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400 text-center">
        Credits for 3rd party models and textures are in{' '}
        <Link
          href="https://github.com/NyaliaLui/twtw-games?tab=readme-ov-file#credits"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium"
        >
          this README
        </Link>
        .
      </p>
    </div>
  );
}
