import type { PieLabelRenderProps } from "recharts";
import {
BarChart,
ChevronRight,
Layers,
List,
RefreshCw,
TrendingUp
} from "lucide-react";
import React,{ type FC } from "react";
import {
Bar,
CartesianGrid,
Cell,
Legend,
Line,
LineChart,
Pie,
PieChart,
BarChart as ReBarChart,
ResponsiveContainer,
Tooltip,
XAxis,
YAxis
} from "recharts";
import { DashboardData } from "./DashboardData";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (props: PieLabelRenderProps) => {
  const cx = Number(props.cx ?? 0), cy = Number(props.cy ?? 0), midAngle = Number(props.midAngle ?? 0), innerRadius = Number(props.innerRadius ?? 0), outerRadius = Number(props.outerRadius ?? 0), percent = Number(props.percent ?? 0);
  const name = String(props.name ?? "");
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
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};
// --- Custom Components ---

// تعریف واسط (Interface) برای StatCardProps که در GlassStatCard استفاده شده است
interface StatCardProps {
  title: string;
  value: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
  description: string;
}

// 1. کامپوننت کارت آماری با افکت شیشه‌ای (Glassmorphism StatCard)
const GlassStatCard: FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  description,
}) => (
  <div
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

// 2. کانتینر نمودار
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

// 3. کامپوننت لیست فعالیت‌های اخیر
const RecentActivityList: FC = () => (
  <ChartContainer
    title="آخرین تطابق‌های کلیدواژه"
    icon={List}
    className="lg:h-[30rem] overflow-hidden"
  >
    <ul className="divide-y divide-gray-100 dark:divide-gray-700 overflow-y-auto h-[calc(100%-1rem)]">
      {DashboardData.recentActivityData.map((activity) => (
        <li
          key={activity.id}
          className="flex justify-between items-center py-3 hover:bg-purple-50/50 dark:hover:bg-gray-700/50 transition duration-150 rounded-lg px-2"
        >
          <div className="flex flex-col items-start">
            <span className="font-semibold text-gray-900 dark:text-white flex items-center">
              <ChevronRight className="w-4 h-4 ml-1 text-purple-500" />
              {activity.keyword}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 mr-5">
              در کانال:{" "}
              <span className="text-purple-500">{activity.channel}</span>
            </span>
          </div>
          <div className="text-center">
            <p className="font-bold text-sm text-purple-600">
              {activity.count}
            </p>
            <p className="text-xs text-gray-400">{activity.time}</p>
          </div>
        </li>
      ))}
    </ul>
    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-center">
      <button className="text-sm font-medium text-purple-600 hover:text-purple-700 transition">
        مشاهده تمام فعالیت‌ها
      </button>
    </div>
  </ChartContainer>
);

// --- Chart Implementations ---

// نمودار خطی روند زمانی (Hero Chart)
const MonitoringTrendChart: FC = () => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart
      data={DashboardData.timeSeriesData}
      margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
    >
      <defs>
        {/* Gradient for area fill */}
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
);

// نمودار میله‌ای فراوانی کلیدواژه‌ها
const KeywordFrequencyChart: FC = () => (
  <ResponsiveContainer width="100%" height="100%">
    <ReBarChart
      data={DashboardData.frequencyData}
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
);

// نمودار دایره‌ای توزیع کانال
const ChannelDistributionChart: FC = () => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
      <Pie
        data={DashboardData.channelDistributionData}
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
);

// --- نمودار افقی کوچک برای ستون کناری ---
const TopKeywordMiniChart: FC = () => (
  <ResponsiveContainer width="100%" height={120}>
    <ReBarChart
      data={DashboardData.topKeywordPerformance}
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
);

// --- نمودار خطی بسیار کوچک برای Header ---
const TinyClicksLineChart: FC = () => (
  <ResponsiveContainer width="100%" height={40}>
    <LineChart
      data={DashboardData.tinyClicksData}
      margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
    >
      <Line
        type="monotone"
        dataKey="count"
        stroke="#10b981"
        strokeWidth={2}
        dot={false}
      />
      <Tooltip
        contentStyle={{
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          fontSize: "10px",
        }}
        labelStyle={{ fontWeight: "bold", color: "#10b981" }}
      />
    </LineChart>
  </ResponsiveContainer>
);

