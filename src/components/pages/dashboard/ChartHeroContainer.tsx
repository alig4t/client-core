import type { FC, ReactElement } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardData } from "../../../pages/Dashboard/Main/DashboardData";
import ChartContainer, { ChartSkeleton } from "./ChartContainer";
import { Layers, TrendingUp } from "lucide-react";

// نمودار خطی روند زمانی (Hero Chart)
const MonitoringTrendChart: FC<{ timeSeriesData: any }> = ({
  timeSeriesData,
}) => (
  <div
    dir="ltr"
    style={{
      direction: "ltr",
      width: "100%",
      height: "100%",
    }}
  >
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={timeSeriesData}
        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
      >
        {/* بقیه کدها بدون تغییر */}
        <defs>
          <linearGradient id="colorTadapt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
          className="dark:stroke-gray-700"
        />
        <XAxis
          dataKey="name"
          stroke="#6b7280"
          angle={-15}
          textAnchor="end"
          height={50}
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
        <Legend wrapperStyle={{ direction: "rtl", paddingRight: "20px" }} />
        <Line
          type="monotone"
          dataKey="تطابق"
          stroke="#9333ea"
          strokeWidth={4}
          dot={{ r: 4, fill: "#9333ea" }}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="بازدید"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
const ChartHeroContainer: FC<{ timeSeriesData: any; isLoading: boolean }> = ({
  timeSeriesData,
  isLoading,
}) => {
  if (isLoading) {
    return Skeleton;
  }
  return (
    <div className="mb-6">
      <ChartContainer
        title="روند زمانی تطابق کلیدواژه‌ها (هفتگی)"
        icon={TrendingUp}
        className="h-[25rem]"
      >
        <MonitoringTrendChart timeSeriesData={timeSeriesData} />
      </ChartContainer>
    </div>
  );
};

export default ChartHeroContainer;

const Skeleton: ReactElement = (
  <div className="col-span-1">
    <ChartSkeleton
      title="توزیع کلیدواژه‌ها بر اساس کانال"
      icon={Layers}
      className="h-[40rem]"
    >
      {/* Chart section */}
      <div className="relative h-42 border-b border-gray-200 pt-0 pb-6">
        {/* Y axis - Imaginary horizontal lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px bg-gray-200"
            style={{ top: `${(i + 1) * 20}%` }}
          ></div>
        ))}

        {/* Imaginary line */}
        {/* <div className="absolute bottom-8 left-0 right-0 h-px bg-purple-500 animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 right-0 h-px bg-green-500 animate-pulse"
          style={{ top: "10%" }}
        ></div> */}

        {/* Imaginary points on lines */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-purple-500/45 rounded-full animate-pulse"
            style={{
              left: `${(i + 1) * 14}%`,
              bottom: `${Math.random() * 60 + 10}%`,
            }}
          ></div>
        ))}

        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={`green-${i}`}
            className="absolute w-3 h-3 bg-green-500/45 rounded-full animate-pulse"
            style={{
              left: `${(i + 1) * 14}%`,
              bottom: `${Math.random() * 60 + 10}%`,
            }}
          ></div>
        ))}

        {/* X axis - Imaginary labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
          {[
            "۱ تیر",
            "۸ تیر",
            "۱۵ تیر",
            "۲۲ تیر",
            "۲۹ تیر",
            "۵ مرداد",
            "۱۲ مرداد",
          ].map((label, i) => (
            <div
              key={i}
              className="h-3 w-1/12 bg-gray-300 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* لِجِند */}
      <div className="flex flex-row-reverse justify-center mt-4 space-x-6 rtl:space-x-reverse">
        <div className="flex items-center gap-2 space-x-2 rtl:space-x-reverse">
          <div className="w-4 h-4 bg-purple-500 rounded animate-pulse"></div>
          <div className="h-3 w-12 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2 space-x-2 rtl:space-x-reverse">
          <div className="w-4 h-4 bg-green-500 rounded animate-pulse"></div>
          <div className="h-3 w-12 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    </ChartSkeleton>
  </div>
);
