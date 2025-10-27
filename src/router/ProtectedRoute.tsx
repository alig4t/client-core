// src/components/ProtectedRoute.tsx

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../stores/AuthContext"; // Correct path to AuthContext
import { routeConfig } from "./Routes";
import ForbiddenPage from "@/pages/ForbiddenPage";

const ProtectedRoute = () => {
  const { isAuthenticated, hasPermission, user } = useAuth();
  const location = useLocation();

  // اگر لاگین نیست
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRoute = routeConfig.find(
    (route) => route.path === location.pathname
  );

  // اگر مسیر نیاز به مجوز دارد و کاربر ندارد
  if (currentRoute?.permission && !hasPermission(currentRoute.permission)) {
    // return <Navigate to="/dashboard" replace />;
    return <ForbiddenPage />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
