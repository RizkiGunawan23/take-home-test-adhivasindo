import { CONFIG } from "@/config/index.js";

export const JWT_CONSTANTS = {
    ACCESS_EXPIRES_IN: CONFIG.JWT_ACCESS_EXPIRES_IN,
    ACCESS_SECRET: CONFIG.JWT_ACCESS_SECRET,
    REFRESH_EXPIRES_IN: CONFIG.JWT_REFRESH_EXPIRES_IN,
    REFRESH_SECRET: CONFIG.JWT_REFRESH_SECRET,
} as const;

export const HTTP_STATUS = {
    BAD_REQUEST: 400,
    CREATED: 201,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500,
    NOT_FOUND: 404,
    OK: 200,
    UNAUTHORIZED: 401,
} as const;

export const ERROR_MESSAGES = {
    INTERNAL_SERVER_ERROR: "Internal server error",
    INVALID_CREDENTIALS: "Invalid email or password",
    INVALID_EMAIL_FORMAT: "Invalid email format",
    INVALID_TOKEN: "Invalid token",
    PASSWORD_NO_UPPERCASE:
        "Password must contain at least one uppercase letter",
    PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
    TOKEN_EXPIRED: "Token expired",
    UNAUTHORIZED: "Unauthorized",
    USER_NOT_FOUND: "User not found",
} as const;

export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESSFUL: "Login successful",
    TOKEN_REFRESHED: "Token refreshed successfully",
} as const;
