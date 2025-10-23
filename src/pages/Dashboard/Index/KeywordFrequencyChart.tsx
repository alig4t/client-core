import type { FC } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart as ReBarChart,
} from "recharts";
import { DashboardData } from "./DashboardData";
import ChartContainer from "./ChartContainer";
import { BarChart } from "lucide-react";

// نمودار میله‌ای فراوانی کلیدواژه‌ها
const KeywordFrequencyChart: FC<{frequencyData: any}> = ({frequencyData}) => (
  <ChartContainer
    title="فراوانی کل تطابق‌ها بر اساس کلیدواژه"
    icon={BarChart}
    className="h-[20rem]"
  >
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
        <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: "12px" }} />
        <YAxis
          stroke="#6b7280"
          style={{ fontSize: "12px" }}
          orientation="right"
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
  </ChartContainer>
);

export default KeywordFrequencyChart;
