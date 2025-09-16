/* eslint-disable perfectionist/sort-classes */
/* eslint-disable perfectionist/sort-objects */
import bcrypt from "bcrypt";

import type { UserListQuery } from "@/schemas/query.schema.js";
import type {
    CreateUserInput,
    UpdateUserInput,
} from "@/schemas/user.schema.js";
import type {
    CreateUserResponse,
    UpdateUserResponse,
    UserListResponse,
    UserResponse,
} from "@/types/index.types.js";

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

    async updateUser(
        id: string,
        inputData: UpdateUserInput,
    ): Promise<UpdateUserResponse> {
        // Check if user exists
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new NotFoundError("User not found");
        }

        // Check if email is being updated and if it conflicts with another user
        if (inputData.email && inputData.email !== existingUser.email) {
            const userWithEmail = await this.userRepository.findByEmail(
                inputData.email,
            );
            if (userWithEmail) {
                throw new ConflictError("User with this email already exists");
            }
        }

        // Prepare update data
        const updateData: {
            email?: string;
            name?: null | string;
            password?: string;
            role?: "ADMIN" | "USER";
        } = {};

        if (inputData.email !== undefined) {
            updateData.email = inputData.email;
        }
        if (inputData.name !== undefined) {
            updateData.name = inputData.name;
        }
        if (inputData.role !== undefined) {
            updateData.role = inputData.role;
        }
        if (inputData.password !== undefined) {
            updateData.password = await bcrypt.hash(inputData.password, 10);
        }

        const user = await this.userRepository.update(id, updateData);

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }

    async deleteUser(id: string): Promise<void> {
        // Check if user exists
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new NotFoundError("User not found");
        }

        await this.userRepository.delete(id);
    }
}
