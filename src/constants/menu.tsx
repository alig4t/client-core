import {
  Home,
  User,
  Settings,
  Plug,
  Users,
  PlusSquare,
  LifeBuoy,
  Shield,
  Code,
  Bell,
  Zap,
  CreditCard,
  NotebookPen,
  Bolt,
} from "lucide-react";
import type { JSX } from "react";

const mainMenu = [
  { icon: <Home size={24} />, label: "خانه", href: "/dashboard" },
  { icon: <User size={24} />, label: "پروفایل", href: "/dashboard/profile" },
  { icon: <Bolt size={24} />, label: "پورتال", href: "/dashboard/portal" },

  {
    icon: <Settings size={24} />,
    label: "تنظیمات",
    href: "/dashboard/settings",
  },

  { icon: <Home size={24} />, label: "آمار", href: "/dashboard/stats" },
  {
    icon: <NotebookPen size={24} />,
    label: "پست ها",
    href: "/dashboard/posts",
  },
  { icon: <Settings size={24} />, label: "امنیت", href: "/dashboard/security" },
];

// Submenu list
export const subMenus: Record<
  string,
  { label: string; href: string; icon: JSX.Element }[]
> = {
  "/dashboard/settings": [
    {
      label: "اتصال اکانت‌ها",
      href: "/dashboard/settings/accounts",
      icon: <Plug size={18} />,
    },
    {
      label: "اعضای تیم",
      href: "/dashboard/settings/team",
      icon: <Users size={18} />,
    },
    {
      label: "ادغام ابزارها",
      href: "/dashboard/settings/integrations",
      icon: <PlusSquare size={18} />,
    },
    {
      label: "تیکت پشتیبانی",
      href: "/dashboard/settings/tickets",
      icon: <LifeBuoy size={18} />,
    },
    {
      label: "تنظیمات حساب",
      href: "/dashboard/settings/profile",
      icon: <Settings size={18} />,
    },
    {
      label: "تنظیمات امنیتی",
      href: "/dashboard/settings/security",
      icon: <Shield size={18} />,
    },
    {
      label: "توسعه دهندگان",
      href: "/dashboard/settings/dev",
      icon: <Code size={18} />,
    },
    {
      label: "تنظیمات اطلاع‌رسانی",
      href: "/dashboard/settings/notifications",
      icon: <Bell size={18} />,
    },
    {
      label: "ارتقا اشتراک",
      href: "/dashboard/settings/upgrade",
      icon: <Zap size={18} />,
    },
    {
      label: "سوابق مالی",
      href: "/dashboard/settings/billing",
      icon: <CreditCard size={18} />,
    },
  ],
  "/dashboard/profile": [
    {
      label: "محتواها",
      href: "/dashboard/profile/billing",
      icon: <CreditCard size={18} />,
    },
  ],
  "/dashboard/posts": [
    {
      label: "محتواها",
      href: "/dashboard/posts/billing",
      icon: <CreditCard size={18} />,
    },
  ],
  "/dashboard/portal": [
    {
      label: "تگ ها",
      href: "/dashboard/portal/tags",
      icon: <CreditCard size={18} />,
    },
    {
      label: "پست ها",
      href: "/dashboard/portal/posts",
      icon: <CreditCard size={18} />,
    },
    {
      label: "مجوز ها",
      href: "/dashboard/portal/permissions",
      icon: <CreditCard size={18} />,
    },
    {
      label: "ترکیبی ها",
      href: "/dashboard/portal/comprehensive",
      icon: <CreditCard size={18} />,
    },
  ],
};
