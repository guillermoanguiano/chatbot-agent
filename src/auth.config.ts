import { prisma } from "@/lib/db";
import { signInSchema } from "./features/auth/schema/sign-in-schema";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { sendEmailVerification } from "./lib/mail";

import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
    providers: [
        Google,
        GitHub,
        Credentials({
            authorize: async (credentials) => {
                const { data, success } = signInSchema.safeParse(credentials);

                if (!success) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: data.email,
                    },
                    include: {
                        accounts: true,
                    },
                });

                if (!user) {
                    throw new Error("No user found");
                }

                if (user.accounts && user.accounts.length > 0) {
                    const providers = user.accounts.map(account => account.provider);
                    throw new Error(`This email is already associated with ${providers.join(', ')}. Please sign in with ${providers.length > 1 ? 'one of those accounts' : 'that account'}.`);
                }

                if (!user.password) {
                    throw new Error("This email is registered with a social login. Please use the appropriate sign in method.");
                }

                const isValid = await bcrypt.compare(data.password, user.password);

                if (!isValid) {
                    throw new Error("Incorrect password");
                }

                if (!user.emailVerified) {
                    const verifyTokenExits = await prisma.verificationToken.findFirst({
                        where: {
                            identifier: user.email,
                        },
                    });

                    if (verifyTokenExits?.identifier) {
                        await prisma.verificationToken.delete({
                            where: {
                                identifier: user.email,
                            },
                        });
                    }

                    const token = nanoid();

                    await prisma.verificationToken.create({
                        data: {
                            identifier: user.email,
                            token,
                            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
                        },
                    });

                    await sendEmailVerification(user.email, token);

                    throw new Error("Please check Email verification");
                }

                return user;
            },
        }),
    ],
} satisfies NextAuthConfig;