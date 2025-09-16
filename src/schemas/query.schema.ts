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

export type PaginationQuery = z.infer<typeof paginationSchema>;
export type UserFilterQuery = z.infer<typeof userFilterSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type UserListQuery = z.infer<typeof userListQuerySchema>;
