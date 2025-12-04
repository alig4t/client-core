import type { FC, ReactElement } from "react";

export const WeeklySummaryCard: FC<{ isLoading: boolean }> = ({
  isLoading,
}) => {
  if (isLoading) {
    return Skeleton;
  }
  return (
    <div className="p-5 rounded-2xl border border-white/20 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 shadow-xl">
      <h4 className="font-bold text-lg text-purple-600 border-b pb-2 mb-3 border-gray-100 dark:border-gray-700">
        خلاصه وضعیت هفتگی
      </h4>
      <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <p className="flex justify-between">
          <span>پربازدیدترین کانال:</span>
          <span className="font-semibold text-green-600">@TechNews</span>
        </p>
        <p className="flex justify-between">
          <span>کلیدواژه با بیشترین رشد:</span>
          <span className="font-semibold text-indigo-600">بورس (+۳۵٪)</span>
        </p>
        <p className="flex justify-between">
          <span>وضعیت بات تلگرام:</span>
          <span className="font-semibold text-green-600">فعال</span>
        </p>
        <p className="flex justify-between">
          <span>تعداد تطابق‌های نامرتبط:</span>
          <span className="font-semibold text-red-600">۱۴ مورد</span>
        </p>
      </div>
    </div>
  );
};

const Skeleton: ReactElement = (
  <div className="bg-white p-4 rounded-lg shadow-md">
    {/* عنوان */}
    <div className="flex items-center justify-between mb-4">
      <div className="h-5 w-36 bg-gray-300 rounded animate-pulse"></div>
    </div>

    {/* لیست اطلاعات */}
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-start justify-between space-x-2">
          {/* برچسب سمت چپ */}
          <div className="h-4 w-28 bg-gray-300 rounded animate-pulse"></div>

          {/* مقدار سمت راست */}
          <div className="flex  items-center space-x-1">
            {/* مقدار اصلی (با رنگ متفاوت) */}
            <div
              className={`h-4 w-16 rounded animate-pulse ${index === 0 || index === 1
                  ? "bg-green-500/45"
                  : index === 2
                    ? "bg-red-500/45"
                    : "bg-gray-300/45"
                }`}
            ></div>
            {/* عدد/توضیح کوچک (در صورت وجود) */}
          </div>
        </div>
      ))}
    </div>
  </div>
);
