import { type FC } from "react";
import { RefreshCw } from "lucide-react";
import GlassStatCardList from "./GlassStatCardList";
import ChartHeroContainer from "./ChartHeroContainer";
import KeywordFrequencyChart from "./KeywordFrequencyChart";
import TopKeywordMiniChart from "./TopKeywordMiniChart";
import { ChannelDistributionChart } from "./ChannelDistributionChart";
import { RecentActivityList } from "./RecentActivityList";
import { WeeklySummaryCard } from "./WeeklySummaryCard";
import { DashboardData } from "./DashboardData";

const Dashboard: FC = () => {
  return (
    <div
      dir="rtl"
      className="p-4 md:p-8 bg-gradient-to-br  from-gray-50 to-zinc-200 dark:from-gray-900 dark:to-gray-800 min-h-screen font-sans transition-colors duration-300 rounded-xl"
    >
      {/* 1. Header and Welcome */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            داشبورد اصلی <span className="text-purple-600">پلتفرم پایش</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            خلاصه وضعیت، روندهای زمانی و توزیع کلیدواژه‌ها در یک نگاه.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition px-3 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-md">
            <RefreshCw className="w-4 h-4 ml-2" />
            به‌روزرسانی
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <GlassStatCardList kpiData={DashboardData.kpiData} />
          <ChartHeroContainer timeSeriesData={DashboardData.timeSeriesData} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KeywordFrequencyChart
              frequencyData={DashboardData.frequencyData}
            />
            <TopKeywordMiniChart
              topKeywordPerformance={DashboardData.topKeywordPerformance}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Activity and Summary (Spans 3 columns on large screens) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <ChannelDistributionChart
            channelDistributionData={DashboardData.channelDistributionData}
          />
          <RecentActivityList
            recentActivityData={DashboardData.recentActivityData}
          />
          <WeeklySummaryCard />
        </div>
        {/* RIGHT COLUMN: Recent Activity and Summary (Spans 3 columns on large screens) */}
      </div>
    </div>
  );
};

export default Dashboard;
