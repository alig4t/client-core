// src/components/PublicRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../stores/AuthContext";

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  // اگر کاربر لاگین کرده، به داشبورد برو
  // در غیر این صورت، اجازه دسترسی به صفحه لاگین (Outlet) را بده
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
