import type { FC, ReactElement } from "react";
import { DashboardData } from "../../../pages/Dashboard/Main/DashboardData";
import { ChartSkeleton } from "./ChartContainer";
import { Layers } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
  description: string;
}

const GlassStatCard: FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  description,
}) => (
  <div className="p-6 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 transition-all duration-500 hover:shadow-3xl hover:border-white/50">
    <div className="flex gap-2 items-center justify-between">
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

type KpiItem = {
  title: string;
  value: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
  description: string;
};

interface GlassStatCardListProps {
  kpiData: KpiItem[];
  isLoading: boolean;
}

const Skeleton: ReactElement = (
  <div className="col-span-1">
    <div className="grid  grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => {
        let color;
        if (index === 0) {
          color = "bg-indigo-500/45";
        } else if (index === 1) {
          color = "bg-green-500/45";
        } else if (index === 2) {
          color = "bg-red-500/45";
        } else {
          color = "bg-gray-500/45";
        }

        return (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex flex-row-reverse justify-around items-center w-full mb-2">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
              <div
                className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center animate-pulse`}
              >
                <div className="w-5 h-5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-700 mb-1">
              <div className="h-8 my-2 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="text-xs">
              <div className="h-3 w-24 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
        );
      })}

      {/* کارت ۳ */}
    </div>
  </div>
);

const GlassStatCardList: FC<GlassStatCardListProps> = ({
  kpiData,
  isLoading,
}) => {
  if (isLoading) {
    return Skeleton;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {kpiData.map((kpi, index) => (
        <GlassStatCard
          key={index}
          title={kpi.title}
          value={kpi.value}
          icon={kpi.icon}
          color={kpi.color}
          bgColor={kpi.bgColor}
          description={kpi.description}
        />
      ))}
    </div>
  );
};

export default GlassStatCardList;
