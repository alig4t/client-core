// src/routes.tsx

import type { RouteObject } from "react-router-dom";
import Layout from "../components/Layout";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import LoginPage from "../pages/Login";
import Post from "../pages/Post";
import NotFoundPage from "../components/NotFoundPage";
import TagSearchPage from "../Models/Tag/TagSearchPage";
import TagCreatePage from "../Models/Tag/TagCreatePage";
import TagDisplayPage from "../Models/Tag/TagDisplayPage";
import ProtectedRoute from "./ProtectedRoute"; // Protected Route component
import PublicRoute from "./PublicRoute"; // Public Routes component
import RegisterPage from "@/pages/RegisterPage";
import PermissionPage from "@/Models/Permission/PermissionPage";
import PermissionCreate from "@/Models/Permission/PermissionCreate";

export const Routes: RouteObject[] = [
  {
    // Public routes that logged-in users should not see (like login page)
    path: "/",
    element: <PublicRoute />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    // Protected routes that require authentication
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { index: true, element: <div className="p-4">صفحه اصلی</div> },
          { path: "profile", element: <Profile /> },
          { path: "settings", element: <Settings /> },
          { path: "posts", element: <Post /> },
          {
            path: "portal",
            children: [
              { path: "tags", element: <TagSearchPage /> },
              { path: "tags/create", element: <TagCreatePage /> },
              { path: "tags/:id", element: <TagDisplayPage /> },
              { path: "permissions", element: <PermissionPage /> },
              { path: "permissions/create", element: <PermissionCreate /> },
            ],
          },
        ],
      },
    ],
  },
  // 404 route for not found paths
  {
    path: "*",
    element: <NotFoundPage />,
  },
];