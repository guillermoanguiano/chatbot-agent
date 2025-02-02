import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

const authRoutes = ["/sign-in", "/sign-up", "/verify-email"];
const apiAuthPrefix = "/api/auth";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
        return NextResponse.next();
    }

    if (isLoggedIn && authRoutes.includes(nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/", nextUrl));
    }

    if (
        !isLoggedIn &&
        !authRoutes.includes(nextUrl.pathname)
    ) {
        return NextResponse.redirect(new URL("/sign-in", nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
