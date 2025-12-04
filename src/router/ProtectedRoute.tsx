// src/components/ProtectedRoute.tsx

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../stores/AuthContext"; // Correct path to AuthContext
import { routeConfig } from "./Routes";
import ForbiddenPage from "@/pages/ForbiddenPage";

const ProtectedRoute = () => {
  const { isAuthenticated, hasPermission, user } = useAuth();
  const location = useLocation();

  // If not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRoute = routeConfig.find(
    (route) => route.path === location.pathname
  );

  // If route requires permission and user doesn't have it
  if (currentRoute?.permission && !hasPermission(currentRoute.permission)) {
    // return <Navigate to="/dashboard" replace />;
    return <ForbiddenPage />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
