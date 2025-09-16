import { NextFunction, Request, Response } from "express";

import { ERROR_MESSAGES, HTTP_STATUS } from "@/constants/index.js";
import { AppError } from "@/utils/errors.util.js";
import { ResponseHelper } from "@/utils/response.util.js";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
): void => {
    if (error instanceof AppError) {
        ResponseHelper.error(res, {
            message: error.message,
            statusCode: error.statusCode,
        });
        return;
    }

    if (error.name === "PrismaClientKnownRequestError") {
        ResponseHelper.error(res, {
            message: "Database operation failed",
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        });
        return;
    }

    if (error.name === "JsonWebTokenError") {
        ResponseHelper.error(res, {
            message: "Invalid token",
            statusCode: HTTP_STATUS.UNAUTHORIZED,
        });
        return;
    }

    if (error.name === "TokenExpiredError") {
        ResponseHelper.error(res, {
            message: "Token expired",
            statusCode: HTTP_STATUS.UNAUTHORIZED,
        });
        return;
    }

    ResponseHelper.error(res, {
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    });
};
