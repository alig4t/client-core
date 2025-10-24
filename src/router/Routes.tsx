// src/constants/routes.ts
import { lazy } from "react";
// Lazy components (همان‌هایی که در routes.tsx داشتی)
const LandingPage = lazy(() => import("@/pages/HomePage/LandingPage"));
const LoginPage = lazy(() => import("@/pages/Login"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard/Main/DashboardMain"));
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));
const Post = lazy(() => import("@/pages/Post"));

// Permission & Comprehensive
const PermissionPage = lazy(() => import("@/Models/Permission/PermissionPage"));
const PermissionCreate = lazy(
  () => import("@/Models/Permission/PermissionCreate")
);
const ComprehensivePage = lazy(
  () => import("@/Models/Comprehensive/ComprehensivePage")
);
const ComprehensiveCreate = lazy(
  () => import("@/Models/Comprehensive/ComprehensiveCreate")
);
const ComprehensiveDisplay = lazy(
  () => import("@/Models/Comprehensive/ComprehensiveDisplay")
);

// Icons
import {
  Home,
  User,
  Settings as SettingsIcon,
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
import type { RouteConfig } from "./route.types.ts";

// تابع برای مسیرهای پارامتری
export const withId = (base: string) => `${base}/:id`;

// ✅ تمام مسیرهای شما — دقیقاً مطابق منوی فعلی، اما با متادیتا
export const routeConfig: RouteConfig[] = [
  // --- Public ---
  {
    path: "/",
    label: "صفحه اصلی",
    element: LandingPage,
    isPublic: true,
    showInMenu: false,
  },
  {
    path: "/login",
    label: "ورود",
    element: LoginPage,
    isPublic: true,
    showInMenu: false,
  },
  {
    path: "/register",
    label: "ثبت‌نام",
    element: RegisterPage,
    isPublic: true,
    showInMenu: false,
  },

  // --- Main Menu Items (showInMenu: true, بدون parent) ---
  {
    path: "/dashboard",
    label: "خانه",
    icon: <Home size={24} />,
    element: Dashboard,
    showInMenu: true,
  },
  {
    path: "/dashboard/profile",
    label: "پروفایل",
    icon: <User size={24} />,
    element: Profile,
    showInMenu: true,
  },
  {
    path: "/dashboard/portal",
    label: "پورتال",
    icon: <Bolt size={24} />,
    showInMenu: true,
  }, // بدون element — فقط والد
  {
    path: "/dashboard/settings",
    label: "تنظیمات",
    icon: <SettingsIcon size={24} />,
    element: Settings,
    showInMenu: true,
  },
  {
    path: "/dashboard/stats",
    label: "آمار",
    icon: <Home size={24} />,
    showInMenu: true,
  }, // بدون element فعلاً
  {
    path: "/dashboard/posts",
    label: "پست ها",
    icon: <NotebookPen size={24} />,
    element: Post,
    showInMenu: true,
  },
  {
    path: "/dashboard/security",
    label: "امنیت",
    icon: <SettingsIcon size={24} />,
    showInMenu: true,
  },

  // --- Submenus: Portal ---
  {
    path: "/dashboard/portal/tags",
    label: "تگ ها",
    icon: <CreditCard size={18} />,
    parent: "/dashboard/portal",
    showInMenu: true,
  },
  {
    path: "/dashboard/portal/posts",
    label: "پست ها",
    icon: <CreditCard size={18} />,
    parent: "/dashboard/portal",
    showInMenu: true,
  },
  {
    path: "/dashboard/portal/permissions",
    label: "مجوز ها",
    icon: <Shield size={18} />,
    element: PermissionPage,
    parent: "/dashboard/portal",
    showInMenu: true,
  },
  {
    path: "/dashboard/portal/comprehensive",
    label: "ترکیبی ها",
    icon: <Code size={18} />,
    element: ComprehensivePage,
    parent: "/dashboard/portal",
    showInMenu: true,
  },

  // --- Submenus: Settings ---
  {
    path: "/dashboard/settings/accounts",
    label: "اتصال اکانت‌ها",
    icon: <Plug size={18} />,
    parent: "/dashboard/settings",
    showInMenu: true,
  },
  {
    path: "/dashboard/settings/team",
    label: "اعضای تیم",
    icon: <Users size={18} />,
    parent: "/dashboard/settings",
    showInMenu: true,
  },
  {
    path: "/dashboard/settings/integrations",
    label: "ادغام ابزارها",
    icon: <PlusSquare size={18} />,
    parent: "/dashboard/settings",
    showInMenu: true,
  },
  {
    path: "/dashboard/settings/tickets",
    label: "تیکت پشتیبانی",
    icon: <LifeBuoy size={18} />,
    parent: "/dashboard/settings",
    showInMenu: true,
  },
  {
    path: "/dashboard/settings/profile",
    label: "تنظیمات حساب",
    icon: <SettingsIcon size={18} />,
    parent: "/dashboard/settings",
    showInMenu: true,
  },
  {
    path: "/dashboard/settings/security",
    label: "تنظیمات امنیتی",
    icon: <Shield size={18} />,
    parent: "/dashboard/settings",
    showInMenu: true,
  },
  {
    path: "/dashboard/settings/dev",
    label: "توسعه دهندگان",
    icon: <Code size={18} />,
    parent: "/dashboard/settings",
    showInMenu: true,
  },
  {
    path: "/dashboard/settings/notifications",
    label: "اطلاع‌رسانی",
    icon: <Bell size={18} />,
    parent: "/dashboard/settings",
    showInMenu: true,
  },
  {
    path: "/dashboard/settings/upgrade",
    label: "ارتقا اشتراک",
    icon: <Zap size={18} />,
    parent: "/dashboard/settings",
    showInMenu: true,
  },
  {
    path: "/dashboard/settings/billing",
    label: "سوابق مالی",
    icon: <CreditCard size={18} />,
    parent: "/dashboard/settings",
    showInMenu: true,
  },

  // --- Extra (برای profile و posts) ---
  {
    path: "/dashboard/profile/billing",
    label: "محتواها",
    icon: <CreditCard size={18} />,
    parent: "/dashboard/profile",
    showInMenu: true,
  },
  {
    path: "/dashboard/posts/billing",
    label: "محتواها",
    icon: <CreditCard size={18} />,
    parent: "/dashboard/posts",
    showInMenu: true,
  },

  // --- Create & Detail Pages (not in menu) ---
  {
    path: "/dashboard/portal/permissions/create",
    element: PermissionCreate,
    permission: "create:permissions",
    showInMenu: false,
  },
  {
    path: "/dashboard/portal/comprehensive/create",
    element: ComprehensiveCreate,
    permission: "create:comprehensive",
    showInMenu: false,
  },
  {
    path: withId("/dashboard/portal/comprehensive"),
    element: ComprehensiveDisplay,
    permission: "view:comprehensive",
    showInMenu: false,
  },
];
