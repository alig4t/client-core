// src/components/LazyFallback.tsx
import React from "react";

const LazyFallbackElement: React.FC = () => {
  return (
    // Container اصلی: کل ارتفاع صفحه را می‌گیرد و محتوا را در مرکز قرار می‌دهد
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      {/* Container لودر */}
      <div className="flex flex-col items-center space-y-4">
        {/* انیمیشن Bouncing Dots */}
        <div className="flex space-x-3 rtl:space-x-reverse">
          {/* نقطه اول */}
          <div
            className="w-4 h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>

          {/* نقطه دوم */}
          <div
            className="w-4 h-4 bg-indigo-500 dark:bg-indigo-300 rounded-full animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></div>

          {/* نقطه سوم */}
          <div
            className="w-4 h-4 bg-indigo-400 dark:bg-indigo-200 rounded-full animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></div>
        </div>

        {/* متن راهنما */}
        <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mt-4">
          در حال بارگذاری...
        </p>

        {/* نوار پیشرفت حلقوی (اختیاری: برای افزودن عمق بیشتر) */}
        <div className="w-32 h-1 bg-indigo-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-indigo-500 dark:bg-indigo-400 rounded-full animate-pulse-width"></div>
        </div>
      </div>
    </div>
  );
};

export default LazyFallbackElement;
