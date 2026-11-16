import { lazy } from "react";
import { Globe } from "lucide-react";
import type { RouteConfig } from "@/router/path.types";
import { MessagingPlatformDefinition } from "./MessagingPlatform.definition";
import { MESSAGING_PLATFORM_VIEWNAMES } from "./MessagingPlatform.viewnames";
const Page = lazy(() => import("../MessagingPlatformPage"));
const Create = lazy(() => import("../MessagingPlatformCreate"));
const Display = lazy(() => import("../MessagingPlatformDisplay"));
const definition = MessagingPlatformDefinition;
export const MessagingPlatformRoutes: RouteConfig[] = [
  {
    path: "/dashboard/portal/platforms",
    label: "پلتفرم‌ها",
    icon: <Globe size={18} />,
    element: Page,
    parent: "/dashboard/portal",
    permission: definition.permissions?.read,
    showInMenu: true,
    menuOrder: 5,
    name: MESSAGING_PLATFORM_VIEWNAMES.MESSAGING_PLATFORM_SEARCH,
  },
  {
    path: "/dashboard/portal/platforms/create",
    label: "ایجاد پلتفرم پیام‌رسانی",
    element: Create,
    parent: "/dashboard/portal/platforms",
    permission: definition.permissions?.create,
    name: MESSAGING_PLATFORM_VIEWNAMES.MESSAGING_PLATFORM_CREATE,
  },
  {
    path: "/dashboard/portal/platforms/:id",
    label: "جزئیات پلتفرم پیام‌رسانی",
    element: Display,
    parent: "/dashboard/portal/platforms",
    permission: definition.permissions?.read,
    name: MESSAGING_PLATFORM_VIEWNAMES.MESSAGING_PLATFORM_DISPLAY,
  },
  {
    path: "/dashboard/portal/platforms/:id/edit",
    label: "ویرایش پلتفرم پیام‌رسانی",
    element: Create,
    parent: "/dashboard/portal/platforms",
    permission: definition.permissions?.update,
    name: MESSAGING_PLATFORM_VIEWNAMES.MESSAGING_PLATFORM_EDIT,
  },
];
