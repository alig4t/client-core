import type { FC } from "react";
import ChartContainer from "./ChartContainer";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { DashboardData } from "../../../pages/Dashboard/Main/DashboardData";

// 3. کامپوننت لیست فعالیت‌های اخیر
export const RecentActivityList: FC<{ recentActivityData: any[] }> = ({
  recentActivityData,
}) => (
  <ChartContainer
    title="آخرین تطابق‌های کلیدواژه"
    icon={List}
    className="lg:h-[30rem] overflow-hidden pb-10"
  >
    <ul className="divide-y divide-gray-100 dark:divide-gray-700 overflow-y-auto h-[calc(100%-1rem)]">
      {recentActivityData.map((activity) => (
        <li
          key={activity.id}
          className="flex justify-between items-center py-3 hover:bg-purple-50/50 dark:hover:bg-gray-700/50 transition duration-150 rounded-lg px-2"
        >
          <div className="flex flex-col items-start">
            <span className="font-semibold text-gray-900 dark:text-white flex items-center">
              <ChevronLeft className="w-4 h-4 ml-1 text-purple-500" />
              {activity.keyword}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 mr-5">
              در کانال:{" "}
              <span className="text-purple-500">{activity.channel}</span>
            </span>
          </div>
          <div className="text-center">
            <p className="font-bold text-sm text-purple-600">
              {activity.count}
            </p>
            <p className="text-xs text-gray-400">{activity.time}</p>
          </div>
        </li>
      ))}
    </ul>
    <div className="mt-2 pt-2 pb-4 border-t border-gray-100 dark:border-gray-700 text-center">
      <button className="text-sm font-medium py-2 text-purple-600 hover:text-purple-700 transition">
        مشاهده تمام فعالیت‌ها
      </button>
    </div>
  </ChartContainer>
);
