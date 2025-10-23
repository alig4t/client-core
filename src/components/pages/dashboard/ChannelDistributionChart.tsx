import { Layers } from "lucide-react";
import type { FC } from "react";
import {
  LineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";
import { DashboardData } from "../../../pages/Dashboard/Main/DashboardData";
import { renderCustomizedLabel } from "./ChartUtils";
import ChartContainer from "./ChartContainer";

// نمودار دایره‌ای توزیع کانال
export const ChannelDistributionChart: FC<{ channelDistributionData: any }> = ({
  channelDistributionData,
}) => (
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
              direction: "rtl",
              paddingRight: "15px",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  </div>
);
