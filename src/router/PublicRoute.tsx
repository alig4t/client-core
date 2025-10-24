// src/components/PublicRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../stores/AuthContext";

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  // If the user is logged in, go to the dashboard
  // Otherwise, allow access to the login page (Outlet)
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
