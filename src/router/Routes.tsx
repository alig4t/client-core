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
const ComprehensiveDisplay = lazy(
  () => import("@/Models/Comprehensive/ComprehensiveDisplay")
);

// User Module
const UserPage = lazy(
  () => import("@/Models/User/UserPage")
);
const UserCreate = lazy(
  () => import("@/Models/User/UserCreate")
);
const UserDisplay = lazy(
  () => import("@/Models/User/UserDisplay")
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
  UserSearch,
} from "lucide-react";

import type { RouteConfig } from "./path.types";
import { Permission } from "./Permission";
import { VIEWNAME } from "./ViewName";

// Function for parameterized routes
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
    // Without element and name — just menu grouping
  },

  // ================================
  // 🔐 Permission Management Pages
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
    label: "ایجاد مجوز",
    parent: "/dashboard/portal/permissions",
  },
  {
    path: withId("/dashboard/portal/permissions/edit"),
    element: PermissionCreate,
    permission: Permission.Permission_Update,
    showInMenu: false,
    name: VIEWNAME.PERMISSION_EDIT,
    label: "ویرایش مجوز",
    parent: "/dashboard/portal/permissions",
  },

  // ================================
  // 🧩 ComprehensiveEntity Pages
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
    label: "ایجاد ترکیبی",
    parent: "/dashboard/portal/comprehensive",
  },
  {
    path: withId("/dashboard/portal/comprehensive"),
    element: ComprehensiveDisplay,
    permission: Permission.ComprehensiveEntity_Read,
    showInMenu: false,
    name: VIEWNAME.COMPREHENSIVE_DISPLAY,
    label: "جزئیات ترکیبی",
    parent: "/dashboard/portal/comprehensive",
  },
  {
    path: withId("/dashboard/portal/comprehensive/edit"),
    element: ComprehensiveCreate,
    permission: Permission.ComprehensiveEntity_Update,
    showInMenu: false,
    name: VIEWNAME.COMPREHENSIVE_EDIT,
    label: "ویرایش ترکیبی",
    parent: "/dashboard/portal/comprehensive",
  },

  // ================================
  // 🧩 User Pages
  // ================================


   {
    path: "/dashboard/portal/user",
    label: "کاربران",
    icon: <UserSearch size={18} />,
    element: UserPage,
    parent: "/dashboard/portal",
    permission: Permission.User_Read,
    showInMenu: true,
    name: VIEWNAME.USERS_LIST,
  },
  {
    path: "/dashboard/portal/user/create",
    element: UserCreate,
    permission: Permission.User_Create,
    showInMenu: false,
    name: VIEWNAME.USERS_CREATE,
    label: "ایجاد کاربر",
    parent: "/dashboard/portal/user",
  },
  {
    path: withId("/dashboard/portal/user"),
    element: UserDisplay,
    permission: Permission.User_Read,
    showInMenu: false,
    name: VIEWNAME.USERS_DISPLAY,
    label: "جزئیات کاربر",
    parent: "/dashboard/portal/user",
  },
  {
    path: withId("/dashboard/portal/user/edit"),
    element: UserCreate,
    permission: Permission.User_Update,
    showInMenu: false,
    name: VIEWNAME.USERS_EDIT,
    label: "ویرایش کاربر",
    parent: "/dashboard/portal/user",
  },





 
  // ================================
// 📡 Platform (MessagingPlatform) Pages
// ================================
{
  path: "/dashboard/portal/platform",
  label: "پلتفرم‌ها",
  icon: <Globe size={18} />,
  element: lazy(() => import("@/Models/Platform/PlatformPage")),
  parent: "/dashboard/portal",
  permission: Permission.MessagingPlatform_Read,
  showInMenu: true,
  name: VIEWNAME.PLATFORM_LIST,
},
{
  path: "/dashboard/portal/platform/create",
  element: lazy(() => import("@/Models/Platform/PlatformCreate")),
  permission: Permission.MessagingPlatform_Create,
  showInMenu: false,
  name: VIEWNAME.PLATFORM_CREATE,
  label: "ایجاد پلتفرم",
  parent: "/dashboard/portal/platform",
},
{
  path: withId("/dashboard/portal/platform"),
  element: lazy(() => import("@/Models/Platform/PlatformDisplay")),
  permission: Permission.MessagingPlatform_Read,
  showInMenu: false,
  name: VIEWNAME.PLATFORM_DISPLAY,
  label: "جزئیات پلتفرم",
  parent: "/dashboard/portal/platform",
},
{
  path: withId("/dashboard/portal/platform/edit"),
  element: lazy(() => import("@/Models/Platform/PlatformCreate")),
  permission: Permission.MessagingPlatform_Update,
  showInMenu: false,
  name: VIEWNAME.PLATFORM_EDIT,
  label: "ویرایش پلتفرم",
  parent: "/dashboard/portal/platform",
},

// ================================
// 📺 Channel Pages
// ================================
{
  path: "/dashboard/portal/channels",
  label: "کانال‌ها",
  icon: <Hash size={18} />,
  element: lazy(() => import("@/Models/Channel/ChannelPage")),
  parent: "/dashboard/portal",
  permission: Permission.Channel_Read,
  showInMenu: true,
  name: VIEWNAME.CHANNEL_LIST,
},
{
  path: "/dashboard/portal/channels/create",
  element: lazy(() => import("@/Models/Channel/ChannelCreate")),
  permission: Permission.Channel_Create,
  showInMenu: false,
  name: VIEWNAME.CHANNEL_CREATE,
  label: "ایجاد کانال",
  parent: "/dashboard/portal/channels",
},
{
  path: withId("/dashboard/portal/channels"),
  element: lazy(() => import("@/Models/Channel/ChannelDisplay")),
  permission: Permission.Channel_Read,
  showInMenu: false,
  name: VIEWNAME.CHANNEL_DISPLAY,
  label: "جزئیات کانال",
  parent: "/dashboard/portal/channels",
},
{
  path: withId("/dashboard/portal/channels/edit"),
  element: lazy(() => import("@/Models/Channel/ChannelCreate")),
  permission: Permission.Channel_Update,
  showInMenu: false,
  name: VIEWNAME.CHANNEL_EDIT,
  label: "ویرایش کانال",
  parent: "/dashboard/portal/channels",
},

];
