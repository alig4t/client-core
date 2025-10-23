import type { FC } from "react";
import {
  Bar,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart as ReBarChart,
} from "recharts";
import { DashboardData } from "./DashboardData";

// --- نمودار افقی کوچک برای ستون کناری ---
const TopKeywordMiniChart: FC<{ topKeywordPerformance: any }> = ({
  topKeywordPerformance,
}) => (
  <div className="p-5 rounded-2xl border border-white/20 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 shadow-xl">
    <h4 className="font-bold text-lg text-indigo-600 border-b pb-2 mb-3 border-gray-100 dark:border-gray-700">
      عملکرد کلیدواژه‌های اصلی
    </h4>

    <ResponsiveContainer width="100%" height={120}>
      <ReBarChart
        data={topKeywordPerformance}
        layout="vertical"
        margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
      >
        <XAxis type="number" hide domain={[0, 100]} />
        <YAxis
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
);

export default TopKeywordMiniChart;
