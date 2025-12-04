// src/components/LazyFallback.tsx
import React from "react";

const LazyFallbackElement: React.FC = () => {
  return (
    // Main Container: Takes full screen height and centers content
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      {/* Loader Container */}
      <div className="flex flex-col items-center space-y-4">
        {/* Bouncing Dots Animation */}
        <div className="flex space-x-3 rtl:space-x-reverse">
          {/* First Dot */}
          <div
            className="w-4 h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>

          {/* Second Dot */}
          <div
            className="w-4 h-4 bg-indigo-500 dark:bg-indigo-300 rounded-full animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></div>

          {/* Third Dot */}
          <div
            className="w-4 h-4 bg-indigo-400 dark:bg-indigo-200 rounded-full animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></div>
        </div>

        {/* Helper Text */}
        <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mt-4">
          در حال بارگذاری...
        </p>

        {/* Circular Progress Bar (Optional: to add more depth) */}
        <div className="w-32 h-1 bg-indigo-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-indigo-500 dark:bg-indigo-400 rounded-full animate-pulse-width"></div>
        </div>
      </div>
    </div>
  );
};

export default LazyFallbackElement;
