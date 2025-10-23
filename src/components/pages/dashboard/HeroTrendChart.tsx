// HeroTrendChart.tsx

import React, { type FC } from "react";
// فرض می‌کنیم انواع داده‌ها اینجا تعریف شده‌اند
// برای سادگی، یک نوع ساده تعریف می‌کنیم
type TimeSeriesData = { name: string; تطابق: number; بازدید: number }[];

interface HeroTrendChartProps {
  isLoading: boolean;
  timeSeriesData: TimeSeriesData;
}

const HeroTrendChart: FC<HeroTrendChartProps> = ({
  isLoading,
  timeSeriesData,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        روند تطابق‌ها و بازدیدها در بازه زمانی
      </h2>

      {isLoading ? (
        // Skeleton برای نمودار اصلی
        <div className="animate-pulse p-4">
          <div className="h-72 w-full rounded-lg bg-gray-200 dark:bg-gray-700">
            {/* خطوط و محورهای Placeholder */}
            <div className="absolute inset-0 p-4">
              <div className="h-full w-full border-b border-l border-gray-400"></div>
              <div className="flex justify-between mt-2">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="h-3 w-8 rounded bg-gray-300 dark:bg-gray-600"
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-6 space-x-reverse mt-4">
            <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-3 w-16 rounded bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>
      ) : (
        // محتوای واقعی نمودار (مثلاً Recharts یا Nivo)
        <div className="h-80 flex items-center justify-center text-gray-500">
          {/* اینجا باید کامپوننت نمودار (Chart Component) واقعی قرار گیرد */}
          نمودار خطی واقعی: {timeSeriesData.length} نقطه داده
        </div>
      )}
    </div>
  );
};

export default HeroTrendChart;
