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
import ProtectedRoute from "./ProtectedRoute"; // کامپوننت محافظت از روت‌ها
import PublicRoute from "./PublicRoute"; // کامپوننت روت‌های عمومی
import RegisterPage from "@/pages/RegisterPage";

export const Routes: RouteObject[] = [
  {
    // روت‌های عمومی که کاربر لاگین کرده نباید ببیند (مثل صفحه لاگین)
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
    // روت‌های محافظت‌شده که نیاز به احراز هویت دارند
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
            ],
          },
        ],
      },
    ],
  },
  // روت ۴۰۴ برای مسیرهای پیدا نشده
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
