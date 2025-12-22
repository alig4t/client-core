import { lazy } from "react";
import { Users } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";

const UserPage = lazy(() => import("./UserPage"));
const UserCreate = lazy(() => import("./UserCreate"));
const UserDisplay = lazy(() => import("./UserDisplay"));

export const UserRoutes: RouteConfig[] = [
  // List Page
  {
    path: "/dashboard/portal/persons",
    label: "اشخاص",
    icon: <Users size={18} />,
    element: UserPage,
    parent: "/dashboard/portal",
    permission: Permission.User_Read,
    showInMenu: true,
    name: VIEWNAME.USER_SEARCH,
  },
  // Create Page
  {
    path: "/dashboard/portal/persons/create",
    element: UserCreate,
    permission: Permission.User_Create,
    showInMenu: false,
    name: VIEWNAME.USER_CREATE,
    label: "ایجاد شخص",
    parent: "/dashboard/portal/persons",
  },
  // Display Page
  {
    path: "/dashboard/portal/persons/:id",
    element: UserDisplay,
    permission: Permission.User_Read,
    showInMenu: false,
    name: VIEWNAME.USER_DISPLAY,
    label: "جزئیات شخص",
    parent: "/dashboard/portal/persons",
  },
  // Edit Page
  {
    path: "/dashboard/portal/persons/:id/edit",
    element: UserCreate,
    permission: Permission.User_Update,
    showInMenu: false,
    name: VIEWNAME.USER_EDIT,
    label: "ویرایش شخص",
    parent: "/dashboard/portal/persons",
  },
];
