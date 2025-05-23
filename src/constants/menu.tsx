import {
  Home,
  User,
  Settings,
  LayoutDashboard,
  Plug,
  Users,
  PlusSquare,
  LifeBuoy,
  Shield,
  Code,
  Bell,
  Zap,
  CreditCard,
} from "lucide-react";

export const mainMenu = [
  { icon: <Home size={24} />, label: "خانه", href: "/" },
  { icon: <User size={24} />, label: "پروفایل", href: "/profile" },
  { icon: <Settings size={24} />, label: "تنظیمات", href: "/settings" },
  { icon: <LayoutDashboard size={24} />, label: "داشبورد", href: "/dashboard" },
  { icon: <User size={24} />, label: "کاربران", href: "/users" },
  { icon: <Settings size={24} />, label: "پیکربندی", href: "/config" },
  { icon: <Home size={24} />, label: "آمار", href: "/stats" },
  { icon: <User size={24} />, label: "حساب من", href: "/account" },
  { icon: <Settings size={24} />, label: "امنیت", href: "/security" },
];

// لیست زیرمنوها
export const subMenus: Record<
  string,
  { label: string; href: string; icon: JSX.Element }[]
> = {
  "/settings": [
    {
      label: "اتصال اکانت‌ها",
      href: "/settings/accounts",
      icon: <Plug size={18} />,
    },
    { label: "اعضای تیم", href: "/settings/team", icon: <Users size={18} /> },
    {
      label: "ادغام ابزارها",
      href: "/settings/integrations",
      icon: <PlusSquare size={18} />,
    },
    {
      label: "تیکت پشتیبانی",
      href: "/settings/tickets",
      icon: <LifeBuoy size={18} />,
    },
    {
      label: "تنظیمات حساب",
      href: "/settings/profile",
      icon: <Settings size={18} />,
    },
    {
      label: "تنظیمات امنیتی",
      href: "/settings/security",
      icon: <Shield size={18} />,
    },
    { label: "توسعه دهندگان", href: "/settings/dev", icon: <Code size={18} /> },
    {
      label: "تنظیمات اطلاع‌رسانی",
      href: "/settings/notifications",
      icon: <Bell size={18} />,
    },
    {
      label: "ارتقا اشتراک",
      href: "/settings/upgrade",
      icon: <Zap size={18} />,
    },
    {
      label: "سوابق مالی",
      href: "/settings/billing",
      icon: <CreditCard size={18} />,
    },
  ],
  "/profile": [
    {
      label: "محتواها",
      href: "/profile/billing",
      icon: <CreditCard size={18} />,
    },
  ],
};
