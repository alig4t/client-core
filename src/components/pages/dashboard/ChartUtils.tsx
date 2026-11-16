import type { PieLabelRenderProps } from "recharts";
import { type LucideIcon } from "lucide-react";
import React,{ type FC } from "react";

// --- Custom Types/Interfaces ---

// تعریف واسط (Interface) برای StatCardProps که در GlassStatCard استفاده شده است
export interface StatCardProps {
  title: string;
  value: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
  description: string;
}

// تعریف واسط برای کانتینر نمودار
export interface ChartContainerProps {
  title: string;
  icon: LucideIcon; // استفاده از LucideIcon برای بهبود تایپینگ
  children: React.ReactNode;
  className?: string;
}

// --- Shared Utility Functions ---

const RADIAN = Math.PI / 180;

/**
 * رندر کننده سفارشی لیبل‌ها برای نمودار دایره‌ای (Pie Chart)
 */
export const renderCustomizedLabel = (props: PieLabelRenderProps) => {
  const cx = Number(props.cx ?? 0), cy = Number(props.cy ?? 0), midAngle = Number(props.midAngle ?? 0), innerRadius = Number(props.innerRadius ?? 0), outerRadius = Number(props.outerRadius ?? 0), percent = Number(props.percent ?? 0);
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{ fontSize: "12px" }}
      className="!bg-gray-200"
    >
      {/* {`${name} (${(percent * 100).toFixed(0)}%)`} */}
      {` (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};
