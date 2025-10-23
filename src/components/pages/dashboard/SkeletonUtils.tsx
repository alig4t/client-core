// SkeletonUtils.tsx
import React from "react";

// اسکلتون برای کارت‌های آماری
export const StatCardSkeleton: React.FC = () => (
  <div className="p-6 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 transition-all duration-500">
    <div className="flex items-center justify-between">
      <div className="p-3 rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse">
        <div className="w-7 h-7 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
      </div>
      <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
    <div className="mt-4">
      <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-3 w-40 bg-gray-200 dark:bg-gray-600 rounded mt-2 animate-pulse"></div>
    </div>
  </div>
);

// اسکلتون برای نمودارها (Chart Container)
export const ChartContainerSkeleton: React.FC<{
  title?: string;
  className?: string;
}> = ({ title, className = "" }) => (
  <div
    className={`
      bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm
      h-96 transition-all duration-300 ${className}
    `}
  >
    {title && (
      <div className="flex items-center text-gray-700 dark:text-gray-300 mb-4 border-b pb-3 border-gray-100 dark:border-gray-700">
        <div className="w-5 h-5 ml-2 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    )}
    <div className="h-[calc(100%-4rem)] w-full flex items-center justify-center">
      <div className="h-4 w-full max-w-xs bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
  </div>
);

// اسکلتون برای لیست فعالیت‌ها
export const ActivityListSkeleton: React.FC = () => (
  <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm h-[30rem] overflow-hidden">
    <div className="flex items-center text-gray-700 dark:text-gray-300 mb-4 border-b pb-3 border-gray-100 dark:border-gray-700">
      <div className="w-5 h-5 ml-2 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-5 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
    <ul className="divide-y divide-gray-100 dark:divide-gray-700 overflow-y-auto h-[calc(100%-4rem)]">
      {[...Array(5)].map((_, i) => (
        <li
          key={i}
          className="flex justify-between items-center py-3 px-2 animate-pulse"
        >
          <div className="flex flex-col items-start">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-600 rounded mt-1"></div>
          </div>
          <div className="text-center">
            <div className="h-4 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded mt-1"></div>
          </div>
        </li>
      ))}
    </ul>
    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-center">
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded mx-auto"></div>
    </div>
  </div>
);

// اسکلتون برای نمودار کوچک افقی
export const MiniHorizontalChartSkeleton: React.FC = () => (
  <div className="p-5 rounded-2xl border border-white/20 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 shadow-xl">
    <div className="h-5 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
    <div className="h-32 w-full bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
    <div className="mt-3 h-3 w-full bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
  </div>
);

// اسکلتون برای کارت خلاصه وضعیت هفتگی
export const SummaryCardSkeleton: React.FC = () => (
  <div className="p-5 rounded-2xl border border-white/20 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 shadow-xl">
    <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex justify-between animate-pulse">
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

// اسکلتون برای نمودار کوچک هدر
export const TinyChartSkeleton: React.FC = () => (
  <div className="p-3 rounded-xl border border-white/20 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 shadow-md w-48 text-right">
    <div className="h-3 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
    <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
    <div className="mt-1 -mb-3 h-10">
      <div className="h-full w-full bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
    </div>
  </div>
);
