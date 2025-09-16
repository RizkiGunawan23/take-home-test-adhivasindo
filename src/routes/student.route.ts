import { Router } from "express";

import { StudentController } from "@/controllers/student.controller.js";
import { authenticateToken } from "@/middlewares/auth.middleware.js";
import {
    validateParams,
    validateQuery,
} from "@/middlewares/validation.middleware.js";
import {
    searchByNameParamSchema,
    searchByNameQuerySchema,
    searchByNIMParamSchema,
    searchByYMDParamSchema,
    searchByYMDQuerySchema,
} from "@/schemas/query.schema.js";

const router = Router();
const studentController = new StudentController();

router.use(authenticateToken as never);

// GET /v1/students/search/name/:name - Search students by name with pagination
router.get(
    "/v1/students/search/name/:name",
    validateParams(searchByNameParamSchema),
    validateQuery(searchByNameQuerySchema),
    studentController.searchByName.bind(studentController) as never,
);

// GET /v1/students/search/nim/:nim - Search students by NIM
router.get(
    "/v1/students/search/nim/:nim",
    validateParams(searchByNIMParamSchema),
    studentController.searchByNIM.bind(studentController) as never,
);

// GET /v1/students/search/ymd/:ymd - Search students by YMD
router.get(
    "/v1/students/search/ymd/:ymd",
    validateParams(searchByYMDParamSchema),
    validateQuery(searchByYMDQuerySchema),
    studentController.searchByYMD.bind(studentController) as never,
);

export { router as studentRoutes };
