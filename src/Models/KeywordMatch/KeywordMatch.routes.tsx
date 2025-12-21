import { lazy } from "react";
import { Database } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";

const KeywordMatchPage = lazy(() => import("./KeywordMatchPage"));
const KeywordMatchCreate = lazy(() => import("./KeywordMatchCreate"));
const KeywordMatchDisplay = lazy(() => import("./KeywordMatchDisplay"));

export const KeywordMatchRoutes: RouteConfig[] = [
  // List Page
  {
    path: "/dashboard/portal/keyword-matches",
    label: "تطابق‌های کلمات",
    icon: <Database size={18} />,
    element: KeywordMatchPage,
    parent: "/dashboard/portal",
    permission: Permission.KeywordMatch_Read,
    showInMenu: true,
    name: VIEWNAME.KEYWORD_MATCH_SEARCH,
  },
  // Create Page
  {
    path: "/dashboard/portal/keyword-matches/create",
    element: KeywordMatchCreate,
    permission: Permission.KeywordMatch_Create,
    showInMenu: false,
    name: VIEWNAME.KEYWORD_MATCH_CREATE,
    label: "ایجاد تطابق کلمه کلیدی",
    parent: "/dashboard/portal/keyword-matches",
  },
  // Display Page
  {
    path: "/dashboard/portal/keyword-matches/:id",
    element: KeywordMatchDisplay,
    permission: Permission.KeywordMatch_Read,
    showInMenu: false,
    name: VIEWNAME.KEYWORD_MATCH_DISPLAY,
    label: "جزئیات تطابق کلمه کلیدی",
    parent: "/dashboard/portal/keyword-matches",
  },
  // Edit Page
  {
    path: "/dashboard/portal/keyword-matches/:id/edit",
    element: KeywordMatchCreate,
    permission: Permission.KeywordMatch_Update,
    showInMenu: false,
    name: VIEWNAME.KEYWORD_MATCH_EDIT,
    label: "ویرایش تطابق کلمه کلیدی",
    parent: "/dashboard/portal/keyword-matches",
  },
];
