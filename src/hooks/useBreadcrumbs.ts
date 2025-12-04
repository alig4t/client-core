import { useMemo } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { routeConfig } from "@/router/Routes";
import type { RouteConfig } from "@/router/path.types";

export interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

export const useBreadcrumbs = (
    customLabel?: string
): BreadcrumbItem[] => {
    const location = useLocation();
    const currentPath = location.pathname;

    const breadcrumbs = useMemo(() => {
        const items: BreadcrumbItem[] = [];

        // Helper to find route config by path
        const findRouteByPath = (path: string): RouteConfig | undefined => {
            return routeConfig.find((route) => {
                // Handle dynamic routes (e.g., /users/:id)
                if (route.path.includes(":")) {
                    return matchPath({ path: route.path, end: true }, path);
                }
                return route.path === path;
            });
        };

        // Helper to traverse up the parent chain
        const traverse = (path: string) => {
            const route = findRouteByPath(path);
            if (!route) return;

            if (route.parent) {
                traverse(route.parent);
            }

            // Add current item
            // If it's the current active page, we might want to override the label
            const isCurrent = matchPath({ path: route.path, end: true }, currentPath);

            let label = route.label || route.name || "Unknown";
            if (isCurrent && customLabel) {
                label = customLabel;
            }

            // For dynamic routes, we need to reconstruct the actual URL if it's a parent
            // But for now, we assume parents are static or we have the full path.
            // If a parent is dynamic (e.g. /users/:id/posts), this simple traversal might need more logic
            // to fill in the :id. For this project, parents seem to be static (e.g. /dashboard/portal/comprehensive).

            items.push({
                label,
                href: isCurrent ? undefined : route.path, // Don't link the current page
                active: !!isCurrent,
            });
        };

        // Start traversal from the current path
        // We need to find the matching route config for the current URL first
        const currentRoute = routeConfig.find((route) =>
            matchPath({ path: route.path, end: true }, currentPath)
        );

        if (currentRoute) {
            // If we found a match, start traversing from its parent (or itself if we want to include it in the recursion, 
            // but the recursion above handles "parent first", so we should call traverse on the current route)
            // Wait, my traverse function calls parent first. So I should call traverse(currentPath) but 
            // traverse expects a path that matches a route config.
            // Since currentRoute.path might contain :id, we should pass the *actual* path for matching? 
            // No, findRouteByPath handles matching.
            // But if I pass "/users/123", findRouteByPath needs to match "/users/:id".
            // Yes, matchPath does that.

            // However, for the *href* of the parent, if the parent was dynamic, we'd have an issue.
            // But looking at Routes.tsx, parents are static strings like "/dashboard/portal".
            // So we are safe for now.

            // One edge case: The "Home" (Dashboard) might not be in the parent chain of everything explicitly.
            // But usually we want "Home" at the start.
            // Let's check if the first item is Home, if not, add it.

            if (currentRoute.parent) {
                // Recursively add parents
                const addParents = (parentPath: string) => {
                    const parent = routeConfig.find(r => r.path === parentPath);
                    if (parent) {
                        if (parent.parent) addParents(parent.parent);
                        items.push({ label: parent.label || parent.name || "", href: parent.path });
                    }
                };
                addParents(currentRoute.parent);
            }

            // Add current page
            items.push({
                label: customLabel || currentRoute.label || currentRoute.name || "",
                active: true
            });
        } else {
            // Fallback if route not found (shouldn't happen if config is complete)
            items.push({ label: "Home", href: "/dashboard" });
        }

        // Always ensure Home is first if not present?
        // The recursive parent check should handle it if parents are set correctly.
        // If "Home" (/dashboard) is the root parent, it will be added.
        // Let's check Routes.tsx:
        // /dashboard/portal has no parent.
        // /dashboard has no parent.
        // So if we are at /dashboard/portal/comprehensive, parent is /dashboard/portal.
        // We might want to manually prepend "Home" (/dashboard) if it's not in the chain.

        if (items.length > 0 && items[0].href !== "/dashboard" && items[0].href !== "/") {
            items.unshift({ label: "خانه", href: "/dashboard" });
        }

        return items;
    }, [currentPath, customLabel]);

    return breadcrumbs;
};
