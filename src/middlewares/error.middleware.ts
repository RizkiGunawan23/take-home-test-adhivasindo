/* eslint-disable perfectionist/sort-union-types */
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { ERROR_MESSAGES } from "@/constants/index.js";
import { loginSchema } from "@/schemas/auth.schema.js";
import { AppError } from "@/utils/errors.js";
import { ResponseUtil } from "@/utils/response.util.js";
import { SchemaUtil } from "@/utils/schema.util.js";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
): void => {
    if (error instanceof ZodError) {
        // Get the appropriate schema for this route
        const schemaFlag = SchemaUtil.getSchemaForRoute(req.path, req.method);
        let schema: typeof loginSchema | null = null;

        if (
            schemaFlag &&
            typeof schemaFlag === "string" &&
            schemaFlag === "login"
        ) {
            schema = loginSchema;
        }

        if (schema) {
            // First, analyze the request structure
            const validationResult = SchemaUtil.analyzeRequestFields(
                req.body as Record<string, unknown>,
                schema,
            );

            // Check if there are structural issues (missing/extra fields)
            if (SchemaUtil.hasStructuralErrors(validationResult)) {
                // Return structured error for missing/extra fields
                const structuredErrors: Record<string, string[]> = {};

                // Only include non-empty arrays
                if (validationResult.expectedFields.length > 0) {
                    structuredErrors.expectedFields =
                        validationResult.expectedFields;
                }
                if (validationResult.missingFields.length > 0) {
                    structuredErrors.missingFields =
                        validationResult.missingFields;
                }
                if (validationResult.unexpectedFields.length > 0) {
                    structuredErrors.unexpectedFields =
                        validationResult.unexpectedFields;
                }

                const { response, statusCode } = ResponseUtil.fieldErrors({
                    errors: structuredErrors,
                    statusCode: 400,
                });
                res.status(statusCode).json(response);
                return;
            }
        }

        // If structure is correct or no schema found, extract field-specific validation errors
        const fieldErrors: Record<string, string[]> = {};

        for (const issue of error.issues) {
            const fieldPath = issue.path.join(".");
            // Remove 'body.' prefix for cleaner field names
            const cleanFieldName = fieldPath.replace(/^body\./, "");
            fieldErrors[cleanFieldName] = fieldErrors[cleanFieldName] ?? [];
            fieldErrors[cleanFieldName].push(issue.message);
        }

        const { response, statusCode } = ResponseUtil.fieldErrors({
            errors: fieldErrors,
            statusCode: 400,
        });
        res.status(statusCode).json(response);
        return;
    }

    if (error instanceof AppError) {
        const { response, statusCode } = ResponseUtil.error({
            message: error.message,
            statusCode: error.statusCode,
        });
        res.status(statusCode).json(response);
        return;
    }

    if (error.name === "PrismaClientKnownRequestError") {
        const { response, statusCode } = ResponseUtil.error({
            message: "Database operation failed",
            statusCode: 500,
        });
        res.status(statusCode).json(response);
        return;
    }

    if (error.name === "JsonWebTokenError") {
        const { response, statusCode } = ResponseUtil.error({
            message: "Invalid token",
            statusCode: 401,
        });
        res.status(statusCode).json(response);
        return;
    }

    if (error.name === "TokenExpiredError") {
        const { response, statusCode } = ResponseUtil.error({
            message: "Token expired",
            statusCode: 401,
        });
        res.status(statusCode).json(response);
        return;
    }

    const { response, statusCode } = ResponseUtil.error({
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        statusCode: 500,
    });
    res.status(statusCode).json(response);
};
