import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../stores/AuthContext";

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // اگر کاربر لاگین کرده و داره می‌ره به /login یا /register، بفرستش به داشبورد
  if (isAuthenticated && ["/login", "/register"].includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  // در غیر این صورت، اجازه بده صفحه عمومی نمایش داده بشه
  return <Outlet />;
};

export default PublicRoute;
