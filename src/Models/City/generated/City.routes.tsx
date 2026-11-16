import { lazy } from "react";
import { MapPin } from "lucide-react";
import type { RouteConfig } from "@/router/path.types";
import { CityDefinition } from "./City.definition";
import { CITY_VIEWNAMES } from "./City.viewnames";
const Page = lazy(() => import("../CityPage"));
const Create = lazy(() => import("../CityCreate"));
const Display = lazy(() => import("../CityDisplay"));
const definition = CityDefinition;
export const CityRoutes: RouteConfig[] = [
  {
    path: "/dashboard/portal/cities",
    label: "شهرها",
    icon: <MapPin size={18} />,
    element: Page,
    parent: "/dashboard/portal",
    permission: definition.permissions?.read,
    showInMenu: true,
    menuOrder: 30,
    name: CITY_VIEWNAMES.CITY_SEARCH,
  },
  {
    path: "/dashboard/portal/cities/create",
    label: "ایجاد شهر",
    element: Create,
    parent: "/dashboard/portal/cities",
    permission: definition.permissions?.create,
    name: CITY_VIEWNAMES.CITY_CREATE,
  },
  {
    path: "/dashboard/portal/cities/:id",
    label: "جزئیات شهر",
    element: Display,
    parent: "/dashboard/portal/cities",
    permission: definition.permissions?.read,
    name: CITY_VIEWNAMES.CITY_DISPLAY,
  },
  {
    path: "/dashboard/portal/cities/:id/edit",
    label: "ویرایش شهر",
    element: Create,
    parent: "/dashboard/portal/cities",
    permission: definition.permissions?.update,
    name: CITY_VIEWNAMES.CITY_EDIT,
  },
];
