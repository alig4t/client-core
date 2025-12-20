import { lazy } from "react";
import { UserCheck } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";

const UserChannelPage = lazy(() => import("./UserChannelPage"));
const UserChannelCreate = lazy(() => import("./UserChannelCreate"));
const UserChannelDisplay = lazy(() => import("./UserChannelDisplay"));

export const UserChannelRoutes: RouteConfig[] = [
  // List Page
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
  // Create Page
  {
    path: "/dashboard/portal/user-channels/create",
    element: UserChannelCreate,
    permission: Permission.UserChannel_Create,
    showInMenu: false,
    name: VIEWNAME.USER_CHANNEL_CREATE,
    label: "ایجاد کاربر-کانال",
    parent: "/dashboard/portal/user-channels",
  },
  // Display Page
  {
    path: "/dashboard/portal/user-channels/:id",
    element: UserChannelDisplay,
    permission: Permission.UserChannel_Read,
    showInMenu: false,
    name: VIEWNAME.USER_CHANNEL_DISPLAY,
    label: "جزئیات کاربر-کانال",
    parent: "/dashboard/portal/user-channels",
  },
  // Edit Page
  {
    path: "/dashboard/portal/user-channels/:id/edit",
    element: UserChannelCreate,
    permission: Permission.UserChannel_Update,
    showInMenu: false,
    name: VIEWNAME.USER_CHANNEL_EDIT,
    label: "ویرایش کاربر-کانال",
    parent: "/dashboard/portal/user-channels",
  },
];
