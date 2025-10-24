// src/types/route.types.ts
import type { ReactNode } from "react";

export type Permission = string;

export interface RouteMeta {
  path: string;
  label?: string;
  icon?: ReactNode;
  permission?: Permission;
  showInMenu?: boolean;
  parent?: string;
  isPublic?: boolean;
}

export type RouteConfig = RouteMeta & {
  element?: React.LazyExoticComponent<React.ComponentType<any>>;
  children?: RouteConfig[];
};