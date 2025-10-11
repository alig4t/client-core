// src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../stores/AuthContext"; // Correct path to AuthContext

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  console.log(isAuthenticated);
  // If user is authenticated, allow access to child routes (Outlet)
  // Otherwise, navigate to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
