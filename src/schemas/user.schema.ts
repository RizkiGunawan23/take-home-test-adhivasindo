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

export type CreateUserInput = z.infer<typeof createUserSchema>;
