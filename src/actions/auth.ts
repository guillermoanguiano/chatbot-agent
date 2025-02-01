"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const signInWithProvider = async (providerId: string, url: string) => {
    try {
        await signIn(providerId, {
            redirectTo: url,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            console.log(error);
            return redirect(`/sign-in-error?error=${error.type}`)
        }
        throw error;
    }
};

export const signInWithCredentials = async (formData: FormData) => {
    try {
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            console.log(error);
            return redirect(`/sign-in-error?error=${error.type}`)
        }
        throw error;
    }
}