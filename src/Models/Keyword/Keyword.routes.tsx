import { lazy } from "react";
import { Hash } from "lucide-react";
import { VIEWNAME } from "@/router/ViewName";
import { Permission } from "@/router/Permission";
import type { RouteConfig } from "@/router/path.types";

const KeywordPage = lazy(() => import("./KeywordPage"));
const KeywordCreate = lazy(() => import("./KeywordCreate"));
const KeywordDisplay = lazy(() => import("./KeywordDisplay"));

export const KeywordRoutes: RouteConfig[] = [
  // List Page
  {
    path: "/dashboard/portal/keywords",
    label: "کلمات کلیدی",
    icon: <Hash size={18} />,
    element: KeywordPage,
    parent: "/dashboard/portal",
    permission: Permission.Keyword_Read,
    showInMenu: true,
    name: VIEWNAME.KEYWORD,
  },
  // Create Page
  {
    path: "/dashboard/portal/keywords/create",
    element: KeywordCreate,
    permission: Permission.Keyword_Create,
    showInMenu: false,
    name: VIEWNAME.KEYWORD_CREATE,
    label: "ایجاد کلمه کلیدی",
    parent: "/dashboard/portal/keywords",
  },
  // Display Page
  {
    path: "/dashboard/portal/keywords/:id",
    element: KeywordDisplay,
    permission: Permission.Keyword_Read,
    showInMenu: false,
    name: VIEWNAME.KEYWORD_DISPLAY,
    label: "جزئیات کلمه کلیدی",
    parent: "/dashboard/portal/keywords",
  },
  // Edit Page
  {
    path: "/dashboard/portal/keywords/:id/edit",
    element: KeywordCreate,
    permission: Permission.Keyword_Update,
    showInMenu: false,
    name: VIEWNAME.KEYWORD_EDIT,
    label: "ویرایش کلمه کلیدی",
    parent: "/dashboard/portal/keywords",
  },
];
