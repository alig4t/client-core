// components/LoadingSpinner.tsx
import React from "react";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "در حال بارگذاری...",
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Bouncing Dots Animation */}
      <div className="flex space-x-3 rtl:space-x-reverse">
        <div
          className="w-4 h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="w-4 h-4 bg-indigo-500 dark:bg-indigo-300 rounded-full animate-bounce"
          style={{ animationDelay: "0.15s" }}
        ></div>
        <div
          className="w-4 h-4 bg-indigo-400 dark:bg-indigo-200 rounded-full animate-bounce"
          style={{ animationDelay: "0.3s" }}
        ></div>
      </div>

      {/* Helper Text */}
      <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mt-4">
        {message}
      </p>

      {/* Progress Bar */}
      <div className="w-32 h-1 bg-indigo-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="w-1/3 h-full bg-indigo-500 dark:bg-indigo-400 rounded-full animate-pulse-width"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
