import { lazy } from "react";
import { UserCheck } from "lucide-react";
import type { RouteConfig } from "@/router/path.types";
import { UserChannelDefinition } from "./UserChannel.definition";
import { USER_CHANNEL_VIEWNAMES } from "./UserChannel.viewnames";
const Page = lazy(() => import("../UserChannelPage"));
const Create = lazy(() => import("../UserChannelCreate"));
const Display = lazy(() => import("../UserChannelDisplay"));
const definition = UserChannelDefinition;
export const UserChannelRoutes: RouteConfig[] = [
  {
    path: "/dashboard/portal/user-channels",
    label: "کاربران کانال",
    icon: <UserCheck size={18} />,
    element: Page,
    parent: "/dashboard/portal",
    permission: definition.permissions?.read,
    showInMenu: true,
    menuOrder: 70,
    name: USER_CHANNEL_VIEWNAMES.USER_CHANNEL_SEARCH,
  },
  {
    path: "/dashboard/portal/user-channels/create",
    label: "ایجاد کاربر-کانال",
    element: Create,
    parent: "/dashboard/portal/user-channels",
    permission: definition.permissions?.create,
    name: USER_CHANNEL_VIEWNAMES.USER_CHANNEL_CREATE,
  },
  {
    path: "/dashboard/portal/user-channels/:id",
    label: "جزئیات کاربر-کانال",
    element: Display,
    parent: "/dashboard/portal/user-channels",
    permission: definition.permissions?.read,
    name: USER_CHANNEL_VIEWNAMES.USER_CHANNEL_DISPLAY,
  },
  {
    path: "/dashboard/portal/user-channels/:id/edit",
    label: "ویرایش کاربر-کانال",
    element: Create,
    parent: "/dashboard/portal/user-channels",
    permission: definition.permissions?.update,
    name: USER_CHANNEL_VIEWNAMES.USER_CHANNEL_EDIT,
  },
];
