import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

import { HTTP_STATUS } from "@/constants/index.js";
import { ResponseHelper } from "@/utils/response.util.js";
import { SchemaUtil } from "@/utils/schema.util.js";

export const validate = <T>(schema: z.ZodType<T>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const validatedData = schema.parse(req.body);
            // Override req.body with validated and typed data
            (req as Request & { body: T }).body = validatedData;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Analyze request structure using SchemaUtil
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

                    ResponseHelper.fieldErrors(res, {
                        errors: structuredErrors,
                        statusCode: HTTP_STATUS.BAD_REQUEST,
                    });
                    return;
                }

                // If structure is correct, extract field-specific validation errors
                const fieldErrors: Record<string, string[]> = {};

                for (const issue of error.issues) {
                    const fieldPath = issue.path.join(".");
                    // Remove 'body.' prefix for cleaner field names
                    const cleanFieldName = fieldPath.replace(/^body\./, "");
                    fieldErrors[cleanFieldName] =
                        fieldErrors[cleanFieldName] ?? [];
                    fieldErrors[cleanFieldName].push(issue.message);
                }

                ResponseHelper.fieldErrors(res, {
                    errors: fieldErrors,
                    statusCode: HTTP_STATUS.BAD_REQUEST,
                });
                return;
            }

            // Fallback for non-Zod errors
            ResponseHelper.error(res, {
                message: "Validation failed",
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }
    };
};

export const validateQuery = <T>(schema: z.ZodType<T>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const validatedData = schema.parse(req.query);
            // Override req.body with validated and typed data for consistency
            (req as Request & { body: T }).body = validatedData;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Extract field-specific validation errors
                const fieldErrors: Record<string, string[]> = {};

                for (const issue of error.issues) {
                    const fieldPath = issue.path.join(".");
                    // Remove 'query.' prefix for cleaner field names
                    const cleanFieldName = fieldPath.replace(/^query\./, "");
                    fieldErrors[cleanFieldName] =
                        fieldErrors[cleanFieldName] ?? [];
                    fieldErrors[cleanFieldName].push(issue.message);
                }

                ResponseHelper.fieldErrors(res, {
                    errors: fieldErrors,
                    statusCode: HTTP_STATUS.BAD_REQUEST,
                });
                return;
            }

            // Fallback for non-Zod errors
            ResponseHelper.error(res, {
                message: "Query validation failed",
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }
    };
};

export const validateParams = <T>(schema: z.ZodType<T>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const validatedData = schema.parse(req.params);
            // Store validated params in req for use in controller
            (req as Request & { validatedParams: T }).validatedParams =
                validatedData;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Extract field-specific validation errors
                const fieldErrors: Record<string, string[]> = {};

                for (const issue of error.issues) {
                    const fieldPath = issue.path.join(".");
                    // Remove 'params.' prefix for cleaner field names
                    const cleanFieldName = fieldPath.replace(/^params\./, "");
                    fieldErrors[cleanFieldName] =
                        fieldErrors[cleanFieldName] ?? [];
                    fieldErrors[cleanFieldName].push(issue.message);
                }

                ResponseHelper.fieldErrors(res, {
                    errors: fieldErrors,
                    statusCode: HTTP_STATUS.BAD_REQUEST,
                });
                return;
            }

            // Fallback for non-Zod errors
            ResponseHelper.error(res, {
                message: "Parameter validation failed",
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }
    };
};
