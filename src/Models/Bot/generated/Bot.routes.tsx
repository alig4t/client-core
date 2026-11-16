import { lazy } from "react";
import { Bot } from "lucide-react";
import type { RouteConfig } from "@/router/path.types";
import { BotDefinition } from "./Bot.definition";
import { BOT_VIEWNAMES } from "./Bot.viewnames";
const Page = lazy(() => import("../BotPage"));
const Create = lazy(() => import("../BotCreate"));
const Display = lazy(() => import("../BotDisplay"));
const definition = BotDefinition;
export const BotRoutes: RouteConfig[] = [
  {
    path: "/dashboard/portal/bots",
    label: "ربات‌ها",
    icon: <Bot size={18} />,
    element: Page,
    parent: "/dashboard/portal",
    permission: definition.permissions?.read,
    showInMenu: true,
    menuOrder: 20,
    name: BOT_VIEWNAMES.BOT_SEARCH,
  },
  {
    path: "/dashboard/portal/bots/create",
    label: "ایجاد ربات",
    element: Create,
    parent: "/dashboard/portal/bots",
    permission: definition.permissions?.create,
    name: BOT_VIEWNAMES.BOT_CREATE,
  },
  {
    path: "/dashboard/portal/bots/:id",
    label: "جزئیات ربات",
    element: Display,
    parent: "/dashboard/portal/bots",
    permission: definition.permissions?.read,
    name: BOT_VIEWNAMES.BOT_DISPLAY,
  },
  {
    path: "/dashboard/portal/bots/:id/edit",
    label: "ویرایش ربات",
    element: Create,
    parent: "/dashboard/portal/bots",
    permission: definition.permissions?.update,
    name: BOT_VIEWNAMES.BOT_EDIT,
  },
];
