import { lazy } from "react";
import { MessageSquare } from "lucide-react";
import type { RouteConfig } from "@/router/path.types";
import { ChannelDefinition } from "./Channel.definition";
import { CHANNEL_VIEWNAMES } from "./Channel.viewnames";
const Page = lazy(() => import("../ChannelPage"));
const Create = lazy(() => import("../ChannelCreate"));
const Display = lazy(() => import("../ChannelDisplay"));
const definition = ChannelDefinition;
export const ChannelRoutes: RouteConfig[] = [
  {
    path: "/dashboard/portal/channels",
    label: "کانال‌ها",
    icon: <MessageSquare size={18} />,
    element: Page,
    parent: "/dashboard/portal",
    permission: definition.permissions?.read,
    showInMenu: true,
    menuOrder: 10,
    name: CHANNEL_VIEWNAMES.CHANNEL_SEARCH,
  },
  {
    path: "/dashboard/portal/channels/create",
    label: "ایجاد کانال",
    element: Create,
    parent: "/dashboard/portal/channels",
    permission: definition.permissions?.create,
    name: CHANNEL_VIEWNAMES.CHANNEL_CREATE,
  },
  {
    path: "/dashboard/portal/channels/:id",
    label: "جزئیات کانال",
    element: Display,
    parent: "/dashboard/portal/channels",
    permission: definition.permissions?.read,
    name: CHANNEL_VIEWNAMES.CHANNEL_DISPLAY,
  },
  {
    path: "/dashboard/portal/channels/:id/edit",
    label: "ویرایش کانال",
    element: Create,
    parent: "/dashboard/portal/channels",
    permission: definition.permissions?.update,
    name: CHANNEL_VIEWNAMES.CHANNEL_EDIT,
  },
];
