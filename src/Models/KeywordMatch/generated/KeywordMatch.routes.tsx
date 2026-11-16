import { lazy } from "react";
import { Database } from "lucide-react";
import type { RouteConfig } from "@/router/path.types";
import { KeywordMatchDefinition } from "./KeywordMatch.definition";
import { KEYWORD_MATCH_VIEWNAMES } from "./KeywordMatch.viewnames";
const Page = lazy(() => import("../KeywordMatchPage"));
const Create = lazy(() => import("../KeywordMatchCreate"));
const Display = lazy(() => import("../KeywordMatchDisplay"));
const definition = KeywordMatchDefinition;
export const KeywordMatchRoutes: RouteConfig[] = [
  {
    path: "/dashboard/portal/keyword-matches",
    label: "تطابق‌های کلمات",
    icon: <Database size={18} />,
    element: Page,
    parent: "/dashboard/portal",
    permission: definition.permissions?.read,
    showInMenu: true,
    menuOrder: 50,
    name: KEYWORD_MATCH_VIEWNAMES.KEYWORD_MATCH_SEARCH,
  },
  {
    path: "/dashboard/portal/keyword-matches/create",
    label: "ایجاد تطابق کلمه کلیدی",
    element: Create,
    parent: "/dashboard/portal/keyword-matches",
    permission: definition.permissions?.create,
    name: KEYWORD_MATCH_VIEWNAMES.KEYWORD_MATCH_CREATE,
  },
  {
    path: "/dashboard/portal/keyword-matches/:id",
    label: "جزئیات تطابق کلمه کلیدی",
    element: Display,
    parent: "/dashboard/portal/keyword-matches",
    permission: definition.permissions?.read,
    name: KEYWORD_MATCH_VIEWNAMES.KEYWORD_MATCH_DISPLAY,
  },
  {
    path: "/dashboard/portal/keyword-matches/:id/edit",
    label: "ویرایش تطابق کلمه کلیدی",
    element: Create,
    parent: "/dashboard/portal/keyword-matches",
    permission: definition.permissions?.update,
    name: KEYWORD_MATCH_VIEWNAMES.KEYWORD_MATCH_EDIT,
  },
];
