import { generateAccessToken, generateRefreshToken } from "@/lib/auth/token";
import { connectDB } from "@/lib/db/connection";
import UserModel from "@/lib/db/Models/User.model";
import { sendWelcome } from "@/lib/email/send-welcome";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const error = searchParams.get("error");
        const code = searchParams.get("code");

        if (error) {
            return NextResponse.redirect(
                new URL(`/login?error=${encodeURIComponent(error)}`, req.url)
            )
        }
        if (!code) {
            return NextResponse.redirect(
                new URL(`login?error=missing_code`, req.url)
            )
        }

        const tokenResponse = await fetch("https://2oauth.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/oauth/google/callback`,
                grant_type: "authorization-code"
            })
        });

        if (!tokenResponse.ok) {
            throw new Error("Failed to exchange code for token")
        };

        const tokenData = await tokenResponse.json();

        const userInfoResponse = await fetch("https://www.googleapis.com/oauth/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        })
        if (!userInfoResponse.ok) {
            throw new Error("Failed to get user info")
        };

        const googleUser = await userInfoResponse.json();

        await connectDB();

        let user = await UserModel.findOne({
            googleId: googleUser.id
        });

        if (!user) {
            const existingEmailUser = await UserModel.findOne({
                email: googleUser.email
            });
            if (existingEmailUser) {
                existingEmailUser.googleId = googleUser.id;
                existingEmailUser.isVerified = true;
                await existingEmailUser.save();
                user = existingEmailUser;
            } else {
                user = new UserModel({
                    email: googleUser.email,
                    username: googleUser.email.split("@")[0] + "_" + Date.now(),
                    googleId: googleUser.id,
                    isVerified: true,
                    twoFactorEnabled: false
                });
                await user.save();

                await sendWelcome(user.email, user.username);
            }

        }
        const accessToken = generateAccessToken({
            userId: user._id.toString(),
            email: user.email,
            username: user.username,
            isVerified: user.isVerified,
            twoFactorEnabled: user.twoFactorEnabled
        });

        const refreshToken = generateRefreshToken(
            user._id.toString()
        );

        user.lastLogin = new Date();
        await user.save();

        const cookieStore = await cookies();

        cookieStore.set("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60,
            path: "/"
        });
        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60,
            path: "/"
        });
        return NextResponse.redirect(new URL("/dashboard", req.url))


    } catch (error) {
        console.error(" Google OAuth Error:", error);

        return NextResponse.redirect(
            new URL("/login?error=oauth_failed", req.url)
        )
    }
}