import { Response } from "express";

import type { CreateUserInput } from "@/schemas/user.schema.js";
import type { AuthTypedRequest } from "@/types/index.js";

import { HTTP_STATUS, SUCCESS_MESSAGES } from "@/constants/index.js";
import { UserService } from "@/services/user.service.js";
import { ResponseHelper } from "@/utils/response.util.js";

export class UserController {
    constructor(private userService: UserService) {}

    async createUser(req: AuthTypedRequest<CreateUserInput>, res: Response) {
        const user = await this.userService.createUser(req.body);

        ResponseHelper.success(res, {
            data: {
                email: user.email,
                id: user.id,
                name: user.name,
                role: user.role,
            },
            message: SUCCESS_MESSAGES.USER_CREATED,
            statusCode: HTTP_STATUS.CREATED,
        });
    }
}
