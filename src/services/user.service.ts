import bcrypt from "bcrypt";

import type { CreateUserInput } from "@/schemas/user.schema.js";

import { UserRepository } from "@/repositories/user.repository.js";
import { ConflictError } from "@/utils/errors.util.js";

interface User {
    createdAt: Date;
    email: string;
    id: string;
    name: null | string;
    password: string;
    refreshToken: null | string;
    role: "ADMIN" | "USER";
    updatedAt: Date;
}

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async createUser(inputData: CreateUserInput): Promise<User> {
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
}
