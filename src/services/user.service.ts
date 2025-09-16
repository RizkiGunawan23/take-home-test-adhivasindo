/* eslint-disable perfectionist/sort-objects */
import bcrypt from "bcrypt";

import type { UserListQuery } from "@/schemas/query.schema.js";
import type { CreateUserInput } from "@/schemas/user.schema.js";
import type {
    CreateUserResponse,
    UserListResponse,
    UserResponse,
} from "@/types/index.js";

import { UserRepository } from "@/repositories/user.repository.js";
import { ConflictError, NotFoundError } from "@/utils/errors.util.js";

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async createUser(inputData: CreateUserInput): Promise<CreateUserResponse> {
        const data = inputData;

        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ConflictError("User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.userRepository.create({
            email: data.email,
            name: data.name ?? null,
            password: hashedPassword,
            role: data.role,
        });

        return user;
    }

    async getAllUsers(query: UserListQuery): Promise<UserListResponse> {
        const { email, limit = 10, name, page = 1, role } = query;

        const result = await this.userRepository.findAll({
            email,
            limit,
            name,
            page,
            role,
        });

        const totalPages = Math.ceil(result.totalItems / limit);

        return {
            pagination: {
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                itemsPerPage: limit,
                totalItems: result.totalItems,
                totalPages,
            },
            users: result.users.map((user) => ({
                createdAt: user.createdAt.toISOString(),
                email: user.email,
                id: user.id,
                name: user.name,
                role: user.role,
                updatedAt: user.updatedAt.toISOString(),
            })),
        };
    }

    async getUserById(id: string): Promise<UserResponse> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }
}
