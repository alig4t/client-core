// src/routes.tsx
import type { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "../components/Layout/Layout";
import NotFoundPage from "../components/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Lazy-loaded pages
const LoginPage = lazy(() => import("../pages/Login"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));
const Post = lazy(() => import("../pages/Post"));
const Dashboard = lazy(() => import("@/pages/Dashboard/Main/DashboardMain"));

// Permission Module
const PermissionPage = lazy(() => import("@/Models/Permission/PermissionPage"));
const PermissionCreate = lazy(
  () => import("@/Models/Permission/PermissionCreate")
);

// Comprehensive Module
const ComprehensivePage = lazy(
  () => import("@/Models/Comprehensive/ComprehensivePage")
);
const ComprehensiveCreate = lazy(
  () => import("@/Models/Comprehensive/ComprehensiveCreate")
);
const ComprehensiveDisplay = lazy(
  () => import("@/Models/Comprehensive/ComprehensiveDisplay")
);

// Wrapper for lazy components with Suspense fallback (optional: you can customize fallback)
const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div>در حال بارگذاری...</div>}>{children}</Suspense>
);

export const Routes: RouteObject[] = [
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      {
        path: "login",
        element: (
          <LazyRoute>
            <LoginPage />
          </LazyRoute>
        ),
      },
      {
        path: "register",
        element: (
          <LazyRoute>
            <RegisterPage />
          </LazyRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: (
              <LazyRoute>
                <Dashboard />
              </LazyRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <LazyRoute>
                <Profile />
              </LazyRoute>
            ),
          },
          {
            path: "settings",
            element: (
              <LazyRoute>
                <Settings />
              </LazyRoute>
            ),
          },
          {
            path: "posts",
            element: (
              <LazyRoute>
                <Post />
              </LazyRoute>
            ),
          },
          {
            path: "portal",
            children: [
              {
                path: "permissions",
                element: (
                  <LazyRoute>
                    <PermissionPage />
                  </LazyRoute>
                ),
              },
              {
                path: "permissions/create",
                element: (
                  <LazyRoute>
                    <PermissionCreate />
                  </LazyRoute>
                ),
              },
              {
                path: "comprehensive",
                element: (
                  <LazyRoute>
                    <ComprehensivePage />
                  </LazyRoute>
                ),
              },
              {
                path: "comprehensive/create",
                element: (
                  <LazyRoute>
                    <ComprehensiveCreate />
                  </LazyRoute>
                ),
              },
              {
                path: "comprehensive/:id",
                element: (
                  <LazyRoute>
                    <ComprehensiveDisplay />
                  </LazyRoute>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
