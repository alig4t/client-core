import { routeConfig } from "./Routes";
import type { ViewName } from "./ViewName";

export const getViewPath = (viewName: ViewName, id?: string | number): string => {
  const route = routeConfig.find((r) => r.name === viewName);
  if (!route) {
    console.error(`No route found for viewName: ${viewName}`);
    return "#";
  }

  let path = route.path;

  // اگر مسیر شامل ":id" باشد و id داده شده باشد، جایگزین کن
  if (id !== undefined && path.includes("/:id")) {
    path = path.replace("/:id", `/${id}`);
  }

  return path;
};