import { lazy } from "react";
import { NotebookPen } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";

const DashboardDataPage = lazy(() => import("./DashboardDataPage"));
const DashboardDataCreate = lazy(() => import("./DashboardDataCreate"));
const DashboardDataDisplay = lazy(() => import("./DashboardDataDisplay"));

export const DashboardDataRoutes: RouteConfig[] = [
  // List Page
  {
    path: "/dashboard/portal/dashboard-data",
    label: "داده‌های داشبورد",
    icon: <NotebookPen size={18} />,
    element: DashboardDataPage,
    parent: "/dashboard/portal",
    permission: Permission.DashboardData_Read,
    showInMenu: false,
    name: VIEWNAME.DASHBOARD_DATA,
  },
  // Create Page
  {
    path: "/dashboard/portal/dashboard-data/create",
    element: DashboardDataCreate,
    permission: Permission.DashboardData_Create,
    showInMenu: false,
    name: VIEWNAME.DASHBOARD_DATA_CREATE,
    label: "ایجاد داده داشبورد",
    parent: "/dashboard/portal/dashboard-data",
  },
  // Display Page
  {
    path: "/dashboard/portal/dashboard-data/:id",
    element: DashboardDataDisplay,
    permission: Permission.DashboardData_Read,
    showInMenu: false,
    name: VIEWNAME.DASHBOARD_DATA_DISPLAY,
    label: "جزئیات داده داشبورد",
    parent: "/dashboard/portal/dashboard-data",
  },
  // Edit Page
  {
    path: "/dashboard/portal/dashboard-data/:id/edit",
    element: DashboardDataCreate,
    permission: Permission.DashboardData_Update,
    showInMenu: false,
    name: VIEWNAME.DASHBOARD_DATA_EDIT,
    label: "ویرایش داده داشبورد",
    parent: "/dashboard/portal/dashboard-data",
  },
];
