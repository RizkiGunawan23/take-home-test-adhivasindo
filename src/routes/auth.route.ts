import { Router } from "express";

import { PrismaClient } from "@/../generated/prisma/index.js";
import { AuthController } from "@/controllers/auth.controller.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { UserRepository } from "@/repositories/user.repository.js";
import { loginSchema, refreshTokenSchema } from "@/schemas/auth.schema.js";
import { AuthService } from "@/services/auth.service.js";

const router = Router();

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post(
    "/v1/auth/login",
    validate(loginSchema),
    authController.login.bind(authController),
);
router.post(
    "/v1/auth/refresh",
    validate(refreshTokenSchema),
    authController.refreshToken.bind(authController),
);

export default router;
