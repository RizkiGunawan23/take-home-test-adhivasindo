import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import type { AuthRequest } from "@/types/index.js";

import { HTTP_STATUS } from "@/constants/index.js";
import { AppError } from "@/utils/errors.util.js";
import { ResponseHelper } from "@/utils/response.util.js";

export const authenticateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): void => {
    try {
        const authHeader = (
            req.headers as unknown as Record<string, string | undefined>
        ).authorization;
        const token = authHeader?.split(" ")[1]; // Bearer TOKEN

        if (!token) {
            ResponseHelper.error(res, {
                message: "Access token is required",
                statusCode: HTTP_STATUS.UNAUTHORIZED,
            });
            return;
        }

        const secret = process.env.JWT_ACCESS_SECRET;
        if (!secret) {
            throw new AppError(
                "JWT secret not configured",
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
            );
        }

        const decoded = jwt.verify(token, secret) as {
            email: string;
            id: string;
            role: string;
            type: string;
        };

        // Check if token is access token
        if (decoded.type !== "access") {
            ResponseHelper.error(res, {
                message: "Invalid token type",
                statusCode: HTTP_STATUS.UNAUTHORIZED,
            });
            return;
        }

        req.user = {
            email: decoded.email,
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            ResponseHelper.error(res, {
                message: "Invalid token",
                statusCode: HTTP_STATUS.UNAUTHORIZED,
            });
            return;
        }

        if (error instanceof jwt.TokenExpiredError) {
            ResponseHelper.error(res, {
                message: "Token expired",
                statusCode: HTTP_STATUS.UNAUTHORIZED,
            });
            return;
        }

        ResponseHelper.error(res, {
            message: "Authentication failed",
            statusCode: HTTP_STATUS.UNAUTHORIZED,
        });
    }
};

export const requireAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): void => {
    if (!req.user) {
        ResponseHelper.error(res, {
            message: "Authentication required",
            statusCode: HTTP_STATUS.UNAUTHORIZED,
        });
        return;
    }

    if (req.user.role !== "ADMIN") {
        ResponseHelper.error(res, {
            message: "Admin access required",
            statusCode: HTTP_STATUS.FORBIDDEN,
        });
        return;
    }

    next();
};
