// src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../stores/AuthContext"; // مسیر صحیح به AuthContext

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  // اگر کاربر احراز هویت شده بود، اجازه دسترسی به روت‌های فرزند (Outlet) را بده
  // در غیر این صورت، به صفحه لاگین هدایتش کن
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
