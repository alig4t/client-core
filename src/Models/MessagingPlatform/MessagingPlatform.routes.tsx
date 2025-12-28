import { lazy } from "react";
import { Globe } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";
import { ROUTE_PATHS } from "@/router/route.paths";

const MessagingPlatformPage = lazy(() => import("./MessagingPlatformPage"));
const MessagingPlatformCreate = lazy(() => import("./MessagingPlatformCreate"));
const MessagingPlatformDisplay = lazy(() => import("./MessagingPlatformDisplay"));

export const MessagingPlatformRoutes: RouteConfig[] = [
  // List Page
  {
    path: ROUTE_PATHS.PLATFORMS,
    label: "پلتفرم‌ها",
    icon: <Globe size={18} />,
    element: MessagingPlatformPage,
    parent: ROUTE_PATHS.MESSAGING,
    permission: Permission.MessagingPlatform_Read,
    showInMenu: true,
    name: VIEWNAME.MESSAGING_PLATFORM_SEARCH,
  },
  // Create Page
  {
    path: ROUTE_PATHS.PLATFORMS_CREATE,
    element: MessagingPlatformCreate,
    permission: Permission.MessagingPlatform_Create,
    showInMenu: false,
    name: VIEWNAME.MESSAGING_PLATFORM_CREATE,
    label: "ایجاد پلتفرم پیام‌رسانی",
    parent: ROUTE_PATHS.PLATFORMS,
  },
  // Display Page
  {
    path: ROUTE_PATHS.PLATFORMS_DISPLAY,
    element: MessagingPlatformDisplay,
    permission: Permission.MessagingPlatform_Read,
    showInMenu: false,
    name: VIEWNAME.MESSAGING_PLATFORM_DISPLAY,
    label: "جزئیات پلتفرم پیام‌رسانی",
    parent: ROUTE_PATHS.PLATFORMS,
  },
  // Edit Page
  {
    path: ROUTE_PATHS.PLATFORMS_EDIT,
    element: MessagingPlatformCreate,
    permission: Permission.MessagingPlatform_Update,
    showInMenu: false,
    name: VIEWNAME.MESSAGING_PLATFORM_EDIT,
    label: "ویرایش پلتفرم پیام‌رسانی",
    parent: ROUTE_PATHS.PLATFORMS,
  },
];
