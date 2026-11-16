import { matchRoutes, type RouteObject } from "react-router-dom";
export interface MatchableRoute {
  path: string;
  permission?: string;
  children?: MatchableRoute[];
}
export function findMatchingRoute<T extends MatchableRoute>(
  routes: T[],
  pathname: string,
): T | undefined {
  const build = (routes: MatchableRoute[]): RouteObject[] =>
    routes.map((route) => ({
      path: route.path,
      handle: route,
      children: route.children ? build(route.children) : undefined,
    }));
  const matches = matchRoutes(build(routes), pathname);
  return matches?.[matches.length - 1]?.route.handle;
}
