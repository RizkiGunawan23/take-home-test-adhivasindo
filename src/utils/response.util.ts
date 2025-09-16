/* eslint-disable perfectionist/sort-objects */
/* eslint-disable perfectionist/sort-object-types */
import { Response } from "express";

import { FieldErrors } from "@/schemas/response.schema.js";

// Enhanced Response Helper - langsung kirim response tanpa perlu res.status().json()
export const ResponseHelper = {
    // Untuk success response dengan data (GET, login, dll)
    success(
        res: Response,
        params: { statusCode?: number; message?: string; data: unknown },
    ): void {
        const { statusCode = 200, message, data } = params;
        res.status(statusCode).json({
            message,
            data,
        });
    },

    // Untuk success response tanpa data (CREATE, UPDATE, DELETE)
    successNoData(
        res: Response,
        params: { statusCode?: number; message: string },
    ): void {
        const { statusCode = 200, message } = params;
        res.status(statusCode).json({
            message,
        });
    },

    // Untuk error response
    error(
        res: Response,
        params: { message: string; statusCode?: number },
    ): void {
        const { message, statusCode = 500 } = params;
        res.status(statusCode).json({
            message,
        });
    },

    // Untuk field validation errors
    fieldErrors(
        res: Response,
        params: { errors: FieldErrors; statusCode?: number },
    ): void {
        const { errors, statusCode = 400 } = params;
        res.status(statusCode).json({
            errors,
        });
    },

    // Untuk single field validation error
    validationError(
        res: Response,
        params: { field: string; message: string; statusCode?: number },
    ): void {
        const { field, message, statusCode = 400 } = params;
        res.status(statusCode).json({
            errors: {
                [field]: [message],
            },
        });
    },
};
