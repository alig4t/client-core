import type { ReactNode, LazyExoticComponent, ComponentType } from "react";
export type Permission = string;
export interface RouteMeta {
  path: string;
  label?: string;
  icon?: ReactNode;
  permission?: Permission;
  showInMenu?: boolean;
  parent?: string;
  isPublic?: boolean;
  name?: string;
  menuOrder?: number;
}
export type RouteConfig = RouteMeta & {
  element?: LazyExoticComponent<ComponentType>;
  children?: RouteConfig[];
};
