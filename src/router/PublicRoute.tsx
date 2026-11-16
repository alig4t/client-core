import Guard from "@/core/router/PublicRoute";
import { useAuth } from "@/stores/AuthContext";
export default function PublicRoute() {
  return <Guard isAuthenticated={useAuth().isAuthenticated} />;
}
