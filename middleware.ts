import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth/token";


const PUBLIC_ROUTES = [
    "/terms",
    "/privacy",
    "/about"
];

const AUTH_ROUTES = [
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password"
];


const PUBLIC_API_ROUTES = [
    "/api/auth/login",
    "/api/auth/signup",
    "/api/auth/forgot-password",
    "/api/auth/verify-email",
    "/api/auth/reset-password",
    "/api/auth/oauth",
    "/api/health"
];

const PROTECTED_ROUTES = [
    "/dashboard",
    "/settings",
    "/projects",
    "/chats",
    "/2fa-setup"
];

function matchesRoute(pathname: string, routes: string[]): boolean {
    return routes.some((route) =>
        pathname === route || pathname.startsWith(`${route}/`)
    );
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;


    if (
        pathname.startsWith("/_next") ||
        pathname === "/api/auth/oauth/callback" ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const accessToken = req.cookies.get("accessToken")?.value;

    if (matchesRoute(pathname, AUTH_ROUTES)) {
        if (accessToken) {
            try {
                verifyToken(accessToken);

                return NextResponse.redirect(new URL("/dashboard", req.url));
            } catch (error) {

                return NextResponse.next();
            }
        }

        return NextResponse.next();
    }


    if (matchesRoute(pathname, PUBLIC_ROUTES)) {
        return NextResponse.next();
    }

    if (matchesRoute(pathname, PUBLIC_API_ROUTES)) {
        return NextResponse.next();
    }
    if (pathname.startsWith("/api")) {
        if (!accessToken) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        try {
            const decoded = verifyToken(accessToken);
            const response = NextResponse.next();

            response.headers.set("x-user-id", decoded.userId);
            response.headers.set("x-user-email", decoded.email);
            response.headers.set("x-user-name", decoded.username);
            return response;
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid Token" },
                { status: 401 }
            );
        }
    }


    if (matchesRoute(pathname, PROTECTED_ROUTES)) {
        if (!accessToken) {
            const loginURL = new URL("/login", req.url);
            loginURL.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginURL);
        }

        try {
            const decoded = verifyToken(accessToken);

            if (!decoded.isVerified && pathname !== "/verify-email") {
                return NextResponse.redirect(new URL("/verify-email", req.url));
            }

            const response = NextResponse.next();

            response.headers.set("x-user-id", decoded.userId);
            response.headers.set("x-user-email", decoded.email);
            response.headers.set("x-user-name", decoded.username);
            return response;
        } catch (error) {

            const response = NextResponse.redirect(new URL("/login", req.url));
            response.cookies.delete("accessToken");
            response.cookies.delete("refreshToken");
            return response;
        }
    }

    if (!accessToken) {
        const loginURL = new URL("/login", req.url);
        loginURL.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginURL);
    }

    try {
        verifyToken(accessToken);
        return NextResponse.next();
    } catch (error) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
