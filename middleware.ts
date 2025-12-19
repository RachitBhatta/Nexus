import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/auth/token";
import { success } from "zod";

const PUBLIC_ROUTES = [
    "/login",
    "/signup",
    "verify-email",
    "/forgot-password",
    "/reset-password",
    "/terms",
    "/privacy",
    "/about"
];
const AUTH_ROUTES = [
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password"
];
const API_ROUTES = [
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
]

function isPublicRoute(pathname: string) {
    return PUBLIC_ROUTES.some((route) => route === pathname || pathname.startsWith(`${route}/`))
}
function isApiRoute(pathname: string) {
    return API_ROUTES.some((route) => route === pathname || pathname.startsWith(`${route}/`))
}
function isAuthRoute(pathname: string) {
    return AUTH_ROUTES.some((route) => route === pathname || pathname.startsWith(`${route}/`))
}
function isProtectedRoute(pathname: string) {
    return PROTECTED_ROUTES.some((route) => route === pathname || pathname.startsWith(`${route}/`))
}
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/auth/oauth") ||
        pathname.includes(".")
    ) {
        return NextResponse.next()
    }

    if (isApiRoute(pathname)) {
        return NextResponse.next();
    };

    if (isPublicRoute(pathname) && !isAuthRoute(pathname)) {
        return NextResponse.next();
    }

    const accessToken = req.cookies.get("accessToken")?.value;

    if (isAuthRoute(pathname)) {
        if (accessToken) {
            try {
                verifyToken(accessToken);

                return NextResponse.redirect(new URL("/dashboard", req.url))
            } catch (error) {
                return NextResponse.next();
            }
        }
    }
    if (isProtectedRoute(pathname)) {
        if (!accessToken) {
            const loginURL = new URL("/login", req.url)
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
            const response = NextResponse.redirect(new URL("/login", pathname));
            response.cookies.delete("accessToken");
            response.cookies.delete("refreshToken");
            return response;
        }
    }

    if (pathname.startsWith("/api") || !isPublicRoute(pathname)) {
        if (!accessToken) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, {
                status: 401
            })
        }
        try {
            verifyToken(accessToken);
            return NextResponse.next()
        } catch (error) {
            return NextResponse.json({
                success: false,
                message: "Invalid Token"
            }, {
                status: 401
            });
        }
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};