// RightSidebar.tsx

import React, { type FC } from "react";

// تعریف ساده انواع داده
type RecentActivityData = {
  id: number;
  keyword: string;
  channel: string;
  count: number;
  time: string;
}[];

type TopKeywordPerformance = { keyword: string; count: number }[];

interface RightSidebarProps {
  isLoading: boolean;
  recentActivityData: RecentActivityData;
  topKeywordPerformance: TopKeywordPerformance;
}

const RightSidebar: FC<RightSidebarProps> = ({
  isLoading,
  recentActivityData,
  topKeywordPerformance,
}) => {
  return (
    <div className="col-span-12 lg:col-span-3 space-y-6">
      {/* 1. Recent Activity Card */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          فعالیت‌های اخیر
        </h3>

        <div className="space-y-3">
          {isLoading
            ? [...Array(5)].map((_, i) => (
                // Skeleton برای هر آیتم فعالیت
                <div
                  key={i}
                  className="animate-pulse flex justify-between items-center p-2 rounded-md bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="space-y-1 w-3/4">
                    <div className="h-3 w-4/5 rounded bg-gray-200 dark:bg-gray-600"></div>
                    <div className="h-2 w-1/2 rounded bg-gray-300 dark:bg-gray-700"></div>
                  </div>
                  <div className="h-3 w-8 rounded bg-red-200 dark:bg-red-700"></div>
                </div>
              ))
            : recentActivityData.map((activity) => (
                // محتوای واقعی
                <div
                  key={activity.id}
                  className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.keyword}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.channel} - {activity.time}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-red-500">
                    +{activity.count}
                  </span>
                </div>
              ))}
        </div>
      </div>

      {/* 2. Top Keyword Performance Card (Placeholder) */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          عملکرد کلیدواژه‌های برتر
        </h3>
        <div className="space-y-4">
          {isLoading
            ? [...Array(3)].map((_, i) => (
                // Skeleton برای هر کلیدواژه
                <div key={i} className="animate-pulse">
                  <div className="flex justify-between mb-1">
                    <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-3 w-1/6 rounded bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700/50">
                    <div className="h-2 w-3/4 rounded-full bg-indigo-400"></div>
                  </div>
                </div>
              ))
            : topKeywordPerformance.map((item, index) => (
                // محتوای واقعی
                <div key={index}>
                  <div className="flex justify-between mb-1 text-sm font-medium text-gray-900 dark:text-white">
                    <span>{item.keyword}</span>
                    <span>{item.count}%</span>
                  </div>
                  {/* شبیه‌سازی نوار پیشرفت */}
                  <div className="w-full bg-gray-100 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-indigo-500 transition-all duration-700"
                      style={{ width: `${item.count}%` }}
                    ></div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
