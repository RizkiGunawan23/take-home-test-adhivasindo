import { Router } from "express";

import { UserController } from "@/controllers/user.controller.js";
import {
    authenticateToken,
    requireAdmin,
} from "@/middlewares/auth.middleware.js";
import { validate, validateParams, validateQuery } from "@/middlewares/validation.middleware.js";
import { UserRepository } from "@/repositories/user.repository.js";
import { userIdParamSchema, userListQuerySchema } from "@/schemas/query.schema.js";
import { createUserSchema } from "@/schemas/user.schema.js";
import { UserService } from "@/services/user.service.js";

import { PrismaClient } from "../../generated/prisma/index.js";

const router = Router();
const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.use(authenticateToken as never);

// GET /v1/users - Get all users with pagination and filters
router.get(
    "/v1/users",
    requireAdmin as never,
    validateQuery(userListQuerySchema),
    userController.getAllUsers.bind(userController) as never,
);

// GET /v1/users/:id - Get user by ID
router.get(
    "/v1/users/:id",
    requireAdmin as never,
    validateParams(userIdParamSchema),
    userController.getUserById.bind(userController) as never,
);

// POST /v1/users - Create new user
router.post(
    "/v1/users",
    requireAdmin as never,
    validate(createUserSchema),
    userController.createUser.bind(userController) as never,
);

export { router as userRoutes };
