import { useLocation, matchPath } from "react-router-dom";
import { routeConfig } from "@/router/Routes";
import type { RouteConfig } from "@/router/path.types";

export const useRouteMetadata = (): RouteConfig | undefined => {
    const location = useLocation();
    const currentPath = location.pathname;

    return routeConfig.find((route) => {
        if (route.path.includes(":")) {
            return matchPath({ path: route.path, end: true }, currentPath);
        }
        return route.path === currentPath;
    });
};