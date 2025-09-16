import { Router } from "express";

import { UserController } from "@/controllers/user.controller.js";
import {
    authenticateToken,
    requireAdmin,
} from "@/middlewares/auth.middleware.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { UserRepository } from "@/repositories/user.repository.js";
import { createUserSchema } from "@/schemas/user.schema.js";
import { UserService } from "@/services/user.service.js";

import { PrismaClient } from "../../generated/prisma/index.js";

const router = Router();
const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.use(authenticateToken as never);

router.post(
    "/v1/users",
    requireAdmin as never,
    validate(createUserSchema),
    userController.createUser.bind(userController) as never,
);

export { router as userRoutes };
