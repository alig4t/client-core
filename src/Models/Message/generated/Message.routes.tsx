import { lazy } from "react";
import { MessageCircle } from "lucide-react";
import type { RouteConfig } from "@/router/path.types";
import { MessageDefinition } from "./Message.definition";
import { MESSAGE_VIEWNAMES } from "./Message.viewnames";
const Page = lazy(() => import("../MessagePage"));
const Create = lazy(() => import("../MessageCreate"));
const Display = lazy(() => import("../MessageDisplay"));
const definition = MessageDefinition;
export const MessageRoutes: RouteConfig[] = [
  {
    path: "/dashboard/portal/messages",
    label: "پیام‌ها",
    icon: <MessageCircle size={18} />,
    element: Page,
    parent: "/dashboard/portal",
    permission: definition.permissions?.read,
    showInMenu: true,
    menuOrder: 40,
    name: MESSAGE_VIEWNAMES.MESSAGE_SEARCH,
  },
  {
    path: "/dashboard/portal/messages/create",
    label: "ایجاد پیام",
    element: Create,
    parent: "/dashboard/portal/messages",
    permission: definition.permissions?.create,
    name: MESSAGE_VIEWNAMES.MESSAGE_CREATE,
  },
  {
    path: "/dashboard/portal/messages/:id",
    label: "جزئیات پیام",
    element: Display,
    parent: "/dashboard/portal/messages",
    permission: definition.permissions?.read,
    name: MESSAGE_VIEWNAMES.MESSAGE_DISPLAY,
  },
  {
    path: "/dashboard/portal/messages/:id/edit",
    label: "ویرایش پیام",
    element: Create,
    parent: "/dashboard/portal/messages",
    permission: definition.permissions?.update,
    name: MESSAGE_VIEWNAMES.MESSAGE_EDIT,
  },
];
