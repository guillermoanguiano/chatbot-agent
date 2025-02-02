"use server";

import { signIn } from "@/auth";
import { SignInSchema } from "@/features/auth/schema/sign-in-schema";
import { SignUpSchema } from "@/features/auth/schema/sign-up-schema";
import { prisma } from "@/lib/db";
import { sendEmailVerification } from "@/lib/mail";
import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { nanoid } from 'nanoid';
import { SignUpResponse } from "@/types/auth";

export const signInAction = async (values: SignInSchema): Promise<{ success: boolean, error?: string }> => {
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

export async function signUpAction(values: SignUpSchema): Promise<SignUpResponse> {
    const { email, password, name } = values;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: "Email already in use" };
        }

        await prisma.verificationToken.deleteMany({
            where: {
                identifier: email,
            },
        });

        await prisma.verificationToken.deleteMany({
            where: {
                expires: {
                    lt: new Date(),
                },
            },
        });

        const verificationToken = nanoid();
        const hashedPassword = await hash(password, 10);


        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    emailVerified: null,
                    role: 'user',
                },
            });

            const token = await tx.verificationToken.create({
                data: {
                    identifier: email,
                    token: verificationToken,
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                },
            });

            return { user, token };
        });

        await sendEmailVerification(email, verificationToken);

        return {
            success: true,
            user: {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role,
            }
        };

    } catch (error) {
        console.error("Error during registration:", error);
        try {
            await prisma.$transaction(async (tx) => {
                await tx.verificationToken.deleteMany({
                    where: {
                        identifier: email,
                    },
                });

                await tx.user.deleteMany({
                    where: {
                        email,
                        emailVerified: null,
                    },
                });
            });
        } catch (cleanupError) {
            console.error("Error cleaning up after failed registration:", cleanupError);
        }

        return { error: "Something went wrong during registration" };
    }
}