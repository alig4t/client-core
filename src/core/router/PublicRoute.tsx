import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../stores/AuthContext";
import { getViewPath } from "@/core/router/RouteUtils";
import { VIEWNAME } from "../../router/ViewName";

// Define public auth routes as a constant for better maintainability
const PUBLIC_AUTH_ROUTES = ["/login", "/register"];

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  const MAIN_PAGE = getViewPath(VIEWNAME.DASHBOARD);

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && PUBLIC_AUTH_ROUTES.includes(pathname)) {
    return <Navigate to={MAIN_PAGE} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;