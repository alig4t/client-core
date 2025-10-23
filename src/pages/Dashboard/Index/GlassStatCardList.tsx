import type { FC } from "react";
import { DashboardData } from "./DashboardData";

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
}

const GlassStatCardList: FC<GlassStatCardListProps> = ({ kpiData }) => {
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
