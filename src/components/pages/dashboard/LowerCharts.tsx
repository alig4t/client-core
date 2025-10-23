// LowerCharts.tsx

import React, { type FC } from "react";

// تعریف ساده انواع داده
type FrequencyData = { name: string; تطابق: number }[];
type ChannelDistributionData = { name: string; value: number; color: string }[];

interface LowerChartsProps {
  isLoading: boolean;
  frequencyData: FrequencyData;
  channelDistributionData: ChannelDistributionData;
}

// کامپوننت کمکی: Skeleton عمومی برای یک نمودار نصف صفحه
const ChartSkeleton: FC = () => (
  <div className="animate-pulse p-4 space-y-4">
    <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="h-64 w-full rounded-lg bg-gray-300 dark:bg-gray-600"></div>
  </div>
);

const LowerCharts: FC<LowerChartsProps> = ({
  isLoading,
  frequencyData,
  channelDistributionData,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Key Frequency */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              فراوانی ۱۰ کلیدواژه برتر
            </h3>
            <div className="h-72 flex items-center justify-center text-gray-500">
              {/* نمودار ستونی واقعی */}
              نمودار ستونی: {frequencyData.length} آیتم
            </div>
          </>
        )}
      </div>

      {/* Chart 2: Channel Distribution */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              توزیع تطابق‌ها بر اساس کانال
            </h3>
            <div className="h-72 flex items-center justify-center text-gray-500">
              {/* نمودار دایره‌ای واقعی */}
              نمودار دایره‌ای: {channelDistributionData.length} کانال
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LowerCharts;
