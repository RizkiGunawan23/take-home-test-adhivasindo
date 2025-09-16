import { Response } from "express";

import type { LoginInput, RefreshTokenInput } from "@/schemas/auth.schema.js";
import type { TypedRequest } from "@/types/index.js";

import { HTTP_STATUS, SUCCESS_MESSAGES } from "@/constants/index.js";
import { AuthService } from "@/services/auth.service.js";
import { ResponseHelper } from "@/utils/response.util.js";

export class AuthController {
    constructor(private authService: AuthService) {}

    async login(req: TypedRequest<LoginInput>, res: Response) {
        const result = await this.authService.login(req.body);

        ResponseHelper.success(res, {
            data: result,
            message: SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
            statusCode: HTTP_STATUS.OK,
        });
    }

    async refreshToken(req: TypedRequest<RefreshTokenInput>, res: Response) {
        const result = await this.authService.refreshToken(
            req.body.refreshToken,
        );

        ResponseHelper.success(res, {
            data: result,
            message: SUCCESS_MESSAGES.TOKEN_REFRESHED,
            statusCode: HTTP_STATUS.OK,
        });
    }
}
