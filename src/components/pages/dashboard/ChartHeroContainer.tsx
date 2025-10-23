import type { FC } from "react";
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
import ChartContainer from "./ChartContainer";
import { TrendingUp } from "lucide-react";

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
const ChartHeroContainer: FC<{ timeSeriesData: any }> = ({
  timeSeriesData,
}) => {
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
