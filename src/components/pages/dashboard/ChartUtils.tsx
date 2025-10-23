import React, { type FC } from "react";
import { type LucideIcon } from "lucide-react";

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
export const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
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

// --- Custom Components ---

/**
 * کامپوننت Skeleton (انیمیشن بارگذاری)
 */
export const Skeleton: FC<{
  width?: string;
  height?: string;
  className?: string;
}> = ({ width = "w-full", height = "h-4", className = "" }) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse ${width} ${height} ${className}`}
  ></div>
);

/**
 * کانتینر استاندارد با طراحی Glassmorphism برای نمودارها و ویجت‌ها.
 */
export const ChartContainer: FC<ChartContainerProps> = ({
  title,
  icon: Icon,
  children,
  className = "",
}) => (
  <div
    dir="rtl"
    className={`
    bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm
    transition-all duration-300 ${className}
    `}
    style={{ minHeight: "15rem" }} // حداقل ارتفاع برای جلوگیری از CLS در زمان بارگذاری
  >
    <div className="flex items-center text-gray-700 dark:text-gray-300 mb-4 border-b pb-3 border-gray-100 dark:border-gray-700">
      <Icon className="w-5 h-5 ml-2 text-purple-600" />
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <div className="h-full w-full">{children}</div>
  </div>
);

/**
 * کامپوننت کارت آماری با افکت شیشه‌ای (Glassmorphism StatCard).
 */
export const GlassStatCard: FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  description,
}) => (
  <div
    dir="rtl"
    className={`
    p-6 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md
    bg-white/70 dark:bg-gray-800/70 transition-all duration-500
    hover:shadow-3xl hover:border-white/50
    `}
  >
    <div className="flex items-center justify-between">
      <div
        className={`p-3 rounded-xl text-white ${bgColor} dark:bg-opacity-90 shadow-lg`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <span className={`text-sm font-semibold ${color}`}>{title}</span>
    </div>
    <div className="mt-4">
      <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {description}
      </p>
    </div>
  </div>
);

// --- Skeleton Components ---

export const ChartSkeleton: FC<{ height?: string }> = ({
  height = "h-[calc(100%-4rem)]",
}) => (
  <div className={`flex flex-col justify-around p-4 ${height}`} dir="ltr">
    <Skeleton height="h-3" width="w-1/4" className="mb-4" />
    <div className="flex justify-between items-end h-full pt-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton
          key={i}
          width="w-8"
          height={`h-[${Math.random() * 60 + 20}%]`}
          className="mx-1"
        />
      ))}
    </div>
    <Skeleton height="h-2" className="mt-4" />
  </div>
);

export const PieChartSkeleton: FC<{ height?: string }> = ({
  height = "h-[200px]",
}) => (
  <div className={`flex items-center justify-center p-4 ${height}`} dir="ltr">
    <div className="relative w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse">
      <div className="absolute inset-0 rounded-full border-[15px] border-white/50"></div>
    </div>
    <div className="ml-8 space-y-3 w-20">
      <Skeleton height="h-2" />
      <Skeleton height="h-2" />
      <Skeleton height="h-2" />
    </div>
  </div>
);

export const StatCardSkeleton: FC = () => (
  <div
    className="p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md bg-white/70 dark:bg-gray-800/70"
    dir="rtl"
  >
    <div className="flex items-center justify-between">
      <Skeleton width="w-10" height="h-10" className="rounded-xl" />
      <Skeleton width="w-20" height="h-4" />
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton width="w-3/5" height="h-8" />
      <Skeleton width="w-4/5" height="h-3" />
    </div>
  </div>
);
