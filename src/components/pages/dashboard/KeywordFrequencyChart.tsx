import { BarChart } from "lucide-react";
import type { FC,ReactElement } from "react";
import {
Bar,
CartesianGrid,
Cell,
BarChart as ReBarChart,
ResponsiveContainer,
Tooltip,
XAxis,
YAxis,
} from "recharts";
import { DashboardData } from "../../../pages/Dashboard/Main/DashboardData";
import ChartContainer,{ ChartSkeleton } from "./ChartContainer";

// نمودار میله‌ای فراوانی کلیدواژه‌ها
const KeywordFrequencyChart: FC<{ frequencyData: typeof DashboardData.frequencyData; isLoading: boolean }> = ({
  frequencyData,
  isLoading,
}) => {
  if (isLoading) {
    return Skeleton;
  }
  return (
    <ChartContainer
      title="فراوانی کل تطابق‌ها بر اساس کلیدواژه"
      icon={BarChart}
      className="h-[20rem]"
    >
      <div dir="ltr" className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <ReBarChart
            data={frequencyData}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              className="dark:stroke-gray-700"
            />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
              orientation="left"
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#fff",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="تطابق" fill="#f59e0b" radius={[10, 10, 0, 0]}>
              {DashboardData.frequencyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? "#f59e0b" : "#fb923c"}
                />
              ))}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default KeywordFrequencyChart;

const Skeleton: ReactElement = (
  <div className="col-span-1">
    <ChartSkeleton
      title="توزیع کلیدواژه‌ها بر اساس کانال"
      icon={BarChart}
      className="h-[20rem]"
    >
      {/* عنوان */}
      {/* بخش نمودار */}
      <div className="relative h-full border-b border-gray-200 pt-4">
        {/* خطوط افقی شبکه (محور Y) */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px bg-gray-200"
            style={{ top: `${(i + 1) * 20}%` }}
          ></div>
        ))}

        {/* ستون‌های خیالی */}
        {[
          { height: 70, color: "bg-orange-500/45" },
          { height: 60, color: "bg-orange-400/55" },
          { height: 45, color: "bg-orange-500/65" },
          { height: 35, color: "bg-orange-400/75" },
        ].map((bar, index) => (
          <div
            key={index}
            className={`absolute bottom-0 w-8 rounded-t-lg ${bar.color} animate-pulse`}
            style={{
              left: `${(index + 1) * 18}%`,
              height: `${bar.height}%`,
            }}
          ></div>
        ))}

        {/* لیبل‌های محور X */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-x-4 px-4 text-xs text-gray-500">
          {["رمزارز", "بورس", "فناوری", "اقتصادی"].map((label, i) => (
            <div
              key={i}
              className="h-3 w-8 bg-gray-300 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
      {/* محور Y - برچسب‌های خیالی
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
        {[360, 270, 180, 90, 0].map((val, i) => (
          <div
            key={i}
            className="h-3 w-6 bg-gray-300 rounded animate-pulse"
          ></div>
        ))}
      </div> */}
    </ChartSkeleton>
  </div>
);
