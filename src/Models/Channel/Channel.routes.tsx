import { lazy } from "react";
import { MessageSquare } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";
import { ROUTE_PATHS } from "@/router/route.paths";

const ChannelPage = lazy(() => import("./ChannelPage"));
const ChannelCreate = lazy(() => import("./ChannelCreate"));
const ChannelDisplay = lazy(() => import("./ChannelDisplay"));
const ChannelApprove = lazy(() => import("./ChannelApprove"));

export const ChannelRoutes: RouteConfig[] = [
  // List Page
  {
    path: ROUTE_PATHS.CHANNELS,
    label: "کانال‌ها",
    icon: <MessageSquare size={18} />,
    element: ChannelPage,
    parent: ROUTE_PATHS.MESSAGING,
    permission: Permission.Channel_Read,
    showInMenu: true,
    name: VIEWNAME.CHANNEL_SEARCH,
  },
  // Create Page
  {
    path: ROUTE_PATHS.CHANNELS_CREATE,
    element: ChannelCreate,
    permission: Permission.Channel_Create,
    showInMenu: false,
    name: VIEWNAME.CHANNEL_CREATE,
    label: "ایجاد کانال",
    parent: ROUTE_PATHS.CHANNELS,
  },
  // Display Page
  {
    path: ROUTE_PATHS.CHANNELS_DISPLAY,
    element: ChannelDisplay,
    permission: Permission.Channel_Read,
    showInMenu: false,
    name: VIEWNAME.CHANNEL_DISPLAY,
    label: "جزئیات کانال",
    parent: ROUTE_PATHS.CHANNELS,
  },
  // Edit Page
  {
    path: ROUTE_PATHS.CHANNELS_EDIT,
    element: ChannelCreate,
    permission: Permission.Channel_Update,
    showInMenu: false,
    name: VIEWNAME.CHANNEL_EDIT,
    label: "ویرایش کانال",
    parent: ROUTE_PATHS.CHANNELS,
  },
  //approve

    {
    path: ROUTE_PATHS.CHANNELS_APPROVE,
    label: "تایید کانال",
    icon: <MessageSquare size={18} />,
    element: ChannelApprove,
    parent: ROUTE_PATHS.MESSAGING,
    permission: Permission.Channel_Read,
    showInMenu: true,
    name: VIEWNAME.CHANNEL_SEARCH,
  },

];
