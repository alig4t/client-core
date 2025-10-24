import type { FC } from "react";

interface ChartContainerProps {
  title: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  className?: string;
}

const ChartContainer: FC<ChartContainerProps> = ({
  title,
  icon: Icon,
  children,
  className = "",
}) => (
  <div
    className={`
    bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm
    h-96 transition-all duration-300 ${className}
  `}
  >
    <div className="flex items-center text-gray-700 dark:text-gray-300 mb-4 border-b pb-3 border-gray-100 dark:border-gray-700">
      <Icon className="w-5 h-5 ml-2 text-purple-600" />
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <div className="h-[calc(100%-4rem)] w-full">{children}</div>
  </div>
);

export default ChartContainer;

/*********************************************************
// Chart PLACE Holder
// For Loading 
// Skeleton Design
*********************************************************/

export const ChartSkeleton: FC<{
  children: React.ReactNode;
  title: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  className?: string;
}> = ({ children, title, icon: Icon, className = "" }) => {
  return (
    <div
      className={`
    bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm
    h-72 transition-all duration-300
  `}
    >
      <div className="flex items-center text-gray-700 dark:text-gray-300 mb-4 border-b pb-3 border-gray-100 dark:border-gray-700">
        {/* <Icon className="w-5 h-5 ml-2 text-purple-600" /> */}
        <div className="w-5 h-5 ml-2 bg-purple-200/45 rounded-xl animate-pulse" />
        <div className="w-35 h-5 ml-2 bg-gray-200/45 rounded-xl animate-pulse" />
        {/* <h3 className="text-lg font-bold">{title}</h3> */}
      </div>
      <div className="h-[calc(100%-4rem)] w-full">{children}</div>
    </div>
  );
};
