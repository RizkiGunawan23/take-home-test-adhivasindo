/* eslint-disable perfectionist/sort-object-types */
/* eslint-disable perfectionist/sort-classes */
/* eslint-disable perfectionist/sort-union-types */
import { PrismaClient } from "../../generated/prisma/index.js";

export class UserRepository {
    constructor(private prisma: PrismaClient) {}

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return await this.prisma.user.findUnique({
            where: { id },
        });
    }

    async create(data: {
        email: string;
        password: string;
        name?: string | null;
        role: "USER" | "ADMIN";
    }) {
        return await this.prisma.user.create({
            data,
        });
    }

    async update(
        id: string,
        data: {
            email?: string;
            name?: string | null;
            password?: string;
            refreshToken?: string | null;
            role?: "USER" | "ADMIN";
        },
    ) {
        return await this.prisma.user.update({
            data,
            where: { id },
        });
    }
}
