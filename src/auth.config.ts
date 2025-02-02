import { prisma } from "@/lib/db";
import { loginSchema } from "./features/auth/schema/login-schema";
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
                const { data, success } = loginSchema.safeParse(credentials);

                if (!success) {
                    throw new Error("Invalid credentials");
                }

                // verificar si existe el usuario en la base de datos
                const user = await prisma.user.findUnique({
                    where: {
                        email: data.email,
                    },
                });

                if (!user || !user.password) {
                    throw new Error("No user found");
                }

                // verificar si la contraseña es correcta
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

                    throw new Error("Please check Email send verification");
                }

                return user;
            },
        }),
    ],
} satisfies NextAuthConfig;
