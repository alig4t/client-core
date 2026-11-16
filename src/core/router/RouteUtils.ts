import { generatePath } from "react-router-dom";
import type { RouteConfig } from "./types";
let registry: RouteConfig[] = [];
export function configureRoutes(routes: RouteConfig[]) {
  registry = routes;
}
export function getRouteRegistry() {
  return registry;
}
export function getViewPath(
  viewName: string,
  idOrParams?: string | number | Record<string, string>,
): string {
  const find = (routes: RouteConfig[]): RouteConfig | undefined => {
    for (const route of routes) {
      if (route.name === viewName) return route;
      const child = route.children ? find(route.children) : undefined;
      if (child) return child;
    }
  };
  const route = find(registry);
  if (!route) throw new Error("No route registered for view: " + viewName);
  const params =
    typeof idOrParams === "object"
      ? idOrParams
      : idOrParams !== undefined
        ? { id: String(idOrParams) }
        : {};
  return generatePath(route.path, params);
}
