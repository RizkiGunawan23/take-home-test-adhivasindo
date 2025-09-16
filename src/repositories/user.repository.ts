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

    async findAll(options: {
        email?: string;
        limit?: number;
        name?: string;
        page?: number;
        role?: "USER" | "ADMIN";
    }) {
        const { email, limit = 10, name, page = 1, role } = options;

        const skip = (page - 1) * limit;

        // Build where clause for filters
        const where: {
            email?: { contains: string; mode: "insensitive" };
            name?: { contains: string; mode: "insensitive" };
            role?: "USER" | "ADMIN";
        } = {};

        if (email) {
            where.email = {
                contains: email,
                mode: "insensitive",
            };
        }
        if (name) {
            where.name = {
                contains: name,
                mode: "insensitive",
            };
        }
        if (role) {
            where.role = role;
        }

        // Get total count for pagination
        const totalItems = await this.prisma.user.count({ where });

        // Get users with pagination
        const users = await this.prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                createdAt: true,
                email: true,
                id: true,
                name: true,
                role: true,
                updatedAt: true,
            },
            skip,
            take: limit,
            where,
        });

        return {
            currentPage: page,
            itemsPerPage: limit,
            totalItems,
            users,
        };
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

    async delete(id: string) {
        return await this.prisma.user.delete({
            where: { id },
        });
    }
}
