/* eslint-disable perfectionist/sort-objects */
import { Request, Response } from "express";

import type {
    SearchByNameWithPaginationQuery,
    SearchByYMDWithPaginationQuery,
} from "@/schemas/query.schema.js";
import type {
    StudentData,
    StudentSearchRequest,
    TypedRequest,
} from "@/types/index.types.js";

import { HTTP_STATUS } from "@/constants/index.js";
import { ExternalDataService } from "@/services/externalData.service.js";
import { ResponseHelper } from "@/utils/response.util.js";

export class StudentController {
    async searchByName(
        req: TypedRequest<SearchByNameWithPaginationQuery>,
        res: Response,
    ) {
        const { name } = (
            req as unknown as Request & { validatedParams: { name: string } }
        ).validatedParams;

        const result = await ExternalDataService.searchByNameWithPagination({
            nama: name,
            limit: req.body.limit,
            page: req.body.page,
        });

        ResponseHelper.success(res, {
            statusCode: HTTP_STATUS.OK,
            message: "Students retrieved successfully",
            data: result,
        });
    }

    async searchByNIM(req: TypedRequest<StudentSearchRequest>, res: Response) {
        const { nim } = (
            req as unknown as Request & { validatedParams: { nim: string } }
        ).validatedParams;

        const students: StudentData[] =
            await ExternalDataService.searchByNIM(nim);

        // Sort by NIM for consistent ordering
        students.sort((a, b) => a.nim.localeCompare(b.nim));

        ResponseHelper.success(res, {
            statusCode: HTTP_STATUS.OK,
            message: "Students retrieved successfully",
            data: students,
        });
    }

    async searchByYMD(
        req: TypedRequest<SearchByYMDWithPaginationQuery>,
        res: Response,
    ) {
        const { ymd } = (
            req as unknown as Request & { validatedParams: { ymd: string } }
        ).validatedParams;

        const result = await ExternalDataService.searchByYMDWithPagination({
            ymd,
            limit: req.body.limit,
            page: req.body.page,
        });

        ResponseHelper.success(res, {
            statusCode: HTTP_STATUS.OK,
            message: "Students retrieved successfully",
            data: result,
        });
    }
}
