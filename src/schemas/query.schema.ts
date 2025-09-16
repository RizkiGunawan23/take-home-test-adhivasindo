import z from "zod";

// Schema for pagination query parameters
export const paginationSchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    page: z.coerce.number().int().min(1).default(1).optional(),
});

// Schema for user filter query parameters
export const userFilterSchema = z.object({
    email: z.string().optional(),
    name: z.string().min(1).optional(),
    role: z.enum(["USER", "ADMIN"]).optional(),
});

// Combined schema for user list query parameters
export const userListQuerySchema = paginationSchema.extend(
    userFilterSchema.shape,
);

// Schema for user ID parameter
export const userIdParamSchema = z.object({
    id: z.uuid("Invalid user ID format"),
});

// Schema for search by name path parameter
export const searchByNameParamSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
});

// Schema for search by name with pagination query parameters (only pagination fields)
export const searchByNameQuerySchema = paginationSchema;

// Schema for search by NIM path parameter
export const searchByNIMParamSchema = z.object({
    nim: z.string().regex(/^\d{10}$/, "NIM must be exactly 10 digits"),
});

// Schema for search by YMD path parameter
export const searchByYMDParamSchema = z.object({
    ymd: z
        .string()
        .regex(/^\d{8}$/, "YMD must be exactly 8 digits in YYYYMMDD format"),
});

// Schema for search by YMD with pagination query parameters (only pagination fields)
export const searchByYMDQuerySchema = paginationSchema;

export type PaginationQuery = z.infer<typeof paginationSchema>;
export type SearchByNameQuery = z.infer<typeof searchByNameParamSchema>;
export type SearchByNameWithPaginationQuery = z.infer<
    typeof searchByNameQuerySchema
>;
export type SearchByNIMQuery = z.infer<typeof searchByNIMParamSchema>;
export type SearchByYMDQuery = z.infer<typeof searchByYMDParamSchema>;
export type SearchByYMDWithPaginationQuery = z.infer<
    typeof searchByYMDQuerySchema
>;
export type UserFilterQuery = z.infer<typeof userFilterSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type UserListQuery = z.infer<typeof userListQuerySchema>;
