import type { FC,ReactElement } from "react";
import {
Bar,
Cell,
BarChart as ReBarChart,
ResponsiveContainer,
Tooltip,
XAxis,
YAxis,
} from "recharts";
import { DashboardData } from "../../../pages/Dashboard/Main/DashboardData";

// --- Small horizontal chart for sidebar ---
const TopKeywordMiniChart: FC<{
  topKeywordPerformance: typeof DashboardData.topKeywordPerformance;
  isLoading: boolean;
}> = ({ topKeywordPerformance, isLoading }) => {
  if (isLoading) {
    return Skeleton;
  }
  return (
    <div className="p-5 rounded-2xl border border-white/20 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 shadow-xl">
      <h4 className="font-bold text-lg text-indigo-600 border-b pb-2 mb-3 border-gray-100 dark:border-gray-700">
        عملکرد کلیدواژه‌های اصلی
      </h4>

      <div dir="ltr" className="w-full h-[80%] flex flex-col justify-between">
        <ResponsiveContainer width="100%" height={120}>
          <ReBarChart
            data={topKeywordPerformance}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
          >
            <XAxis type="number" hide domain={[0, 100]} reversed />
            <YAxis
              orientation="right"
              type="category"
              dataKey="keyword"
              stroke="#6b7280"
              width={80}
              style={{ fontSize: "11px" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#fff",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Bar
              dataKey="count"
              fill="#4c51bf"
              orientation="right"
              radius={[0, 4, 4, 0]}
              label={{
                position: "right",
                fill: "#4c51bf",
                style: { fontWeight: "bold", fontSize: "10px" },
              }}
            >
              {DashboardData.topKeywordPerformance.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? "#4c51bf" : "#6366f1"}
                /> // Indigo shades
              ))}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          بر اساس درصد تطابق از کل در ۷ روز گذشته
        </p>
      </div>
    </div>
  );
};

export default TopKeywordMiniChart;

const Skeleton: ReactElement = (
  <div className="bg-white p-4 rounded-lg shadow-md">
    {/* Title */}
    <div className="flex items-center justify-between mb-6">
      <div className="h-5 w-40 bg-gray-300 rounded animate-pulse"></div>
    </div>

    {/* Bar list */}
    <div className="space-y-4 pt-8">
      {[
        { value: 95, color: "bg-indigo-600/45" },
        { value: 80, color: "bg-indigo-500/45" },
        { value: 65, color: "bg-indigo-600/45" },
      ].map((item, index) => (
        <div
          key={index}
          className="flex gap-2 items-center space-x-4 rtl:space-x-reverse"
        >
          {/* Left number */}
          <div className="h-5 w-8 bg-gray-300 rounded animate-pulse"></div>

          {/* Horizontal bar */}
          <div
            className={`h-6 rounded-full ${item.color} animate-pulse`}
            style={{ width: `${item.value}%` }}
          ></div>

          {/* Right label */}
          {/* <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div> */}
        </div>
      ))}
    </div>
  </div>
);
