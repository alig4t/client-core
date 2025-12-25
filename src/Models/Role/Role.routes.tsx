import { lazy } from "react";
import { Shield } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";

const RolePage = lazy(() => import("./RolePage"));
const RoleCreate = lazy(() => import("./RoleCreate"));
const RoleDisplay = lazy(() => import("./RoleDisplay"));

export const RoleRoutes: RouteConfig[] = [
  // List Page
  {
    path: "/dashboard/portal/roles",
    label: "نقش ها",
    icon: <Shield size={18} />,
    element: RolePage,
    parent: "/dashboard/portal",
    permission: Permission.Role_Read,
    showInMenu: true,
    name: VIEWNAME.ROLE_SEARCH,
  },
  // Create Page
  {
    path: "/dashboard/portal/roles/create",
    element: RoleCreate,
    permission: Permission.Role_Create,
    showInMenu: false,
    name: VIEWNAME.ROLE_CREATE,
    label: "ایجاد نقش",
    parent: "/dashboard/portal/roles",
  },
  // Display Page
  {
    path: "/dashboard/portal/roles/:id",
    element: RoleDisplay,
    permission: Permission.Role_Read,
    showInMenu: false,
    name: VIEWNAME.ROLE_DISPLAY,
    label: "جزئیات نقش",
    parent: "/dashboard/portal/roles",
  },
  // Edit Page
  {
    path: "/dashboard/portal/roles/:id/edit",
    element: RoleCreate,
    permission: Permission.Role_Update,
    showInMenu: false,
    name: VIEWNAME.ROLE_EDIT,
    label: "ویرایش نقش",
    parent: "/dashboard/portal/roles",
  },
];
