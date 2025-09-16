/* eslint-disable perfectionist/sort-classes */
import { Request, Response } from "express";

import type { UserListQuery } from "@/schemas/query.schema.js";
import type {
    CreateUserInput,
    UpdateUserInput,
} from "@/schemas/user.schema.js";
import type { AuthTypedRequest, TypedRequest } from "@/types/index.js";

import { HTTP_STATUS, SUCCESS_MESSAGES } from "@/constants/index.js";
import { UserService } from "@/services/user.service.js";
import { ResponseHelper } from "@/utils/response.util.js";

export class UserController {
    constructor(private userService: UserService) {}

    async createUser(req: AuthTypedRequest<CreateUserInput>, res: Response) {
        const user = await this.userService.createUser(req.body);

        ResponseHelper.success(res, {
            data: user,
            message: SUCCESS_MESSAGES.USER_CREATED,
            statusCode: HTTP_STATUS.CREATED,
        });
    }

    async getAllUsers(req: TypedRequest<UserListQuery>, res: Response) {
        const users = await this.userService.getAllUsers(req.body);

        ResponseHelper.success(res, {
            data: users,
            message: SUCCESS_MESSAGES.USERS_RETRIEVED,
            statusCode: HTTP_STATUS.OK,
        });
    }

    async getUserById(req: Request, res: Response) {
        const { id } = (req as Request & { validatedParams: { id: string } })
            .validatedParams;
        const user = await this.userService.getUserById(id);

        ResponseHelper.success(res, {
            data: user,
            message: SUCCESS_MESSAGES.USER_RETRIEVED,
            statusCode: HTTP_STATUS.OK,
        });
    }

    async updateUser(req: Request, res: Response) {
        const { id } = (req as Request & { validatedParams: { id: string } })
            .validatedParams;
        const user = await this.userService.updateUser(
            id,
            (req as AuthTypedRequest<UpdateUserInput>).body,
        );

        ResponseHelper.success(res, {
            data: user,
            message: SUCCESS_MESSAGES.USER_UPDATED,
            statusCode: HTTP_STATUS.OK,
        });
    }

    async deleteUser(req: Request, res: Response) {
        const { id } = (req as Request & { validatedParams: { id: string } })
            .validatedParams;
        await this.userService.deleteUser(id);

        ResponseHelper.successNoData(res, {
            message: SUCCESS_MESSAGES.USER_DELETED,
            statusCode: HTTP_STATUS.OK,
        });
    }
}
