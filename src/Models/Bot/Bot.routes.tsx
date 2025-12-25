import { lazy } from "react";
import { Bot } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";

const BotPage = lazy(() => import("./BotPage"));
const BotCreate = lazy(() => import("./BotCreate"));
const BotDisplay = lazy(() => import("./BotDisplay"));

export const BotRoutes: RouteConfig[] = [
  // List Page
  {
    path: "/dashboard/portal/bots",
    label: "ربات‌ها",
    icon: <Bot size={18} />,
    element: BotPage,
    parent: "/dashboard/portal",
    permission: Permission.Bot_Read,
    showInMenu: true,
    name: VIEWNAME.BOT_SEARCH,
  },
  // Create Page
  {
    path: "/dashboard/portal/bots/create",
    element: BotCreate,
    permission: Permission.Bot_Create,
    showInMenu: false,
    name: VIEWNAME.BOT_CREATE,
    label: "ایجاد ربات",
    parent: "/dashboard/portal/bots",
  },
  // Display Page
  {
    path: "/dashboard/portal/bots/:id",
    element: BotDisplay,
    permission: Permission.Bot_Read,
    showInMenu: false,
    name: VIEWNAME.BOT_DISPLAY,
    label: "جزئیات ربات",
    parent: "/dashboard/portal/bots",
  },
  // Edit Page
  {
    path: "/dashboard/portal/bots/:id/edit",
    element: BotCreate,
    permission: Permission.Bot_Update,
    showInMenu: false,
    name: VIEWNAME.BOT_EDIT,
    label: "ویرایش ربات",
    parent: "/dashboard/portal/bots",
  },
];
