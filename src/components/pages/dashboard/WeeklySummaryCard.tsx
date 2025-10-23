import type { FC } from "react";

export const WeeklySummaryCard: FC = () => {
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
