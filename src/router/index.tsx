// src/routes/index.tsx
import { Suspense } from "react";
import type { RouteObject } from "react-router-dom";

import NotFoundPage from "@/components/NotFoundPage";
import Layout from "@/components/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import LazyFallbackElement from "./LazyFallbackElement";
import { routeConfig } from "./Routes"; // ✅ Without 'type'

const lazyFallback = <LazyFallbackElement />;

const buildRoutes = (routes: typeof routeConfig): RouteObject[] => {
  return routes.map((route) => {
    const element = route.element ? (
      <Suspense fallback={lazyFallback}>
        <route.element />
      </Suspense>
    ) : undefined;

    return {
      path: route.path,
      element,
      children: route.children ? buildRoutes(route.children) : undefined,
    };
  });
};

const publicRoutes = routeConfig.filter((r) => r.isPublic);
const protectedRoutes = routeConfig.filter((r) => !r.isPublic);

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicRoute />,
    children: buildRoutes(publicRoutes),
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Layout />,
        children: buildRoutes(protectedRoutes),
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];
