import { lazy } from "react";
import { MapPin } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";

const CityPage = lazy(() => import("./CityPage"));
const CityCreate = lazy(() => import("./CityCreate"));
const CityDisplay = lazy(() => import("./CityDisplay"));

export const CityRoutes: RouteConfig[] = [
  // List Page
  {
    path: "/dashboard/portal/cities",
    label: "شهرها",
    icon: <MapPin size={18} />,
    element: CityPage,
    parent: "/dashboard/portal",
    permission: Permission.City_Read,
    showInMenu: true,
    name: VIEWNAME.CITY,
  },
  // Create Page
  {
    path: "/dashboard/portal/cities/create",
    element: CityCreate,
    permission: Permission.City_Create,
    showInMenu: false,
    name: VIEWNAME.CITY_CREATE,
    label: "ایجاد شهر",
    parent: "/dashboard/portal/cities",
  },
  // Display Page
  {
    path: "/dashboard/portal/cities/:id",
    element: CityDisplay,
    permission: Permission.City_Read,
    showInMenu: false,
    name: VIEWNAME.CITY_DISPLAY,
    label: "جزئیات شهر",
    parent: "/dashboard/portal/cities",
  },
  // Edit Page
  {
    path: "/dashboard/portal/cities/:id/edit",
    element: CityCreate,
    permission: Permission.City_Update,
    showInMenu: false,
    name: VIEWNAME.CITY_EDIT,
    label: "ویرایش شهر",
    parent: "/dashboard/portal/cities",
  },
];
