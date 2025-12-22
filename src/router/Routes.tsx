// Main Routes - Safe Modular Architecture
import { lazy } from "react";
import { Home, User, Settings as SettingsIcon, Shield, Code, Bolt, MessageCircleCode } from "lucide-react";
import type { RouteConfig } from "./path.types";
import { Permission } from "./Permission";
import { VIEWNAME } from "./ViewName";

// Generated routes (safe - auto-updated by generator)
import { generatedRoutes } from "./generated.routes";

// Custom routes (safe - manually managed)
import { customRoutes } from "./custom.routes";

// Core/Base Lazy Components
const LandingPage = lazy(() => import("@/pages/HomePage/LandingPage"));
const LoginPage = lazy(() => import("@/pages/Login"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard/Main/DashboardMain"));
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));

// Permission Module (manual)
const PermissionPage = lazy(() => import("@/Models/Permission/PermissionPage"));
const PermissionCreate = lazy(() => import("@/Models/Permission/PermissionCreate"));

// Comprehensive Module (manual/example)
const ComprehensivePage = lazy(() => import("@/Models/Comprehensive/ComprehensivePage"));
const ComprehensiveCreate = lazy(() => import("@/Models/Comprehensive/ComprehensiveCreate"));
const ComprehensiveDisplay = lazy(() => import("@/Models/Comprehensive/ComprehensiveDisplay"));

// Helper for parameterized routes
export const withId = (base: string) => `${base}/:id`;

// Core/Base Routes (manual - safe)
const coreRoutes: RouteConfig[] = [
  // Public Routes
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

  // Dashboard
  {
    path: "/dashboard",
    label: "خانه",
    icon: <Home size={24} />,
    element: Dashboard,
    showInMenu: true,
    name: VIEWNAME.DASHBOARD,
  },

  // Profile
  {
    path: "/dashboard/profile",
    label: "پروفایل",
    icon: <User size={24} />,
    element: Profile,
    showInMenu: true,
    name: VIEWNAME.PROFILE,
  },

  // Settings
  {
    path: "/dashboard/settings",
    label: "تنظیمات",
    icon: <SettingsIcon size={24} />,
    element: Settings,
    showInMenu: true,
    name: VIEWNAME.SETTINGS,
  },

  // Portal (menu grouping)
  {
    path: "/dashboard/portal",
    label: "پورتال",
    icon: <Bolt size={24} />,
    showInMenu: true,
    name: VIEWNAME.PORTAL,
  },
  
  {
    path: "/dashboard/messaging",
    label: "پیام رسان ها",
    icon: <MessageCircleCode size={24} />,
    showInMenu: true,
    name: VIEWNAME.MESSAGING,
  },
  

  // Permission Module (manual)
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
    path: withId("/dashboard/portal/permissions"),
    permission: Permission.Permission_Update,
    showInMenu: false,
    name: VIEWNAME.PERMISSION_EDIT,
    label: "ویرایش مجوز",
    parent: "/dashboard/portal/permissions",
  },

  // // Comprehensive (example entity - manual)
  // {
  //   path: "/dashboard/portal/comprehensive",
  //   label: "ترکیبی ها",
  //   icon: <Code size={18} />,
  //   element: ComprehensivePage,
  //   parent: "/dashboard/portal",
  //   permission: Permission.ComprehensiveEntity_Read,
  //   showInMenu: true,
  //   name: VIEWNAME.COMPREHENSIVE_LIST,
  // },
  // {
  //   path: "/dashboard/portal/comprehensive/create",
  //   element: ComprehensiveCreate,
  //   permission: Permission.ComprehensiveEntity_Create,
  //   showInMenu: false,
  //   name: VIEWNAME.COMPREHENSIVE_CREATE,
  //   label: "ایجاد ترکیبی",
  //   parent: "/dashboard/portal/comprehensive",
  // },
  // {
  //   path: withId("/dashboard/portal/comprehensive"),
  //   element: ComprehensiveDisplay,
  //   permission: Permission.ComprehensiveEntity_Read,
  //   showInMenu: false,
  //   name: VIEWNAME.COMPREHENSIVE_DISPLAY,
  //   label: "جزئیات ترکیبی",
  //   parent: "/dashboard/portal/comprehensive",
  // },
  // {
  //   path: withId("/dashboard/portal/comprehensive/edit"),
  //   element: ComprehensiveCreate,
  //   permission: Permission.ComprehensiveEntity_Update,
  //   showInMenu: false,
  //   name: VIEWNAME.COMPREHENSIVE_EDIT,
  //   label: "ویرایش ترکیبی",
  //   parent: "/dashboard/portal/comprehensive",
  // },
];

// ✅ SAFE MERGE: Generated + Custom + Core
export const routeConfig: RouteConfig[] = [
  ...coreRoutes,
  ...generatedRoutes,     // ✨ All auto-generated entity routes
  ...customRoutes,        // ✨ Your custom routes
];
