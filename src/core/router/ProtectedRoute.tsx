import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { findMatchingRoute } from "./matchRoute";
import type { RouteConfig } from "./types";
export default function ProtectedRoute({
  isAuthenticated,
  can,
  routes,
  loginPath = "/login",
  forbidden = <p role="alert">اجازه دسترسی وجود ندارد</p>,
}: {
  isAuthenticated: boolean;
  can: (permission: string) => boolean;
  routes: RouteConfig[];
  loginPath?: string;
  forbidden?: ReactNode;
}) {
  const location = useLocation();
  if (!isAuthenticated)
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  const route = findMatchingRoute(routes, location.pathname);
  return route?.permission && !can(route.permission) ? forbidden : <Outlet />;
}
