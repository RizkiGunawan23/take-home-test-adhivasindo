import { Router } from "express";

import { PrismaClient } from "@/../generated/prisma/index.js";
import { AuthController } from "@/controllers/auth.controller.js";
import { UserRepository } from "@/repositories/user.repository.js";
import { AuthService } from "@/services/auth.service.js";

const router = Router();

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post("/v1/auth/login", (req, res) => authController.login(req, res));
router.post("/v1/auth/refresh", (req, res) =>
    authController.refreshToken(req, res),
);

export default router;
