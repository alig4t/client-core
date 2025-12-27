import { lazy } from "react";
import { MessageSquare } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";

const ChannelPage = lazy(() => import("./ChannelPage"));
const ChannelCreate = lazy(() => import("./ChannelCreate"));
const ChannelDisplay = lazy(() => import("./ChannelDisplay"));
const ChannelApprove = lazy(() => import("./ChannelApprove"));

export const ChannelRoutes: RouteConfig[] = [
  // List Page
  {
    path: "/dashboard/portal/channels",
    label: "کانال‌ها",
    icon: <MessageSquare size={18} />,
    element: ChannelPage,
    parent: "/dashboard/portal",
    permission: Permission.Channel_Read,
    showInMenu: true,
    name: VIEWNAME.CHANNEL_SEARCH,
  },
  // Create Page
  {
    path: "/dashboard/portal/channels/create",
    element: ChannelCreate,
    permission: Permission.Channel_Create,
    showInMenu: false,
    name: VIEWNAME.CHANNEL_CREATE,
    label: "ایجاد کانال",
    parent: "/dashboard/portal/channels",
  },
  // Display Page
  {
    path: "/dashboard/portal/channels/:id",
    element: ChannelDisplay,
    permission: Permission.Channel_Read,
    showInMenu: false,
    name: VIEWNAME.CHANNEL_DISPLAY,
    label: "جزئیات کانال",
    parent: "/dashboard/portal/channels",
  },
  // Edit Page
  {
    path: "/dashboard/portal/channels/:id/edit",
    element: ChannelCreate,
    permission: Permission.Channel_Update,
    showInMenu: false,
    name: VIEWNAME.CHANNEL_EDIT,
    label: "ویرایش کانال",
    parent: "/dashboard/portal/channels",
  },
  //approve

    {
    path: "/dashboard/portal/channels/approve",
    label: "تایید کانال",
    icon: <MessageSquare size={18} />,
    element: ChannelApprove,
    parent: "/dashboard/portal",
    permission: Permission.Channel_Read,
    showInMenu: true,
    name: VIEWNAME.CHANNEL_SEARCH,
  },

];
