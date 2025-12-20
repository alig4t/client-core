import { lazy } from "react";
import { Code } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";

const ComprehensiveEntityPage = lazy(() => import("./ComprehensiveEntityPage"));
const ComprehensiveEntityCreate = lazy(() => import("./ComprehensiveEntityCreate"));
const ComprehensiveEntityDisplay = lazy(() => import("./ComprehensiveEntityDisplay"));

export const ComprehensiveEntityRoutes: RouteConfig[] = [
  // List Page
  {
    path: "/dashboard/portal/comprehensive",
    label: "ترکیبی‌ها",
    icon: <Code size={18} />,
    element: ComprehensiveEntityPage,
    parent: "/dashboard/portal",
    permission: Permission.ComprehensiveEntity_Read,
    showInMenu: true,
    name: VIEWNAME.COMPREHENSIVE_ENTITY,
  },
  // Create Page
  {
    path: "/dashboard/portal/comprehensive/create",
    element: ComprehensiveEntityCreate,
    permission: Permission.ComprehensiveEntity_Create,
    showInMenu: false,
    name: VIEWNAME.COMPREHENSIVE_ENTITY_CREATE,
    label: "ایجاد ترکیبی",
    parent: "/dashboard/portal/comprehensive",
  },
  // Display Page
  {
    path: "/dashboard/portal/comprehensive/:id",
    element: ComprehensiveEntityDisplay,
    permission: Permission.ComprehensiveEntity_Read,
    showInMenu: false,
    name: VIEWNAME.COMPREHENSIVE_ENTITY_DISPLAY,
    label: "جزئیات ترکیبی",
    parent: "/dashboard/portal/comprehensive",
  },
  // Edit Page
  {
    path: "/dashboard/portal/comprehensive/:id/edit",
    element: ComprehensiveEntityCreate,
    permission: Permission.ComprehensiveEntity_Update,
    showInMenu: false,
    name: VIEWNAME.COMPREHENSIVE_ENTITY_EDIT,
    label: "ویرایش ترکیبی",
    parent: "/dashboard/portal/comprehensive",
  },
];
