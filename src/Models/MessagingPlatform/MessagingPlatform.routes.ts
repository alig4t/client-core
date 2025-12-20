import { lazy } from "react";
import { Globe } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";

const MessagingPlatformPage = lazy(() => import("./MessagingPlatformPage"));
const MessagingPlatformCreate = lazy(() => import("./MessagingPlatformCreate"));
const MessagingPlatformDisplay = lazy(() => import("./MessagingPlatformDisplay"));

export const MessagingPlatformRoutes: RouteConfig[] = [
  // List Page
  {
    path: "/dashboard/portal/platforms",
    label: "پلتفرم‌ها",
    icon: <Globe size={18} />,
    element: MessagingPlatformPage,
    parent: "/dashboard/portal",
    permission: Permission.MessagingPlatform_Read,
    showInMenu: true,
    name: VIEWNAME.MESSAGING_PLATFORMS,
  },
  // Create Page
  {
    path: "/dashboard/portal/platforms/create",
    element: MessagingPlatformCreate,
    permission: Permission.MessagingPlatform_Create,
    showInMenu: false,
    name: VIEWNAME.MESSAGING_PLATFORM_CREATE,
    label: "ایجاد پلتفرم پیام‌رسانی",
    parent: "/dashboard/portal/platforms",
  },
  // Display Page
  {
    path: "/dashboard/portal/platforms/:id",
    element: MessagingPlatformDisplay,
    permission: Permission.MessagingPlatform_Read,
    showInMenu: false,
    name: VIEWNAME.MESSAGING_PLATFORM_DISPLAY,
    label: "جزئیات پلتفرم پیام‌رسانی",
    parent: "/dashboard/portal/platforms",
  },
  // Edit Page
  {
    path: "/dashboard/portal/platforms/:id/edit",
    element: MessagingPlatformCreate,
    permission: Permission.MessagingPlatform_Update,
    showInMenu: false,
    name: VIEWNAME.MESSAGING_PLATFORM_EDIT,
    label: "ویرایش پلتفرم پیام‌رسانی",
    parent: "/dashboard/portal/platforms",
  },
];
