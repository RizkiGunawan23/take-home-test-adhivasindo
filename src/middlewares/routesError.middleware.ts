/* eslint-disable perfectionist/sort-objects */
import { NextFunction, Request, Response } from "express";

import { getAllRoutes } from "@/helper/routes.helper.js";

export const routeNotFoundMiddleware = (req: Request, res: Response) => {
    res.status(404).json({
        message: `Endpoint ${req.method} '${req.originalUrl}' not found`,
    });
};

export const routeMethodNotAllowedMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const routes = getAllRoutes();

    const matchingRoute = routes.find((route) => {
        // Try matching with originalUrl first (includes mount path)
        if (route.path === req.originalUrl) {
            return true;
        }

        // Try matching with path (without mount path) by removing mount prefix
        const routeWithoutMount = route.path.replace(/^\/api/, "");
        if (routeWithoutMount === req.path) {
            return true;
        }

        // Fallback to regex matching for parameterized routes
        const routePattern = route.path.replace(/:\w+/g, "[^/]+");
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(req.originalUrl) || regex.test(req.path);
    });

    if (matchingRoute && !matchingRoute.methods.includes(req.method)) {
        const allowedMethods = matchingRoute.methods.filter(
            (method) => method !== "HEAD",
        );
        res.set("Allow", allowedMethods.join(", "));
        return res.status(405).json({
            message: `Method ${req.method} not allowed for '${req.originalUrl}'`,
            allowedMethods: allowedMethods,
        });
    }

    next();
};
