import Guard from "@/core/router/ProtectedRoute";
import ForbiddenPage from "@/pages/ForbiddenPage";
import { useAuth } from "@/stores/AuthContext";
import { routeConfig } from "./Routes";
export default function ProtectedRoute() {
  const { isAuthenticated, user, hasPermission } = useAuth();
  return (
    <Guard
      isAuthenticated={isAuthenticated && Boolean(user)}
      can={hasPermission}
      routes={routeConfig}
      forbidden={<ForbiddenPage />}
    />
  );
}
