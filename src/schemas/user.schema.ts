import z from "zod";

export const createUserSchema = z.object({
    email: z.email("Invalid email format"),
    name: z.string().optional(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
    role: z.enum(["USER", "ADMIN"]).default("USER"),
});

export const updateUserSchema = z.object({
    email: z.email("Invalid email format").optional(),
    name: z.string().optional(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .optional(),
    role: z.enum(["USER", "ADMIN"]).optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update"
);

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
