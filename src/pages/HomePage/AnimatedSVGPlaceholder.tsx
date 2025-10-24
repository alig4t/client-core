// src/components/AnimatedSVGPlaceholder.tsx
import React from 'react';

const AnimatedSVGPlaceholder: React.FC = () => {
  return (
    <div className="w-full max-w-lg mx-auto p-8 rounded-2xl bg-indigo-50/50 dark:bg-gray-800/50 shadow-xl border border-indigo-100 dark:border-gray-700">
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <svg className="w-20 h-20 text-indigo-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" />
        </svg>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          فضای انیمیشن SVG جذاب مدیریت پیام‌رسان‌ها
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          (جایگزین با Lottie یا SVG متحرک واقعی)
        </p>
      </div>
    </div>
  );
};

export default AnimatedSVGPlaceholder;