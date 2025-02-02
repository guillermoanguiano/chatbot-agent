"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/features/auth/schema/login-schema";
import { AuthError } from "next-auth";
import { z } from "zod";

export const signInWithCredentials = async (values: z.infer<typeof loginSchema>) => {
    try {
        await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            console.log(error);
            return { success: false, error: error.cause?.err?.message };
        }
        return { success: false, error: "Server Error 500" };
    }
}