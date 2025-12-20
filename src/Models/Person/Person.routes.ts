import { lazy } from "react";
import { Users } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";

const PersonPage = lazy(() => import("./PersonPage"));
const PersonCreate = lazy(() => import("./PersonCreate"));
const PersonDisplay = lazy(() => import("./PersonDisplay"));

export const PersonRoutes: RouteConfig[] = [
  // List Page
  {
    path: "/dashboard/portal/persons",
    label: "اشخاص",
    icon: <Users size={18} />,
    element: PersonPage,
    parent: "/dashboard/portal",
    permission: Permission.Person_Read,
    showInMenu: true,
    name: VIEWNAME.PERSONS,
  },
  // Create Page
  {
    path: "/dashboard/portal/persons/create",
    element: PersonCreate,
    permission: Permission.Person_Create,
    showInMenu: false,
    name: VIEWNAME.PERSON_CREATE,
    label: "ایجاد شخص",
    parent: "/dashboard/portal/persons",
  },
  // Display Page
  {
    path: "/dashboard/portal/persons/:id",
    element: PersonDisplay,
    permission: Permission.Person_Read,
    showInMenu: false,
    name: VIEWNAME.PERSON_DISPLAY,
    label: "جزئیات شخص",
    parent: "/dashboard/portal/persons",
  },
  // Edit Page
  {
    path: "/dashboard/portal/persons/:id/edit",
    element: PersonCreate,
    permission: Permission.Person_Update,
    showInMenu: false,
    name: VIEWNAME.PERSON_EDIT,
    label: "ویرایش شخص",
    parent: "/dashboard/portal/persons",
  },
];
