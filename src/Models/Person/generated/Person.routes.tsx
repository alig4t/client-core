import { lazy } from "react";
import { Users } from "lucide-react";
import type { RouteConfig } from "@/router/path.types";
import { PersonDefinition } from "./Person.definition";
import { PERSON_VIEWNAMES } from "./Person.viewnames";
const Page = lazy(() => import("../PersonPage"));
const Create = lazy(() => import("../PersonCreate"));
const Display = lazy(() => import("../PersonDisplay"));
const definition = PersonDefinition;
export const PersonRoutes: RouteConfig[] = [
  {
    path: "/dashboard/portal/persons",
    label: "اشخاص",
    icon: <Users size={18} />,
    element: Page,
    parent: "/dashboard/portal",
    permission: definition.permissions?.read,
    showInMenu: true,
    menuOrder: 60,
    name: PERSON_VIEWNAMES.PERSON_SEARCH,
  },
  {
    path: "/dashboard/portal/persons/create",
    label: "ایجاد شخص",
    element: Create,
    parent: "/dashboard/portal/persons",
    permission: definition.permissions?.create,
    name: PERSON_VIEWNAMES.PERSON_CREATE,
  },
  {
    path: "/dashboard/portal/persons/:id",
    label: "جزئیات شخص",
    element: Display,
    parent: "/dashboard/portal/persons",
    permission: definition.permissions?.read,
    name: PERSON_VIEWNAMES.PERSON_DISPLAY,
  },
  {
    path: "/dashboard/portal/persons/:id/edit",
    label: "ویرایش شخص",
    element: Create,
    parent: "/dashboard/portal/persons",
    permission: definition.permissions?.update,
    name: PERSON_VIEWNAMES.PERSON_EDIT,
  },
];
