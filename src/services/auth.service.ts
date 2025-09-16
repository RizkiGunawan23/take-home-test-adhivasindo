import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { ERROR_MESSAGES, JWT_CONSTANTS } from "@/constants/index.js";
import { UserRepository } from "@/repositories/user.repository.js";
import {
    AuthTokens,
    LoginResponse,
    RefreshTokenResponse,
} from "@/schemas/response.schema.js";
import { AppError } from "@/utils/errors.js";

export interface LoginData {
    email: string;
    password: string;
}

export class AuthService {
    constructor(private userRepository: UserRepository) {}

    async login(data: LoginData): Promise<LoginResponse> {
        const user = await this.userRepository.findByEmail(data.email);

        if (!user) {
            throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
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
                role: string;
                userId: string;
            };

            // Find user and check if refresh token matches
            const user = await this.userRepository.findById(decoded.userId);

            if (!user || user.refreshToken !== refreshToken) {
                throw new AppError(ERROR_MESSAGES.INVALID_TOKEN, 401);
            }

            // Generate new tokens
            const tokens = this.generateTokens(
                user.id,
                user.email,
                user.role as string,
            );

            // Update refresh token in database
            await this.userRepository.update(user.id, {
                refreshToken: tokens.refreshToken,
            });

            return { tokens };
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AppError(ERROR_MESSAGES.TOKEN_EXPIRED, 401);
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new AppError(ERROR_MESSAGES.INVALID_TOKEN, 401);
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
}
