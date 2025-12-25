import { lazy } from "react";
import { MessageCircle } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";

const MessagePage = lazy(() => import("./MessagePage"));
const MessageCreate = lazy(() => import("./MessageCreate"));
const MessageDisplay = lazy(() => import("./MessageDisplay"));

export const MessageRoutes: RouteConfig[] = [
  // List Page
  {
    path: "/dashboard/portal/messages",
    label: "پیام‌ها",
    icon: <MessageCircle size={18} />,
    element: MessagePage,
    parent: "/dashboard/portal",
    permission: Permission.Message_Read,
    showInMenu: true,
    name: VIEWNAME.MESSAGE_SEARCH,
  },
  // Create Page
  {
    path: "/dashboard/portal/messages/create",
    element: MessageCreate,
    permission: Permission.Message_Create,
    showInMenu: false,
    name: VIEWNAME.MESSAGE_CREATE,
    label: "ایجاد پیام",
    parent: "/dashboard/portal/messages",
  },
  // Display Page
  {
    path: "/dashboard/portal/messages/:id",
    element: MessageDisplay,
    permission: Permission.Message_Read,
    showInMenu: false,
    name: VIEWNAME.MESSAGE_DISPLAY,
    label: "جزئیات پیام",
    parent: "/dashboard/portal/messages",
  },
  // Edit Page
  {
    path: "/dashboard/portal/messages/:id/edit",
    element: MessageCreate,
    permission: Permission.Message_Update,
    showInMenu: false,
    name: VIEWNAME.MESSAGE_EDIT,
    label: "ویرایش پیام",
    parent: "/dashboard/portal/messages",
  },
];
