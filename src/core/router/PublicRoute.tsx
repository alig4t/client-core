import { Navigate, Outlet, useLocation } from "react-router-dom";
export default function PublicRoute({
  isAuthenticated,
  homePath = "/dashboard",
  authPaths = ["/login", "/register"],
}: {
  isAuthenticated: boolean;
  homePath?: string;
  authPaths?: string[];
}) {
  const location = useLocation();
  return isAuthenticated && authPaths.includes(location.pathname) ? (
    <Navigate to={homePath} replace />
  ) : (
    <Outlet />
  );
}
