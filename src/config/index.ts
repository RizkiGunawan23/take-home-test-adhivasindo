import { config } from "dotenv";

// Load environment variables
config();

export const CONFIG = {
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS ?? "12"),

    DATABASE_URL: process.env.DATABASE_URL ?? "",

    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m", // 15 minutes
    JWT_ACCESS_SECRET:
        process.env.JWT_ACCESS_SECRET ?? "your-access-secret-key",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d", // 7 days
    JWT_REFRESH_SECRET:
        process.env.JWT_REFRESH_SECRET ?? "your-refresh-secret-key",

    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: process.env.PORT ?? "3000",
} as const;
