import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get("token")
    const baseUrl = request.nextUrl.origin

    if (!token) {
        return NextResponse.redirect(new URL("/sign-in?error=invalid-token", baseUrl))
    }

    try {
        const verifyToken = await prisma.verificationToken.findFirst({
            where: { token },
        })

        if (!verifyToken) {
            return NextResponse.redirect(new URL("/sign-in?error=invalid-token", baseUrl))
        }

        if (verifyToken.expires < new Date()) {
            return NextResponse.redirect(new URL("/sign-in?error=expired", baseUrl))
        }

        const user = await prisma.user.findUnique({
            where: {
                email: verifyToken.identifier,
            },
        })

        if (user?.emailVerified) {
            return NextResponse.redirect(new URL("/sign-in?error=already-verified", baseUrl))
        }

        await prisma.$transaction([
            prisma.user.update({
                where: {
                    email: verifyToken.identifier,
                },
                data: {
                    emailVerified: new Date(),
                },
            }),
            prisma.verificationToken.delete({
                where: {
                    identifier: verifyToken.identifier,
                },
            }),
        ])

        return NextResponse.redirect(new URL("/sign-in?verified=true", baseUrl))
    } catch (error) {
        console.error("Verification error:", error)
        return NextResponse.redirect(new URL("/sign-in?error=server-error", baseUrl))
    }
}

