import type { RouteConfig } from "@/router/path.types";
import { Permission } from "@/router/Permission";
import { VIEWNAME } from "@/router/ViewName";
import { Globe } from "lucide-react";
import { lazy } from "react";

const MessagingPlatformPage = lazy(() => import("./MessagingPlatformPage"));
const MessagingPlatformCreate = lazy(() => import("./MessagingPlatformCreate"));
const MessagingPlatformDisplay = lazy(() => import("./MessagingPlatformDisplay"));


const localParent = '/dashboard/messaging/platforms'
const mainParent = '/dashboard/messaging'


export const MessagingPlatformRoutes: RouteConfig[] = [
  // List Page
  {
    path: localParent,
    label: "پلتفرم‌ها",
    icon: <Globe size={18} />,
    element: MessagingPlatformPage,
    parent: mainParent,
    permission: Permission.MessagingPlatform_Read,
    showInMenu: true,
    name: VIEWNAME.MESSAGING_PLATFORM_SEARCH,
  },
  // Create Page
  {
    path: `${localParent}/create`,
    element: MessagingPlatformCreate,
    permission: Permission.MessagingPlatform_Create,
    showInMenu: false,
    name: VIEWNAME.MESSAGING_PLATFORM_CREATE,
    label: "ایجاد پلتفرم پیام‌رسانی",
    parent: localParent,
  },
  // Display Page
  {
    path: `${localParent}/:id`,
    element: MessagingPlatformDisplay,
    permission: Permission.MessagingPlatform_Read,
    showInMenu: false,
    name: VIEWNAME.MESSAGING_PLATFORM_DISPLAY,
    label: "جزئیات پلتفرم پیام‌رسانی",
    parent: localParent,
  },
  // Edit Page
  {
    path: `${localParent}/:id/edit`,
    element: MessagingPlatformCreate,
    permission: Permission.MessagingPlatform_Update,
    showInMenu: false,
    name: VIEWNAME.MESSAGING_PLATFORM_EDIT,
    label: "ویرایش پلتفرم پیام‌رسانی",
    parent: localParent,
  },
];
