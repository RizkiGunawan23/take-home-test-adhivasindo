import z from "zod";

export const loginSchema = z.object({
    body: z.object({
        email: z.email("Invalid email format"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter",
            ),
    }),
});

export type LoginInput = z.infer<typeof loginSchema>;
