import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import UserModel from "@/lib/db/Models/User.model";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth/token";
import { sendWelcome } from "@/lib/email/send-welcome";
import { cookies } from "next/headers";



export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
            return NextResponse.redirect(
                new URL(`/login?error=${encodeURIComponent(error)}`, req.url)
            );
        }

        if (!code) {
            return NextResponse.redirect(
                new URL("/login?error=missing_code", req.url)
            );
        }


        const tokenResponse = await fetch(
            "https://github.com/login/oauth/access_token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    client_id: process.env.GITHUB_CLIENT_ID!,
                    client_secret: process.env.GITHUB_CLIENT_SECRET!,
                    code,
                    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/oauth/github/callback`
                })
            }
        );

        if (!tokenResponse.ok) {
            throw new Error("Failed to exchange code for token");
        }

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            throw new Error(tokenData.error_description || "OAuth failed");
        }


        const userInfoResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        if (!userInfoResponse.ok) {
            throw new Error("Failed to get user info");
        }

        const githubUser = await userInfoResponse.json();


        const emailResponse = await fetch("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        let email = githubUser.email;

        if (!email && emailResponse.ok) {
            const emails = await emailResponse.json();
            const primaryEmail = emails.find((e: any) => e.primary && e.verified);
            email = primaryEmail?.email || emails[0]?.email;
        }

        if (!email) {
            return NextResponse.redirect(
                new URL("/login?error=no_email", req.url)
            );
        }

        await connectDB();

        let user = await UserModel.findOne({ githubId: githubUser.id.toString() });

        if (!user) {

            const existingEmailUser = await UserModel.findOne({ email });

            if (existingEmailUser) {

                existingEmailUser.githubId = githubUser.id.toString();
                existingEmailUser.isVerified = true;
                await existingEmailUser.save();
                user = existingEmailUser;
            } else {

                user = new UserModel({
                    email,
                    username: githubUser.login || email.split("@")[0] + "_" + Date.now(),
                    githubId: githubUser.id.toString(),
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

        const refreshToken = generateRefreshToken(user._id.toString());


        user.lastLogin = new Date();
        await user.save();


        const cookieStore = await cookies();

        cookieStore.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
            path: "/"
        });

        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60,
            path: "/"
        });


        return NextResponse.redirect(new URL("/dashboard", req.url));

    } catch (error) {
        console.error("GitHub OAuth Error:", error);

        return NextResponse.redirect(
            new URL("/login?error=oauth_failed", req.url)
        );
    }
}