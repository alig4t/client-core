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

// تابع برای مسیرهای پارامتری
export const withId = (base: string) => `${base}/:id`;

export const routeConfig: RouteConfig[] = [
  // --- Public ---
  { path: "/", element: LandingPage, isPublic: true, showInMenu: false },
  { path: "/login", element: LoginPage, isPublic: true, showInMenu: false },
  {
    path: "/register",
    element: RegisterPage,
    isPublic: true,
    showInMenu: false,
  },

  // --- Dashboard (main) ---
  {
    path: "/dashboard",
    label: "خانه",
    icon: <Home size={24} />,
    element: Dashboard,
    showInMenu: true,
  },

  // --- Profile ---
  {
    path: "/dashboard/profile",
    label: "پروفایل",
    icon: <User size={24} />,
    element: Profile,
    showInMenu: true,
  },

  // --- Settings ---
  {
    path: "/dashboard/settings",
    label: "تنظیمات",
    icon: <SettingsIcon size={24} />,
    element: Settings,
    showInMenu: true,
  },

  // --- Portal (main entry) ---
  {
    path: "/dashboard/portal",
    label: "پورتال",
    icon: <Bolt size={24} />,
    showInMenu: true,
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
  },
  {
    path: "/dashboard/portal/permissions/create",
    element: PermissionCreate,
    permission: Permission.Permission_Create,
    showInMenu: false,
  },
  {
    path: withId("/dashboard/portal/permissions"),
    // element: PermissionEdit,
    permission: Permission.Permission_Update,
    showInMenu: false,
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
  },
  {
    path: "/dashboard/portal/comprehensive/create",
    element: ComprehensiveCreate,
    permission: Permission.ComprehensiveEntity_Create,
    showInMenu: false,
  },
  {
    path: withId("/dashboard/portal/comprehensive"),
    element: ComprehensiveDisplay,
    permission: Permission.ComprehensiveEntity_Read,
    showInMenu: false,
  },
  {
    path: `${withId("/dashboard/portal/comprehensive")}/edit`,
    // element: ComprehensiveEdit,
    permission: Permission.ComprehensiveEntity_Update,
    showInMenu: false,
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
  },
];
