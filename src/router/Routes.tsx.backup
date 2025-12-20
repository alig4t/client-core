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

// Bot Module
const BotPage = lazy(() => import("@/Models/Bot/BotPage"));
const BotCreate = lazy(() => import("@/Models/Bot/BotCreate"));
const BotDisplay = lazy(() => import("@/Models/Bot/BotDisplay"));

// Channel Module
const ChannelPage = lazy(() => import("@/Models/Channel/ChannelPage"));
const ChannelCreate = lazy(() => import("@/Models/Channel/ChannelCreate"));
const ChannelDisplay = lazy(() => import("@/Models/Channel/ChannelDisplay"));

// City Module
const CityPage = lazy(() => import("@/Models/City/CityPage"));
const CityCreate = lazy(() => import("@/Models/City/CityCreate"));
const CityDisplay = lazy(() => import("@/Models/City/CityDisplay"));

// Keyword Module
const KeywordPage = lazy(() => import("@/Models/Keyword/KeywordPage"));
const KeywordCreate = lazy(() => import("@/Models/Keyword/KeywordCreate"));
const KeywordDisplay = lazy(() => import("@/Models/Keyword/KeywordDisplay"));

// KeywordMatch Module
const KeywordMatchPage = lazy(() => import("@/Models/KeywordMatch/KeywordMatchPage"));
const KeywordMatchCreate = lazy(() => import("@/Models/KeywordMatch/KeywordMatchCreate"));
const KeywordMatchDisplay = lazy(() => import("@/Models/KeywordMatch/KeywordMatchDisplay"));

// MessagingPlatform Module
const MessagingPlatformPage = lazy(() => import("@/Models/MessagingPlatform/MessagingPlatformPage"));
const MessagingPlatformCreate = lazy(() => import("@/Models/MessagingPlatform/MessagingPlatformCreate"));
const MessagingPlatformDisplay = lazy(() => import("@/Models/MessagingPlatform/MessagingPlatformDisplay"));

// Person Module
const PersonPage = lazy(() => import("@/Models/Person/PersonPage"));
const PersonCreate = lazy(() => import("@/Models/Person/PersonCreate"));
const PersonDisplay = lazy(() => import("@/Models/Person/PersonDisplay"));

// UserChannel Module
const UserChannelPage = lazy(() => import("@/Models/UserChannel/UserChannelPage"));
const UserChannelCreate = lazy(() => import("@/Models/UserChannel/UserChannelCreate"));
const UserChannelDisplay = lazy(() => import("@/Models/UserChannel/UserChannelDisplay"));

