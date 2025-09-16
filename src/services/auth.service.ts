/* eslint-disable perfectionist/sort-classes */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import type { LoginData } from "@/types/index.types.js";

import { ERROR_MESSAGES, JWT_CONSTANTS } from "@/constants/index.js";
import { UserRepository } from "@/repositories/user.repository.js";
import {
    AuthTokens,
    LoginResponse,
    RefreshTokenResponse,
} from "@/types/api.types.js";
import { UnauthorizedError } from "@/utils/errors.util.js";

export class AuthService {
    constructor(private userRepository: UserRepository) {}

    async login(data: LoginData): Promise<LoginResponse> {
        const user = await this.userRepository.findByEmail(data.email);

        if (!user) {
            throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        // Generate tokens
        const tokens = this.generateTokens(
            user.id,
            user.email,
            user.role as string,
        );

        // Save refresh token to database
        await this.userRepository.update(user.id, {
            refreshToken: tokens.refreshToken,
        });

        return {
            tokens,
            user: {
                email: user.email,
                id: user.id,
                name: user.name,
                role: user.role as string,
            },
        };
    }

    async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
        try {
            // Verify refresh token
            const decoded = jwt.verify(
                refreshToken,
                JWT_CONSTANTS.REFRESH_SECRET,
            ) as {
                email: string;
                iat?: number; // issued at timestamp
                role: string;
                userId: string;
            };

            // Find user and check if refresh token matches
            const user = await this.userRepository.findById(decoded.userId);

            if (!user || user.refreshToken !== refreshToken) {
                throw new UnauthorizedError(ERROR_MESSAGES.INVALID_TOKEN);
            }

            // Check if refresh token is expired (optional additional check)
            const now = Math.floor(Date.now() / 1000);
            const tokenAge = now - (decoded.iat ?? 0);

            // Convert JWT expiry string to seconds
            const refreshExpiry = JWT_CONSTANTS.REFRESH_EXPIRES_IN;
            const maxAge = this.convertJwtExpiryToSeconds(refreshExpiry);

            if (tokenAge > maxAge) {
                // Token too old, require re-login
                await this.userRepository.update(user.id, {
                    refreshToken: null,
                });
                throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_EXPIRED);
            }

            const accessToken = (
                jwt.sign as (
                    payload: object,
                    secret: string,
                    options?: object,
                ) => string
            )(
                {
                    email: user.email,
                    role: user.role as string,
                    type: "access",
                    userId: user.id,
                },
                JWT_CONSTANTS.ACCESS_SECRET,
                { expiresIn: JWT_CONSTANTS.ACCESS_EXPIRES_IN },
            );

            return {
                tokens: {
                    accessToken,
                    refreshToken, // Return the same refresh token
                },
            };
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_EXPIRED);
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError(ERROR_MESSAGES.INVALID_TOKEN);
            }
            throw error;
        }
    }

    private generateTokens(
        userId: string,
        email: string,
        role: string,
    ): AuthTokens {
        const accessToken = (
            jwt.sign as (
                payload: object,
                secret: string,
                options?: object,
            ) => string
        )(
            {
                email,
                role,
                type: "access",
                userId,
            },
            JWT_CONSTANTS.ACCESS_SECRET,
            { expiresIn: JWT_CONSTANTS.ACCESS_EXPIRES_IN },
        );

        const refreshToken = (
            jwt.sign as (
                payload: object,
                secret: string,
                options?: object,
            ) => string
        )(
            {
                email,
                role,
                type: "refresh",
                userId,
            },
            JWT_CONSTANTS.REFRESH_SECRET,
            { expiresIn: JWT_CONSTANTS.REFRESH_EXPIRES_IN },
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    /**
     * Convert JWT expiry string (e.g., "7d", "24h", "30m") to seconds
     */
    private convertJwtExpiryToSeconds(expiry: string): number {
        const match = /^(\d+)([smhd])$/.exec(expiry);
        if (!match) {
            throw new Error(`Invalid JWT expiry format: ${expiry}`);
        }

        const value = parseInt(match[1], 10);
        const unit = match[2];

        switch (unit) {
            case "d": // days
                return value * 24 * 60 * 60;
            case "h": // hours
                return value * 60 * 60;
            case "m": // minutes
                return value * 60;
            case "s": // seconds
                return value;
            default:
                throw new Error(`Unsupported time unit: ${unit}`);
        }
    }
}
