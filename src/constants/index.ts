/* eslint-disable perfectionist/sort-objects */
import { CONFIG } from "@/config/index.js";

export const JWT_CONSTANTS = {
    ACCESS_EXPIRES_IN: CONFIG.JWT_ACCESS_EXPIRES_IN,
    ACCESS_SECRET: CONFIG.JWT_ACCESS_SECRET,
    REFRESH_EXPIRES_IN: CONFIG.JWT_REFRESH_EXPIRES_IN,
    REFRESH_SECRET: CONFIG.JWT_REFRESH_SECRET,
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
    UNAUTHORIZED: "Unauthorized",
    INTERNAL_SERVER_ERROR: "Internal server error",
    INVALID_CREDENTIALS: "Invalid email or password",
    INVALID_EMAIL_FORMAT: "Invalid email format",
    INVALID_TOKEN: "Invalid token",
    PASSWORD_NO_UPPERCASE:
        "Password must contain at least one uppercase letter",
    PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
    TOKEN_EXPIRED: "Token expired",
    USER_ALREADY_EXISTS: "User with this email already exists",
    USER_NOT_FOUND: "User not found",
} as const;

export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESSFUL: "Login successful",
    TOKEN_REFRESHED: "Token refreshed successfully",
    USER_CREATED: "User created successfully",
    USER_DELETED: "User deleted successfully",
    USER_RETRIEVED: "User retrieved successfully",
    USER_UPDATED: "User updated successfully",
    USERS_RETRIEVED: "Users retrieved successfully",
} as const;
