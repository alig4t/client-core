// src/lib/menuUtils.ts
import type { RouteMeta } from "./path.types.ts";
import { routeConfig } from "./Routes";

// فقط آیتم‌هایی که باید در منو نمایش داده شوند
const validMenuItems = routeConfig.filter((r): r is RouteMeta => {
  return (
    r.showInMenu === true &&
    typeof r.label === "string" &&
    r.icon != null
  );
});

export const mainMenu = validMenuItems.filter(item => !item.parent);

export const subMenus: Record<string, RouteMeta[]> = {};
validMenuItems.forEach(item => {
  if (item.parent) {
    if (!subMenus[item.parent]) subMenus[item.parent] = [];
    subMenus[item.parent].push(item);
  }
});