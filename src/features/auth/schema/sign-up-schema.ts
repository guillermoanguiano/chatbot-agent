import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters",
    }),
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters",
    }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;