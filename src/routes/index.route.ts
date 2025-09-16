import { Router } from "express";

import authRoutes from "@/routes/auth.route.js";
import { studentRoutes } from "@/routes/student.route.js";
import { userRoutes } from "@/routes/user.route.js";

const router = Router();

router.use("", authRoutes);
router.use("", userRoutes);
router.use("", studentRoutes);

export default router;