// --- Main Dashboard Page ---

const Dashboard: FC = () => {
  return (
    <div
      dir="rtl"
      className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 min-h-screen font-sans transition-colors duration-300"
    >
      {/* 1. Header and Welcome */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            داشبورد اصلی <span className="text-purple-600">پلتفرم پایش</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            خلاصه وضعیت، روندهای زمانی و توزیع کلیدواژه‌ها در یک نگاه.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* New KPI Card */}
          <div className="hidden sm:block p-3 rounded-xl border border-white/20 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 shadow-md w-48 text-right">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              کلیک به جزئیات (۵ روز)
            </p>
            <p className="text-xl font-bold text-green-600 dark:text-green-500 mt-1">
              {
                DashboardData.tinyClicksData[
                  DashboardData.tinyClicksData.length - 1
                ].count
              }{" "}
              بار
            </p>
            <div className="mt-1 -mb-3 h-10">
              <TinyClicksLineChart />
            </div>
          </div>

          <button className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition px-3 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-md">
            <RefreshCw className="w-4 h-4 ml-2" />
            به‌روزرسانی
          </button>
        </div>
      </div>

      {/* 2. Main Layout Grid: KPIs, Charts, and Sidebar */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT COLUMN: Main Content (Spans 9 columns on large screens) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* KPI Section (Responsive Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {DashboardData.kpiData.map((kpi, index) => (
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

          {/* --- HERO CHART (نمودار اصلی در دید اول) --- */}
          <div className="mb-6">
            <ChartContainer
              title="روند زمانی تطابق کلیدواژه‌ها (هفتگی)"
              icon={TrendingUp}
              className="h-[25rem]"
            >
              <MonitoringTrendChart />
            </ChartContainer>
          </div>

          {/* Lower Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 2: Keyword Frequency (Bar Chart) */}
            <div className="col-span-1">
              <ChartContainer
                title="فراوانی کل تطابق‌ها بر اساس کلیدواژه"
                icon={BarChart}
                className="h-[20rem]"
              >
                <KeywordFrequencyChart />
              </ChartContainer>
            </div>

            {/* Mini Horizontal Bar Chart: Top Keyword Performance */}
            <div className="p-5 rounded-2xl border border-white/20 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 shadow-xl">
              <h4 className="font-bold text-lg text-indigo-600 border-b pb-2 mb-3 border-gray-100 dark:border-gray-700">
                عملکرد کلیدواژه‌های اصلی
              </h4>
              <TopKeywordMiniChart />
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                بر اساس درصد تطابق از کل در ۷ روز گذشته
              </p>
            </div>
            {/* Mini Horizontal Bar Chart: Top Keyword Performance */}
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Activity and Summary (Spans 3 columns on large screens) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Chart 3: Channel Distribution (Pie Chart) */}
          <div className="col-span-1">
            <ChartContainer
              title="توزیع کلیدواژه‌ها بر اساس کانال"
              icon={Layers}
              className="h-[20rem]"
            >
              <ChannelDistributionChart />
            </ChartContainer>
          </div>

          {/* Recent Activity List */}
          <RecentActivityList />

          {/* Weekly Summary Card (متنی) */}
          <div className="p-5 rounded-2xl border border-white/20 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 shadow-xl">
            <h4 className="font-bold text-lg text-purple-600 border-b pb-2 mb-3 border-gray-100 dark:border-gray-700">
              خلاصه وضعیت هفتگی
            </h4>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <p className="flex justify-between">
                <span>پربازدیدترین کانال:</span>
                <span className="font-semibold text-green-600">@TechNews</span>
              </p>
              <p className="flex justify-between">
                <span>کلیدواژه با بیشترین رشد:</span>
                <span className="font-semibold text-indigo-600">
                  بورس (+۳۵٪)
                </span>
              </p>
              <p className="flex justify-between">
                <span>وضعیت بات تلگرام:</span>
                <span className="font-semibold text-green-600">فعال</span>
              </p>
              <p className="flex justify-between">
                <span>تعداد تطابق‌های نامرتبط:</span>
                <span className="font-semibold text-red-600">۱۴ مورد</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
