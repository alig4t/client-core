import { Layers } from "lucide-react";
import type { FC, ReactElement } from "react";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DashboardData } from "../../../pages/Dashboard/Main/DashboardData";
import { renderCustomizedLabel } from "./ChartUtils";
import ChartContainer, { ChartSkeleton } from "./ChartContainer";

const Skeleton: ReactElement = (
  <div className="col-span-1">
    <ChartSkeleton title="توزیع کلیدواژه‌ها بر اساس کانال"
      icon={Layers}
      className="h-[20rem]"
    >
      <div className="flex justify-around items-center gap-2">
        <div className="flex justify-center mb-6">
          <div className="w-36 h-36 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-row-reverse items-center space-x-2 rtl:space-x-reverse"
            >
              <div
                className={`w-3 h-3 rounded ${["bg-green-500", "bg-blue-500", "bg-red-500", "bg-orange-500"][index % 4]} animate-pulse`}
              ></div>
              <div className="h-3 w-12 bg-gray-300 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </ChartSkeleton>
  </div>
);

// نمودار دایره‌ای توزیع کانال
export const ChannelDistributionChart: FC<{
  channelDistributionData: any;
  isLoading: boolean;
}> = ({ channelDistributionData, isLoading }) => {
  if (isLoading) {
    return Skeleton;
  }
  return (
    <div className="col-span-1">
      <ChartContainer
        title="توزیع کلیدواژه‌ها بر اساس کانال"
        icon={Layers}
        className="h-[20rem]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart
          // margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <Pie
              data={channelDistributionData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {DashboardData.channelDistributionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#fff",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Legend
              layout="vertical"
              align="left"
              verticalAlign="middle"
              wrapperStyle={{
                direction: "ltr",
                paddingRight: "15px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
