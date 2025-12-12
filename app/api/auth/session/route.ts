import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/token";
import { connectDB } from "@/lib/db/connection";
import UserModel from "@/lib/db/Models/User.model";
import { cookies } from "next/headers";


export async function GET(req: NextRequest) {
    try {

        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return NextResponse.json(
                {
                    success: false,
                    authenticated: false,
                    message: "No active session"
                },
                { status: 401 }
            );
        }

        let decodedToken;
        try {
            decodedToken = verifyToken(accessToken);
        } catch (error) {

            cookieStore.delete("accessToken");
            cookieStore.delete("refreshToken");

            return NextResponse.json(
                {
                    success: false,
                    authenticated: false,
                    message: "Session expired"
                },
                { status: 401 }
            );
        }


        await connectDB();


        const user = await UserModel.findById(decodedToken.userId).select(
            "-password -VerifyOTP -OTPexpiry -resetPasswordToken -passwordResetExpiry -twoFactorSecret -backupCodes"
        );

        if (!user) {

            cookieStore.delete("accessToken");
            cookieStore.delete("refreshToken");

            return NextResponse.json(
                {
                    success: false,
                    authenticated: false,
                    message: "User not found"
                },
                { status: 404 }
            );
        }

        if (user.isAccountLocked()) {
            return NextResponse.json(
                {
                    success: false,
                    authenticated: true,
                    accountLocked: true,
                    message: "Account is temporarily locked"
                },
                { status: 423 }
            );
        }


        return NextResponse.json(
            {
                success: true,
                authenticated: true,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    isVerified: user.isVerified,
                    twoFactorEnabled: user.twoFactorEnabled,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Session Check Error:", error);

        return NextResponse.json(
            {
                success: false,
                authenticated: false,
                message: "Session verification failed"
            },
            { status: 500 }
        );
    }
}