import { Router } from "express";

import authRoutes from "@/routes/auth.route.js";
import { userRoutes } from "@/routes/user.route.js";

const router = Router();

router.use("", authRoutes);
router.use("", userRoutes);

export default router;
