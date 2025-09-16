import { Request, Response } from "express";

import { SUCCESS_MESSAGES } from "@/constants/index.js";
import { LoginInput, loginSchema } from "@/schemas/auth.schema.js";
import { AuthService } from "@/services/auth.service.js";
import { ResponseUtil } from "@/utils/response.util.js";

export class AuthController {
    constructor(private authService: AuthService) {}

    async login(req: Request, res: Response) {
        const { body } = loginSchema.parse({ body: req.body as LoginInput });

        const result = await this.authService.login(body);

        const { response, statusCode } = ResponseUtil.success({
            data: result,
            message: SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
            statusCode: 200,
        });
        res.status(statusCode).json(response);
    }

    async refreshToken(req: Request, res: Response) {
        const { refreshToken } = req.body as { refreshToken: string };

        if (!refreshToken) {
            const { response, statusCode } = ResponseUtil.validationError({
                field: "refreshToken",
                message: "Refresh token is required",
                statusCode: 400,
            });
            return res.status(statusCode).json(response);
        }

        const result = await this.authService.refreshToken(refreshToken);

        const { response, statusCode } = ResponseUtil.success({
            data: result,
            message: SUCCESS_MESSAGES.TOKEN_REFRESHED,
            statusCode: 200,
        });
        res.status(statusCode).json(response);
    }
}
