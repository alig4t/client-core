// --- Mock Data ---

import { Layers, Search, Zap } from "lucide-react";

// داده‌های آماری کلیدی (KPIs)
const kpiData = [
  {
    title: "تعداد کانال‌های فعال",
    value: "۲۴",
    icon: Layers,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500",
    description: "۴ کانال جدید در این ماه",
  },
  {
    title: "کلیدواژه‌های تحت پایش",
    value: "۱۸۷",
    icon: Search,
    color: "text-green-500",
    bgColor: "bg-green-500",
    description: "۲۲ کلیدواژه با بیشترین تطابق",
  },
  {
    title: "مجموع تطابق‌های این هفته",
    value: "+۳,۴۵۰",
    icon: Zap,
    color: "text-red-500",
    bgColor: "bg-red-500",
    description: "افزایش ۱۲٪ نسبت به هفته قبل",
  },
];

// داده‌های فعالیت اخیر
const recentActivityData = [
  {
    id: 1,
    keyword: "هوش مصنوعی",
    channel: "@TechNews",
    count: 12,
    time: "۱ دقیقه پیش",
  },
  {
    id: 2,
    keyword: "رمزارز",
    channel: "@FinancePortal",
    count: 5,
    time: "۳ ساعت پیش",
  },
  { id: 3, keyword: "بورس", channel: "@IranEconomy", count: 21, time: "دیروز" },
  {
    id: 4,
    keyword: "استارتاپ",
    channel: "@BusinessHub",
    count: 8,
    time: "۲ روز پیش",
  },
  {
    id: 5,
    keyword: "تحلیل داده",
    channel: "@DataScienceIR",
    count: 15,
    time: "۳ روز پیش",
  },
];

// داده‌های روند زمانی برای نمودار خطی
const timeSeriesData = [
  { name: "۱ تیر", تطابق: 4000, بازدید: 2400 },
  { name: "۸ تیر", تطابق: 3000, بازدید: 1398 },
  { name: "۱۵ تیر", تطابق: 2000, بازدید: 9800 },
  { name: "۲۲ تیر", تطابق: 2780, بازدید: 3908 },
  { name: "۲۹ تیر", تطابق: 1890, بازدید: 4800 },
  { name: "۵ مرداد", تطابق: 2390, بازدید: 3800 },
  { name: "۱۲ مرداد", تطابق: 3490, بازدید: 4300 },
];

// داده‌های فراوانی برای نمودار میله‌ای
const frequencyData = [
  { name: "هوش مصنوعی", تطابق: 350 },
  { name: "رمزارز", تطابق: 280 },
  { name: "بورس", تطابق: 190 },
  { name: "فناوری", تطابق: 150 },
  { name: "اقتصادی", تطابق: 100 },
];

// داده‌های توزیع کانال (برای نمودار دایره‌ای)
const channelDistributionData = [
  { name: "تلگرام", value: 400, color: "#3b82f6" }, // blue-500
  { name: "ایتا", value: 300, color: "#10b981" }, // green-500
  { name: "سروش", value: 200, color: "#f97316" }, // orange-500
  { name: "روبیکا", value: 100, color: "#ef4444" }, // red-500
];

// داده‌های عملکرد کلیدواژه‌های اصلی برای نمودار کوچک افقی
const topKeywordPerformance = [
  { keyword: "هوش مصنوعی", count: 95 },
  { keyword: "بورس", count: 80 },
  { keyword: "رمزارز", count: 65 },
];

// داده‌های نمودار خطی بسیار کوچک برای Header
const tinyClicksData = [
  { day: "د۱", count: 10 },
  { day: "د۲", count: 15 },
  { day: "د۳", count: 25 },
  { day: "د۴", count: 20 },
  { day: "د۵", count: 35 },
];

export const DashboardData = {
  kpiData,
  recentActivityData,
  timeSeriesData,
  frequencyData,
  channelDistributionData,
  topKeywordPerformance,
  tinyClicksData,
};
