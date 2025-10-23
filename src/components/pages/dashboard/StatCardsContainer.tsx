// StatCardsContainer.tsx

import React, { type FC } from "react";
import { type StatCardProps } from "./ChartUtils"; // فرض بر این است که StatCardProps از اینجا می‌آید
import { Zap } from "lucide-react";

interface StatCardsContainerProps {
  isLoading: boolean;
  kpiData: StatCardProps[];
  // type برای tinyClicksData را تعریف می‌کنیم
  tinyClicksData: { day: string; count: number }[];
}

// کامپوننت کمکی: یک کارت تکی KPI
const StatCard: FC<StatCardProps & { isLoading: boolean }> = ({
  title,
  value,
  icon: Icon,
  color,
  description,
  isLoading,
}) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between">
      {isLoading ? (
        // Skeleton برای عنوان و آیکون
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>
      ) : (
        <>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <Icon className={`h-6 w-6 ${color}`} />
        </>
      )}
    </div>

    <div className="mt-1">
      {isLoading ? (
        // Skeleton برای مقدار
        <div className="h-8 w-1/2 rounded bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
      ) : (
        <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {value}
        </p>
      )}
    </div>

    <div className="mt-2">
      {isLoading ? (
        // Skeleton برای توضیحات
        <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      ) : (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {description}
        </p>
      )}
    </div>
  </div>
);

// کامپوننت اصلی
const StatCardsContainer: FC<StatCardsContainerProps> = ({
  isLoading,
  kpiData,
  tinyClicksData,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* 1. Welcome Card/Refresh Button (Placeholder) */}
      <div className="col-span-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex items-center justify-between border border-gray-100 dark:border-gray-700">
        {isLoading ? (
          <div className="animate-pulse w-full space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-3 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              داشبورد پایش کلمات
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              آخرین به‌روزرسانی: ۳۰ ثانیه پیش
            </p>
          </div>
        )}
      </div>

      {/* 2. Main KPI Cards (3 Cards) */}
      {kpiData.map((card, index) => (
        // از شاخص به عنوان کلید استفاده می‌کنیم، چون داده‌ها Mock هستند
        <StatCard key={index} {...card} isLoading={isLoading} />
      ))}
    </div>
  );
};

export default StatCardsContainer;
