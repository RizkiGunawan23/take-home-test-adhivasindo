/* eslint-disable perfectionist/sort-objects */
import { NextFunction, Request, Response } from "express";

import { HTTP_STATUS } from "@/constants/index.js";
import { getAllRoutes } from "@/helper/routes.helper.js";
import { ResponseHelper } from "@/utils/response.util.js";

export const routeNotFoundMiddleware = (req: Request, res: Response) => {
    ResponseHelper.error(res, {
        message: `Endpoint ${req.method} '${req.originalUrl}' not found`,
        statusCode: HTTP_STATUS.NOT_FOUND,
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
        return res.status(HTTP_STATUS.METHOD_NOT_ALLOWED).json({
            message: `Method ${req.method} not allowed for '${req.originalUrl}'`,
            allowedMethods: allowedMethods,
        });
    }

    next();
};
