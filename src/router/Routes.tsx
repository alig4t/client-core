// src/constants/routes.ts
import { lazy } from "react";

// Lazy components
const LandingPage = lazy(() => import("@/pages/HomePage/LandingPage"));
const LoginPage = lazy(() => import("@/pages/Login"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard/Main/DashboardMain"));
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));

// Permission Module
const PermissionPage = lazy(() => import("@/Models/Permission/PermissionPage"));
const PermissionCreate = lazy(
  () => import("@/Models/Permission/PermissionCreate")
);
// const PermissionEdit = lazy(() => import("@/Models/Permission/PermissionEdit"));

// Comprehensive Module
const ComprehensivePage = lazy(
  () => import("@/Models/Comprehensive/ComprehensivePage")
);
const ComprehensiveCreate = lazy(
  () => import("@/Models/Comprehensive/ComprehensiveCreate")
);
// const ComprehensiveEdit = lazy(() => import("@/Models/Comprehensive/ComprehensiveEdit"));
const ComprehensiveDisplay = lazy(
  () => import("@/Models/Comprehensive/ComprehensiveDisplay")
);

// Icons
import {
  Home,
  User,
  Settings as SettingsIcon,
  Shield,
  Code,
  NotebookPen,
  Bolt,
  Bot,
  Hash,
  MapPin,
  MessageSquare,
  Users,
  Key,
  Database,
  Globe,
  UserCheck,
} from "lucide-react";

import type { RouteConfig } from "./path.types";
import { Permission } from "./Permission";
import { VIEWNAME } from "./ViewName";

// تابع برای مسیرهای پارامتری
export const withId = (base: string) => `${base}/:id`;

