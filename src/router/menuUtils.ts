// src/lib/menuUtils.ts
import type { RouteMeta } from "./path.types.ts";
import { routeConfig } from "./Routes";


// Just raw extraction
const allMenuItems = routeConfig.filter((r): r is RouteMeta => {
  return r.showInMenu === true && typeof r.label === "string" && r.icon != null;
}).sort((a,b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));

export const getMainMenu = () => allMenuItems.filter(item => !item.parent);
export const getSubMenus = () => {
  const sub: Record<string, RouteMeta[]> = {};
  allMenuItems.forEach(item => {
    if (item.parent) {
      if (!sub[item.parent]) sub[item.parent] = [];
      sub[item.parent].push(item);
    }
  });
  return sub;
};
