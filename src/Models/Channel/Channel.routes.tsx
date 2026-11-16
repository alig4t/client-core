import type { RouteConfig } from "@/router/path.types";
import { Permission } from "@/router/Permission";
import { VIEWNAME } from "@/router/ViewName";
import { MessageSquare } from "lucide-react";
import { lazy } from "react";


const ChannelPage = lazy(() => import("./ChannelPage"));
const ChannelCreate = lazy(() => import("./ChannelCreate"));
const ChannelDisplay = lazy(() => import("./ChannelDisplay"));
const ChannelApprove = lazy(() => import("./ChannelApprove"));
const MYChannel = lazy(() => import("./OwnedCahnnel/OwnedChannelPage"));
const MYChannelDisplay = lazy(() => import("./OwnedCahnnel/OwnedChannelDisplay"));

const localParent = '/dashboard/messaging/channels'
const mainParent = '/dashboard/messaging'


export const ChannelRoutes: RouteConfig[] = [
  // List Page
  {
    path: localParent,
    label: "کانال‌ها",
    icon: <MessageSquare size={18} />,
    element: ChannelPage,
    parent: mainParent,
    permission: Permission.Channel_Read,
    showInMenu: true,
    name: VIEWNAME.CHANNEL_SEARCH,
  },
  // Create Page
  {
    path: `${localParent}/create`,
    element: ChannelCreate,
    permission: Permission.Channel_Create,
    showInMenu: false,
    name: VIEWNAME.CHANNEL_CREATE,
    label: "ایجاد کانال",
    parent: localParent,
  },
  // Display Page
  {
    path: `${localParent}/:id`,
    element: ChannelDisplay,
    permission: Permission.Channel_Read,
    showInMenu: false,
    name: VIEWNAME.CHANNEL_DISPLAY,
    label: "جزئیات کانال",
    parent: localParent,
  },
  // Edit Page
  {
    path: `${localParent}/:id/edit`,
    element: ChannelCreate,
    permission: Permission.Channel_Update,
    showInMenu: false,
    name: VIEWNAME.CHANNEL_EDIT,
    label: "ویرایش کانال",
    parent: localParent,
  },
  //approve

    {
    path: `${localParent}/approve`,
    label: "تایید کانال",
    icon: <MessageSquare size={18} />,
    element: ChannelApprove,
    parent: mainParent,
    permission: Permission.Channel_Read,
    showInMenu: true,
    name: VIEWNAME.CHANNEL_SEARCH,
  },

    {
    path: `${localParent}/my`,
    label: "کانال های من",
    icon: <MessageSquare size={18} />,
    element: MYChannel,
    parent: mainParent,
    permission: Permission.Channel_Read,
    showInMenu: true,
    name: VIEWNAME.CHANNEL_SEARCH,
  },

   {
    path: `${localParent}/my/:id`,
    element: MYChannelDisplay,
    permission: Permission.Channel_Read,
    showInMenu: false,
    name: VIEWNAME.OWNED_CHANNEL_DISPLAY,
    label: "جزئیات کانال",
    parent: localParent,
  },

];
