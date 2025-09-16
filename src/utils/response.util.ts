/* eslint-disable perfectionist/sort-objects */
/* eslint-disable perfectionist/sort-object-types */
import {
    ErrorResponse,
    FieldErrors,
    SuccessResponse,
} from "@/schemas/response.schema.js";

export const ResponseUtil = {
    success<T>(params: { statusCode?: number; message?: string; data: T }): {
        statusCode: number;
        response: SuccessResponse<T>;
    } {
        const { data, message, statusCode = 200 } = params;
        return {
            statusCode,
            response: {
                message,
                data,
            },
        };
    },

    error(params: { message: string; statusCode?: number }): {
        statusCode: number;
        response: ErrorResponse;
    } {
        const { message, statusCode = 500 } = params;
        return {
            statusCode,
            response: {
                message,
            },
        };
    },

    fieldErrors(params: { errors: FieldErrors; statusCode?: number }): {
        statusCode: number;
        response: ErrorResponse;
    } {
        const { errors, statusCode = 400 } = params;
        return {
            statusCode,
            response: {
                errors,
            },
        };
    },

    validationError(params: {
        statusCode?: number;
        field: string;
        message: string;
    }): { statusCode: number; response: ErrorResponse } {
        const { field, message, statusCode = 400 } = params;
        return {
            statusCode,
            response: {
                errors: {
                    [field]: [message],
                },
            },
        };
    },
};
