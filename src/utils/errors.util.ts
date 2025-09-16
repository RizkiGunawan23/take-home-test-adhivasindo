import { HTTP_STATUS } from "@/constants/index.js";

export class AppError extends Error {
    public readonly statusCode: number;

    constructor(
        message: string,
        statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR as number,
    ) {
        super(message);
        this.statusCode = statusCode;

        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS.CONFLICT);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS.FORBIDDEN);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS.NOT_FOUND);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS.UNAUTHORIZED);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS.BAD_REQUEST);
    }
}
