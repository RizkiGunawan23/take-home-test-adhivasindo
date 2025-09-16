/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-for-of */

import { app } from "@/index.js";

export function getAllRoutes(): { methods: string[]; path: string }[] {
    const routes: { methods: string[]; path: string }[] = [];

    try {
        let routerStack = (app as any)._router?.stack;

        if (!routerStack) {
            // Try alternative access methods
            const altStack =
                (app as any).router?.stack ?? (app as any)._router?.stack;
            if (altStack) {
                // Use the alternative stack for processing
                routerStack = altStack;
            } else {
                return routes;
            }
        }

        for (const layer of routerStack) {
            if (layer.route) {
                const route = layer.route;
                const methods = Object.keys(route.methods ?? {}).filter(
                    (method: string) => route.methods[method],
                );
                const path = route.path ?? "unknown";

                routes.push({
                    methods: methods.map((m: string) => m.toUpperCase()),
                    path: path,
                });
            } else if (layer.name === "router" && layer.handle?.stack) {
                // For now, hardcode the known mount path since we know routes are mounted at /api
                const mountPath = "/api";

                // Recursively process the nested router stack
                const subStack = layer.handle.stack;
                processRouterStack(subStack as unknown[], mountPath, routes);
            }
        }
    } catch (error) {
        console.error("Route detection failed:", error);
    }

    return routes;
}

// Recursive function to process router stack
function processRouterStack(
    stack: unknown[],
    basePath: string,
    routes: { methods: string[]; path: string }[],
): void {
    for (let i = 0; i < stack.length; i++) {
        const layer = stack[i] as any;

        if (layer.route) {
            const route = layer.route;
            const methods = Object.keys(route.methods ?? {}).filter(
                (method: string) => route.methods[method],
            );
            const subPath = route.path ?? "unknown";
            const fullPath = basePath + (subPath as string);

            routes.push({
                methods: methods.map((m: string) => m.toUpperCase()),
                path: fullPath,
            });
        } else if (layer.name === "router" && layer.handle?.stack) {
            const layerRegexp = layer.regexp;
            let routerPath = "/";

            if (layerRegexp?.source) {
                routerPath = layerRegexp.source
                    .replace(/^\\\//, "/")
                    .replace(/\\\//g, "/")
                    .replace(/\$$/, "")
                    .replace(/\(\?:/g, "")
                    .replace(/\)/g, "");
            }

            const subStack = layer.handle.stack as unknown[];
            const nextBasePath =
                routerPath === "/" ? basePath : basePath + routerPath;
            processRouterStack(subStack, nextBasePath, routes);
        }
    }
}
