import { checkRateLimit } from "@/lib/auth/rate-limit";
import { connectDB } from "@/lib/db/connection";
import UserModel from "@/lib/db/Models/User.model";
import { verifySchema } from "@/lib/db/Schemas/Verify.schema";
import { sendWelcome } from "@/lib/email/send-welcome";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";


export async function POST(req:NextRequest){
    try {
        const ip=req.headers.get("z-forwarded-for")||"unknown";
        const rateLimit=await checkRateLimit(
            ip,{
                maxLimits:5,
                windowMS:15*60*1000
            },
            "verify-email"
        );
        if(!rateLimit.allowed){
            return NextResponse.json(
                {
                    success:false,
                    message:"Too many verification attempts .Try again later"
                },
                {
                    status:429
                }
            )
        };

        const body=await req.json();
        const {email}=body;
        const {verifyOTP}=verifySchema.parse(body);

        if(!email){
            return NextResponse.json(
                {
                    success:false,
                    message:"Email is required"
                },{
                    status:400
                }
            )
        };

        await connectDB();
        const user=await UserModel.findOne(
            {email:email.toLowerCase()}
        );
        if(!user){
            return NextResponse.json(
                {
                    success:false,
                    message:"User not found"
                },{
                    status:404
                }
            )
        };
        if(user.isVerified){
            return NextResponse.json(
                {
                    success:false,
                    message:"Email is already verified"
                },{
                    status:400
                }
            )
        }
        if(!user.OTPexpiry || user.OTPexpiry<new Date()){
            return NextResponse.json(
                {
                    success:false,
                    message:"Verification Code has expired.Please request a new one"
                },{
                    status:400
                }
            )
        };
        if(user.VerifyOTP!==verifyOTP){
            return NextResponse.json(
                {
                    success:false,
                    message:"Invalid Verification Code"
                },{
                    status:400
                }
            )
        };

        user.isVerified = true;
        user.VerifyOTP = undefined; 
        user.OTPexpiry= undefined; 
        await user.save();

        await sendWelcome(user.email,user.username);

        return NextResponse.json(
            {
                success:true,
                message:"Email verified successfully. YOU can now login",
                user: {
                    email: user.email,
                    username: user.username,
                    isVerified: true
                }
            },{
                status:200
            }
        )

    } catch (error:any) {
            console.error("Email Verification Error:", error);

        if (error.name === "ZodError") {
        return NextResponse.json(
            { success: false, message: "Invalid verification code format" },
            { status: 400 }
        );
        }

        return NextResponse.json(
        { success: false, message: "Verification failed. Please try again." },
        { status: 500 }
        );
    }
}