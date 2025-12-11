import { checkRateLimit } from "@/lib/auth/rate-limit";
import { generateResetToken } from "@/lib/auth/token";
import { connectDB } from "@/lib/db/connection";
import UserModel from "@/lib/db/Models/User.model";
import { forgotPasswordSchema } from "@/lib/db/Schemas/password-reset.schema";
import { sendResetPassword } from "@/lib/email/send-reset-password";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";


export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const rateLimit = await checkRateLimit(
            ip,
            { maxLimits: 2, windowMS: 30 * 60 * 1000 },
            "forgot-password"
        );
        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Too many password reset requests. Try again later"
                }
            )
        };

        const body = await req.json();
        const { email } = forgotPasswordSchema.parse(body);

        await connectDB();

        const user = await UserModel.findOne(
            { email: email }
        );
        if (!user) {
            return NextResponse.json(
                {
                    success: true,
                    message: "If your email is registered, you will receive a password reset link."
                }, {
                status: 200
            }
            )
        };
        if (!user.isVerified) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please verify your email first before resetting password."
                },
                { status: 403 }
            );
        }

        const resetToken = generateResetToken(user.email);
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

        user.resetPasswordToken = resetToken;
        user.passwordResetExpiry = resetTokenExpiry;
        await user.save();
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
        const resetLink = `${BASE_URL}/reset-password?token=${resetToken}`;

        await sendResetPassword(user.email, user.username, resetLink);
        return NextResponse.json(
            {
                success: true,
                message: "Password Link has been sent to your email"
            }, {
            status: 200
        }
        )

    } catch (error: any) {
        console.error("Forgot Password Error:", error);

        if (error.name === "ZodError") {
            return NextResponse.json(
                { success: false, message: "Invalid email format" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Failed to process password reset request" },
            { status: 500 }
        );
    }
}