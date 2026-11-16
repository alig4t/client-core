import { useLocation } from "react-router-dom";
import { getRouteRegistry } from "../router/RouteUtils";
import { findMatchingRoute } from "../router/matchRoute";
export function useRouteMetadata() {
  return findMatchingRoute(getRouteRegistry(), useLocation().pathname);
}
