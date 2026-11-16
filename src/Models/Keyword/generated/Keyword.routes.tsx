import { lazy } from "react";
import { Hash } from "lucide-react";
import type { RouteConfig } from "@/router/path.types";
import { KeywordDefinition } from "./Keyword.definition";
import { KEYWORD_VIEWNAMES } from "./Keyword.viewnames";
const Page = lazy(() => import("../KeywordPage"));
const Create = lazy(() => import("../KeywordCreate"));
const Display = lazy(() => import("../KeywordDisplay"));
const definition = KeywordDefinition;
export const KeywordRoutes: RouteConfig[] = [
  {
    path: "/dashboard/portal/keywords",
    label: "کلمات کلیدی",
    icon: <Hash size={18} />,
    element: Page,
    parent: "/dashboard/portal",
    permission: definition.permissions?.read,
    showInMenu: true,
    menuOrder: 40,
    name: KEYWORD_VIEWNAMES.KEYWORD_SEARCH,
  },
  {
    path: "/dashboard/portal/keywords/create",
    label: "ایجاد کلمه کلیدی",
    element: Create,
    parent: "/dashboard/portal/keywords",
    permission: definition.permissions?.create,
    name: KEYWORD_VIEWNAMES.KEYWORD_CREATE,
  },
  {
    path: "/dashboard/portal/keywords/:id",
    label: "جزئیات کلمه کلیدی",
    element: Display,
    parent: "/dashboard/portal/keywords",
    permission: definition.permissions?.read,
    name: KEYWORD_VIEWNAMES.KEYWORD_DISPLAY,
  },
  {
    path: "/dashboard/portal/keywords/:id/edit",
    label: "ویرایش کلمه کلیدی",
    element: Create,
    parent: "/dashboard/portal/keywords",
    permission: definition.permissions?.update,
    name: KEYWORD_VIEWNAMES.KEYWORD_EDIT,
  },
];
