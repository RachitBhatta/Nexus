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
            { maxLimits: 3, windowMS: 15 * 60 * 1000 }, // 3 requests per 15 minutes
            "resend-verification"
        );

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Too many resend requests. Try again later."
                },
                { status: 429 }
            );
        }
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { success: false,
                    message: "Email is required" 
                },
                { status: 400 }
            );
        }

        
        await connectDB();

        const user = await UserModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                {
                    success: true,
                    message: "If the email exists, a verification code has been sent."
                },
                { status: 200 }
            );
        }

        
        if (user.isVerified) {
            return NextResponse.json(
                { success: false, message: "Email already verified" },
                { status: 400 }
            );
        }

        const newOTP = await generateOTP(6);
        const newExpiry = new Date(Date.now() + 10 * 60 * 1000); 

        user.VerifyOTP = newOTP;
        user.OTPexpiry = newExpiry;
        await user.save();

        await sendVerifyEmail(user.email, newOTP, user.username);

        
        return NextResponse.json(
            {
                success: true,
                message: "Verification code sent to your email"
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Resend Verification Error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to resend verification code" },
            { status: 500 }
        );
    }
}