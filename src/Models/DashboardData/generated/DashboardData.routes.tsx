import { lazy } from "react";
import { NotebookPen } from "lucide-react";
import type { RouteConfig } from "@/router/path.types";
import { DashboardDataDefinition } from "./DashboardData.definition";
import { DASHBOARD_DATA_VIEWNAMES } from "./DashboardData.viewnames";
const Page = lazy(() => import("../DashboardDataPage"));
const Create = lazy(() => import("../DashboardDataCreate"));
const Display = lazy(() => import("../DashboardDataDisplay"));
const definition = DashboardDataDefinition;
export const DashboardDataRoutes: RouteConfig[] = [
  {
    path: "/dashboard/portal/dashboard-data",
    label: "داده‌های داشبورد",
    icon: <NotebookPen size={18} />,
    element: Page,
    parent: "/dashboard/portal",
    permission: definition.permissions?.read,
    showInMenu: false,
    menuOrder: 80,
    name: DASHBOARD_DATA_VIEWNAMES.DASHBOARD_DATA_SEARCH,
  },
  {
    path: "/dashboard/portal/dashboard-data/create",
    label: "ایجاد داده داشبورد",
    element: Create,
    parent: "/dashboard/portal/dashboard-data",
    permission: definition.permissions?.create,
    name: DASHBOARD_DATA_VIEWNAMES.DASHBOARD_DATA_CREATE,
  },
  {
    path: "/dashboard/portal/dashboard-data/:id",
    label: "جزئیات داده داشبورد",
    element: Display,
    parent: "/dashboard/portal/dashboard-data",
    permission: definition.permissions?.read,
    name: DASHBOARD_DATA_VIEWNAMES.DASHBOARD_DATA_DISPLAY,
  },
  {
    path: "/dashboard/portal/dashboard-data/:id/edit",
    label: "ویرایش داده داشبورد",
    element: Create,
    parent: "/dashboard/portal/dashboard-data",
    permission: definition.permissions?.update,
    name: DASHBOARD_DATA_VIEWNAMES.DASHBOARD_DATA_EDIT,
  },
];