export const routeConfig: RouteConfig[] = [
  // --- Public ---
  {
    path: "/",
    element: LandingPage,
    isPublic: true,
    showInMenu: false,
    name: VIEWNAME.LANDING,
  },
  {
    path: "/login",
    element: LoginPage,
    isPublic: true,
    showInMenu: false,
    name: VIEWNAME.LOGIN,
  },
  {
    path: "/register",
    element: RegisterPage,
    isPublic: true,
    showInMenu: false,
    name: VIEWNAME.REGISTER,
  },

  // --- Dashboard (main) ---
  {
    path: "/dashboard",
    label: "خانه",
    icon: <Home size={24} />,
    element: Dashboard,
    showInMenu: true,
    name: VIEWNAME.DASHBOARD,
  },

  // --- Profile ---
  {
    path: "/dashboard/profile",
    label: "پروفایل",
    icon: <User size={24} />,
    element: Profile,
    showInMenu: true,
    name: VIEWNAME.PROFILE,
  },

  // --- Settings ---
  {
    path: "/dashboard/settings",
    label: "تنظیمات",
    icon: <SettingsIcon size={24} />,
    element: Settings,
    showInMenu: true,
    name: VIEWNAME.SETTINGS,
  },

  // --- Portal (main entry) ---
  {
    path: "/dashboard/portal",
    label: "پورتال",
    icon: <Bolt size={24} />,
    showInMenu: true,
    // بدون element و name — فقط گروه‌بندی منو
  },

  // ================================
  // 🔐 صفحات مدیریت مجوزها (Permission)
  // ================================
  {
    path: "/dashboard/portal/permissions",
    label: "مجوز ها",
    icon: <Shield size={18} />,
    element: PermissionPage,
    parent: "/dashboard/portal",
    permission: Permission.Permission_Read,
    showInMenu: true,
    name: VIEWNAME.PERMISSION_LIST,
  },
  {
    path: "/dashboard/portal/permissions/create",
    element: PermissionCreate,
    permission: Permission.Permission_Create,
    showInMenu: false,
    name: VIEWNAME.PERMISSION_CREATE,
  },
  {
    path: withId("/dashboard/portal/permissions"),
    // element: PermissionEdit,
    permission: Permission.Permission_Update,
    showInMenu: false,
    name: VIEWNAME.PERMISSION_EDIT,
  },

  // ================================
  // 🧩 صفحات ComprehensiveEntity
  // ================================
  {
    path: "/dashboard/portal/comprehensive",
    label: "ترکیبی ها",
    icon: <Code size={18} />,
    element: ComprehensivePage,
    parent: "/dashboard/portal",
    permission: Permission.ComprehensiveEntity_Read,
    showInMenu: true,
    name: VIEWNAME.COMPREHENSIVE_LIST,
  },
  {
    path: "/dashboard/portal/comprehensive/create",
    element: ComprehensiveCreate,
    permission: Permission.ComprehensiveEntity_Create,
    showInMenu: false,
    name: VIEWNAME.COMPREHENSIVE_CREATE,
  },
  {
    path: withId("/dashboard/portal/comprehensive"),
    element: ComprehensiveDisplay,
    permission: Permission.ComprehensiveEntity_Read,
    showInMenu: false,
    name: VIEWNAME.COMPREHENSIVE_DISPLAY,
  },
  {
    path: `${withId("/dashboard/portal/comprehensive")}/edit`,
    // element: ComprehensiveEdit,
    permission: Permission.ComprehensiveEntity_Update,
    showInMenu: false,
    name: VIEWNAME.COMPREHENSIVE_EDIT,
  },

  // ================================
  // 🤖 Bot
  // ================================
  {
    path: "/dashboard/portal/bots",
    label: "ربات‌ها",
    icon: <Bot size={18} />,
    parent: "/dashboard/portal",
    permission: Permission.Bot_Read,
    showInMenu: true,
    name: VIEWNAME.BOTS,
  },

  // ================================
  // 📢 Channel
  // ================================
  {
    path: "/dashboard/portal/channels",
    label: "کانال‌ها",
    icon: <Hash size={18} />,
    parent: "/dashboard/portal",
    permission: Permission.Channel_Read,
    showInMenu: true,
    name: VIEWNAME.CHANNELS,
  },

  // ================================
  // 🏙️ City
  // ================================
  {
    path: "/dashboard/portal/cities",
    label: "شهرها",
    icon: <MapPin size={18} />,
    parent: "/dashboard/portal",
    permission: Permission.City_Read,
    showInMenu: true,
    name: VIEWNAME.CITIES,
  },

  // ================================
  // 💬 Message
  // ================================
  {
    path: "/dashboard/portal/messages",
    label: "پیام‌ها",
    icon: <MessageSquare size={18} />,
    parent: "/dashboard/portal",
    permission: Permission.Message_Read,
    showInMenu: true,
    name: VIEWNAME.MESSAGES,
  },

  // ================================
  // 👥 User
  // ================================
  {
    path: "/dashboard/portal/users",
    label: "کاربران",
    icon: <Users size={18} />,
    parent: "/dashboard/portal",
    permission: Permission.User_Read,
    showInMenu: true,
    name: VIEWNAME.USERS,
  },

  // ================================
  // 🔑 Keyword
  // ================================
  {
    path: "/dashboard/portal/keywords",
    label: "کلمات کلیدی",
    icon: <Key size={18} />,
    parent: "/dashboard/portal",
    permission: Permission.Keyword_Read,
    showInMenu: true,
    name: VIEWNAME.KEYWORDS,
  },

  // ================================
  // 🌐 MessagingPlatform
  // ================================
  {
    path: "/dashboard/portal/platforms",
    label: "پلتفرم‌ها",
    icon: <Globe size={18} />,
    parent: "/dashboard/portal",
    permission: Permission.MessagingPlatform_Read,
    showInMenu: true,
    name: VIEWNAME.PLATFORMS,
  },

  // ================================
  // 👤 Person
  // ================================
  {
    path: "/dashboard/portal/persons",
    label: "افراد",
    icon: <UserCheck size={18} />,
    parent: "/dashboard/portal",
    permission: Permission.Person_Read,
    showInMenu: true,
    name: VIEWNAME.PERSONS,
  },

  // ================================
  // 🗃️ DashboardData
  // ================================
  {
    path: "/dashboard/portal/data",
    label: "داده‌های داشبورد",
    icon: <Database size={18} />,
    parent: "/dashboard/portal",
    permission: Permission.DashboardData_Read,
    showInMenu: true,
    name: VIEWNAME.DASHBOARD_DATA,
  },
];