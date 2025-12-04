// src/routes/index.tsx
import type { RouteObject } from "react-router-dom";
import { Suspense } from "react";

import Layout from "@/components/Layout/Layout";
import NotFoundPage from "@/components/NotFoundPage";
import { routeConfig } from "./Routes"; // ✅ Without 'type'
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import LazyFallbackElement from "./LazyFallbackElement";

const LazyFallback = () => <LazyFallbackElement />;

const buildRoutes = (routes: typeof routeConfig): RouteObject[] => {
  return routes.map((route) => {
    const element = route.element ? (
      <Suspense fallback={<LazyFallback />}>
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
