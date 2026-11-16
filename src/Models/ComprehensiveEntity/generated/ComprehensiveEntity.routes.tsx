import { lazy } from "react";
import { Code } from "lucide-react";
import type { RouteConfig } from "@/router/path.types";
import { ComprehensiveEntityDefinition } from "./ComprehensiveEntity.definition";
import { COMPREHENSIVE_ENTITY_VIEWNAMES } from "./ComprehensiveEntity.viewnames";
const Page = lazy(() => import("../ComprehensiveEntityPage"));
const Create = lazy(() => import("../ComprehensiveEntityCreate"));
const Display = lazy(() => import("../ComprehensiveEntityDisplay"));
const definition = ComprehensiveEntityDefinition;
export const ComprehensiveEntityRoutes: RouteConfig[] = [
  {
    path: "/dashboard/portal/comprehensive",
    label: "ترکیبی‌ها",
    icon: <Code size={18} />,
    element: Page,
    parent: "/dashboard/portal",
    permission: definition.permissions?.read,
    showInMenu: true,
    menuOrder: 99,
    name: COMPREHENSIVE_ENTITY_VIEWNAMES.COMPREHENSIVE_ENTITY_SEARCH,
  },
  {
    path: "/dashboard/portal/comprehensive/create",
    label: "ایجاد ترکیبی",
    element: Create,
    parent: "/dashboard/portal/comprehensive",
    permission: definition.permissions?.create,
    name: COMPREHENSIVE_ENTITY_VIEWNAMES.COMPREHENSIVE_ENTITY_CREATE,
  },
  {
    path: "/dashboard/portal/comprehensive/:id",
    label: "جزئیات ترکیبی",
    element: Display,
    parent: "/dashboard/portal/comprehensive",
    permission: definition.permissions?.read,
    name: COMPREHENSIVE_ENTITY_VIEWNAMES.COMPREHENSIVE_ENTITY_DISPLAY,
  },
  {
    path: "/dashboard/portal/comprehensive/:id/edit",
    label: "ویرایش ترکیبی",
    element: Create,
    parent: "/dashboard/portal/comprehensive",
    permission: definition.permissions?.update,
    name: COMPREHENSIVE_ENTITY_VIEWNAMES.COMPREHENSIVE_ENTITY_EDIT,
  },
];
