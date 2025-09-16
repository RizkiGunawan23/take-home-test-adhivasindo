import bcrypt from "bcrypt";

import { PrismaClient, Role } from "../generated/prisma";

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    const hashedPassword = await bcrypt.hash("Admin123", 10);

    const admin = await prisma.user.upsert({
        create: {
            email: "admin@example.com",
            name: "Administrator",
            password: hashedPassword,
            role: Role.ADMIN,
        },
        update: {},
        where: { email: "admin@example.com" },
    });

    const user = await prisma.user.upsert({
        create: {
            email: "user1@example.com",
            name: "User One",
            password: await bcrypt.hash("User1234", 10),
            role: Role.USER,
        },
        update: {},
        where: { email: "user1@example.com" },
    });

    console.log("Seeding completed:", { admin, user });
}

main()
    .catch((e: unknown) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