// DashboardData Module
const DashboardDataPage = lazy(() => import("@/Models/DashboardData/DashboardDataPage"));
const DashboardDataCreate = lazy(() => import("@/Models/DashboardData/DashboardDataCreate"));
const DashboardDataDisplay = lazy(() => import("@/Models/DashboardData/DashboardDataDisplay"));

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
    path: withId("/dashboard/portal/permissions"),
    // element: PermissionEdit,
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
  // 🤖 Bot
  // ================================
  {
    path: "/dashboard/portal/bots",
    label: "ربات‌ها",
    icon: <Bot size={18} />,
    element: BotPage,
    parent: "/dashboard/portal",
    permission: Permission.Bot_Read,
    showInMenu: true,
    name: VIEWNAME.BOTS,
  },
  {
    path: "/dashboard/portal/bots/create",
    element: BotCreate,
    permission: Permission.Bot_Create,
    showInMenu: false,
    name: VIEWNAME.BOT_CREATE,
    label: "ایجاد ربات",
    parent: "/dashboard/portal/bots",
  },
  {
    path: withId("/dashboard/portal/bots"),
    element: BotDisplay,
    permission: Permission.Bot_Read,
    showInMenu: false,
    name: VIEWNAME.BOT_DISPLAY,
    label: "جزئیات ربات",
    parent: "/dashboard/portal/bots",
  },
  {
    path: withId("/dashboard/portal/bots/edit"),
    element: BotCreate,
    permission: Permission.Bot_Update,
    showInMenu: false,
    name: VIEWNAME.BOT_EDIT,
    label: "ویرایش ربات",
    parent: "/dashboard/portal/bots",
  },

  // ================================
  // 📢 Channel
  // ================================
  {
    path: "/dashboard/portal/channels",
    label: "کانال‌ها",
    icon: <MessageSquare size={18} />,
    element: ChannelPage,
    parent: "/dashboard/portal",
    permission: Permission.Channel_Read,
    showInMenu: true,
    name: VIEWNAME.CHANNELS,
  },
  {
    path: "/dashboard/portal/channels/create",
    element: ChannelCreate,
    permission: Permission.Channel_Create,
    showInMenu: false,
    name: VIEWNAME.CHANNEL_CREATE,
    label: "ایجاد کانال",
    parent: "/dashboard/portal/channels",
  },
  {
    path: withId("/dashboard/portal/channels"),
    element: ChannelDisplay,
    permission: Permission.Channel_Read,
    showInMenu: false,
    name: VIEWNAME.CHANNEL_DISPLAY,
    label: "جزئیات کانال",
    parent: "/dashboard/portal/channels",
  },
  {
    path: withId("/dashboard/portal/channels/edit"),
    element: ChannelCreate,
    permission: Permission.Channel_Update,
    showInMenu: false,
    name: VIEWNAME.CHANNEL_EDIT,
    label: "ویرایش کانال",
    parent: "/dashboard/portal/channels",
  },

  // ================================
  // 🏙️ City
  // ================================
  {
    path: "/dashboard/portal/cities",
    label: "شهرها",
    icon: <MapPin size={18} />,
    element: CityPage,
    parent: "/dashboard/portal",
    permission: Permission.City_Read,
    showInMenu: true,
    name: VIEWNAME.CITIES,
  },
  {
    path: "/dashboard/portal/cities/create",
    element: CityCreate,
    permission: Permission.City_Create,
    showInMenu: false,
    name: VIEWNAME.CITY_CREATE,
    label: "ایجاد شهر",
    parent: "/dashboard/portal/cities",
  },
  {
    path: withId("/dashboard/portal/cities"),
    element: CityDisplay,
    permission: Permission.City_Read,
    showInMenu: false,
    name: VIEWNAME.CITY_DISPLAY,
    label: "جزئیات شهر",
    parent: "/dashboard/portal/cities",
  },
  {
    path: withId("/dashboard/portal/cities/edit"),
    element: CityCreate,
    permission: Permission.City_Update,
    showInMenu: false,
    name: VIEWNAME.CITY_EDIT,
    label: "ویرایش شهر",
    parent: "/dashboard/portal/cities",
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
    icon: <Hash size={18} />,
    element: KeywordPage,
    parent: "/dashboard/portal",
    permission: Permission.Keyword_Read,
    showInMenu: true,
    name: VIEWNAME.KEYWORDS,
  },
  {
    path: "/dashboard/portal/keywords/create",
    element: KeywordCreate,
    permission: Permission.Keyword_Create,
    showInMenu: false,
    name: VIEWNAME.KEYWORD_CREATE,
    label: "ایجاد کلمه کلیدی",
    parent: "/dashboard/portal/keywords",
  },
  {
    path: withId("/dashboard/portal/keywords"),
    element: KeywordDisplay,
    permission: Permission.Keyword_Read,
    showInMenu: false,
    name: VIEWNAME.KEYWORD_DISPLAY,
    label: "جزئیات کلمه کلیدی",
    parent: "/dashboard/portal/keywords",
  },
  {
    path: withId("/dashboard/portal/keywords/edit"),
    element: KeywordCreate,
    permission: Permission.Keyword_Update,
    showInMenu: false,
    name: VIEWNAME.KEYWORD_EDIT,
    label: "ویرایش کلمه کلیدی",
    parent: "/dashboard/portal/keywords",
  },

  // ================================
  // 🌐 MessagingPlatform
  // ================================
  {
    path: "/dashboard/portal/platforms",
    label: "پلتفرم‌ها",
    icon: <Globe size={18} />,
    element: MessagingPlatformPage,
    parent: "/dashboard/portal",
    permission: Permission.MessagingPlatform_Read,
    showInMenu: true,
    name: VIEWNAME.PLATFORMS,
  },
  {
    path: "/dashboard/portal/platforms/create",
    element: MessagingPlatformCreate,
    permission: Permission.MessagingPlatform_Create,
    showInMenu: false,
    name: VIEWNAME.PLATFORM_CREATE,
    label: "ایجاد پلتفرم",
    parent: "/dashboard/portal/platforms",
  },
  {
    path: withId("/dashboard/portal/platforms"),
    element: MessagingPlatformDisplay,
    permission: Permission.MessagingPlatform_Read,
    showInMenu: false,
    name: VIEWNAME.PLATFORM_DISPLAY,
    label: "جزئیات پلتفرم",
    parent: "/dashboard/portal/platforms",
  },
  {
    path: withId("/dashboard/portal/platforms/edit"),
    element: MessagingPlatformCreate,
    permission: Permission.MessagingPlatform_Update,
    showInMenu: false,
    name: VIEWNAME.PLATFORM_EDIT,
    label: "ویرایش پلتفرم",
    parent: "/dashboard/portal/platforms",
  },

  // ================================
  // 👤 Person
  // ================================
  {
    path: "/dashboard/portal/persons",
    label: "اشخاص",
    icon: <Users size={18} />,
    element: PersonPage,
    parent: "/dashboard/portal",
    permission: Permission.Person_Read,
    showInMenu: true,
    name: VIEWNAME.PERSONS,
  },
  {
    path: "/dashboard/portal/persons/create",
    element: PersonCreate,
    permission: Permission.Person_Create,
    showInMenu: false,
    name: VIEWNAME.PERSON_CREATE,
    label: "ایجاد شخص",
    parent: "/dashboard/portal/persons",
  },
  {
    path: withId("/dashboard/portal/persons"),
    element: PersonDisplay,
    permission: Permission.Person_Read,
    showInMenu: false,
    name: VIEWNAME.PERSON_DISPLAY,
    label: "جزئیات شخص",
    parent: "/dashboard/portal/persons",
  },
  {
    path: withId("/dashboard/portal/persons/edit"),
    element: PersonCreate,
    permission: Permission.Person_Update,
    showInMenu: false,
    name: VIEWNAME.PERSON_EDIT,
    label: "ویرایش شخص",
    parent: "/dashboard/portal/persons",
  },

  // ================================
  // 🗃️ DashboardData
  // ================================
  {
    path: "/dashboard/portal/data",
    label: "داده‌های داشبورد",
    icon: <NotebookPen size={18} />,
    element: DashboardDataPage,
    parent: "/dashboard/portal",
    permission: Permission.DashboardData_Read,
    showInMenu: false,
    name: VIEWNAME.DASHBOARD_DATA,
  },
  {
    path: "/dashboard/portal/data/create",
    element: DashboardDataCreate,
    permission: Permission.DashboardData_Create,
    showInMenu: false,
    name: VIEWNAME.DASHBOARD_DATA_CREATE,
    label: "ایجاد داده",
    parent: "/dashboard/portal/data",
  },
  {
    path: withId("/dashboard/portal/data"),
    element: DashboardDataDisplay,
    permission: Permission.DashboardData_Read,
    showInMenu: false,
    name: VIEWNAME.DASHBOARD_DATA_DISPLAY,
    label: "جزئیات داده",
    parent: "/dashboard/portal/data",
  },
  {
    path: withId("/dashboard/portal/data/edit"),
    element: DashboardDataCreate,
    permission: Permission.DashboardData_Update,
    showInMenu: false,
    name: VIEWNAME.DASHBOARD_DATA_EDIT,
    label: "ویرایش داده",
    parent: "/dashboard/portal/data",
  },

  // ================================
  // 🔗 UserChannel
  // ================================
  {
    path: "/dashboard/portal/user-channels",
    label: "کاربران کانال",
    icon: <UserCheck size={18} />,
    element: UserChannelPage,
    parent: "/dashboard/portal",
    permission: Permission.UserChannel_Read,
    showInMenu: true,
    name: VIEWNAME.USER_CHANNELS,
  },
  {
    path: "/dashboard/portal/user-channels/create",
    element: UserChannelCreate,
    permission: Permission.UserChannel_Create,
    showInMenu: false,
    name: VIEWNAME.USER_CHANNEL_CREATE,
    label: "ایجاد کاربر-کانال",
    parent: "/dashboard/portal/user-channels",
  },
  {
    path: withId("/dashboard/portal/user-channels"),
    element: UserChannelDisplay,
    permission: Permission.UserChannel_Read,
    showInMenu: false,
    name: VIEWNAME.USER_CHANNEL_DISPLAY,
    label: "جزئیات کاربر-کانال",
    parent: "/dashboard/portal/user-channels",
  },
  {
    path: withId("/dashboard/portal/user-channels/edit"),
    element: UserChannelCreate,
    permission: Permission.UserChannel_Update,
    showInMenu: false,
    name: VIEWNAME.USER_CHANNEL_EDIT,
    label: "ویرایش کاربر-کانال",
    parent: "/dashboard/portal/user-channels",
  },

  // ================================
  // 🎯 KeywordMatch
  // ================================
  {
    path: "/dashboard/portal/keyword-matches",
    label: "تطابق‌های کلمات",
    icon: <Database size={18} />,
    element: KeywordMatchPage,
    parent: "/dashboard/portal",
    permission: Permission.KeywordMatch_Read,
    showInMenu: true,
    name: VIEWNAME.KEYWORD_MATCHES,
  },
  {
    path: "/dashboard/portal/keyword-matches/create",
    element: KeywordMatchCreate,
    permission: Permission.KeywordMatch_Create,
    showInMenu: false,
    name: VIEWNAME.KEYWORD_MATCH_CREATE,
    label: "ایجاد تطابق",
    parent: "/dashboard/portal/keyword-matches",
  },
  {
    path: withId("/dashboard/portal/keyword-matches"),
    element: KeywordMatchDisplay,
    permission: Permission.KeywordMatch_Read,
    showInMenu: false,
    name: VIEWNAME.KEYWORD_MATCH_DISPLAY,
    label: "جزئیات تطابق",
    parent: "/dashboard/portal/keyword-matches",
  },
  {
    path: withId("/dashboard/portal/keyword-matches/edit"),
    element: KeywordMatchCreate,
    permission: Permission.KeywordMatch_Update,
    showInMenu: false,
    name: VIEWNAME.KEYWORD_MATCH_EDIT,
    label: "ویرایش تطابق",
    parent: "/dashboard/portal/keyword-matches",
  },
];
