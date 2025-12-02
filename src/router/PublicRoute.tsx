import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../stores/AuthContext";

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If user is logged in and going to /login or /register, redirect to dashboard
  if (isAuthenticated && ["/login", "/register"].includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, allow public page to be shown
  return <Outlet />;
};

export default PublicRoute;
