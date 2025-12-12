import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import UserModel from "@/lib/db/Models/User.model";
import { generateOTP } from "@/lib/auth/password";
import { sendVerifyEmail } from "@/lib/email/send-verification";
import { checkRateLimit } from "@/lib/auth/rate-limit";


export async function POST(req: NextRequest) {
    try {

        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const rateLimit = await checkRateLimit(
            ip,
            { maxLimits: 3, windowMS: 15 * 60 * 1000 },
            "send-verification"
        );

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Too many verification requests. Please try again later."
                },
                { status: 429 }
            );
        }


        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: "Invalid email format" },
                { status: 400 }
            );
        }


        await connectDB();


        const user = await UserModel.findOne({ email: email.toLowerCase() });

        if (!user) {

            return NextResponse.json(
                {
                    success: true,
                    message: "If your email is registered, you will receive a verification code."
                },
                { status: 200 }
            );
        }


        if (user.isVerified) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This email is already verified. Please login."
                },
                { status: 400 }
            );
        }


        const otp = await generateOTP(6);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes


        user.VerifyOTP = otp;
        user.OTPexpiry = otpExpiry;
        await user.save();

        try {
            await sendVerifyEmail(user.email, otp, user.username);
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to send verification email. Please try again."
                },
                { status: 500 }
            );
        }


        return NextResponse.json(
            {
                success: true,
                message: "Verification code sent successfully to your email",
                expiresIn: "10 minutes"
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Send Verification Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to send verification code. Please try again."
            },
            { status: 500 }
        );
    }
}