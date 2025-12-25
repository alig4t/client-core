import { lazy } from "react";
import { User } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";

const UserPage = lazy(() => import("./UserPage"));
const UserCreate = lazy(() => import("./UserCreate"));
const UserDisplay = lazy(() => import("./UserDisplay"));

export const UserRoutes: RouteConfig[] = [
  // List Page
  {
    path: "/dashboard/portal/users",
    label: "کاربران",
    icon: <User size={18} />,
    element: UserPage,
    parent: "/dashboard/portal",
    permission: Permission.User_Read,
    showInMenu: true,
    name: VIEWNAME.USER_SEARCH,
  },
  // Create Page
  {
    path: "/dashboard/portal/users/create",
    element: UserCreate,
    permission: Permission.User_Create,
    showInMenu: false,
    name: VIEWNAME.USER_CREATE,
    label: "ایجاد کاربر",
    parent: "/dashboard/portal/users",
  },
  // Display Page
  {
    path: "/dashboard/portal/users/:id",
    element: UserDisplay,
    permission: Permission.User_Read,
    showInMenu: false,
    name: VIEWNAME.USER_DISPLAY,
    label: "جزئیات کاربر",
    parent: "/dashboard/portal/users",
  },
  // Edit Page
  {
    path: "/dashboard/portal/users/:id/edit",
    element: UserCreate,
    permission: Permission.User_Update,
    showInMenu: false,
    name: VIEWNAME.USER_EDIT,
    label: "ویرایش کاربر",
    parent: "/dashboard/portal/users",
  },
];
