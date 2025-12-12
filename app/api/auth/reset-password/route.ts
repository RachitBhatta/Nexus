import { hashPassword } from "@/lib/auth/password";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { verifyResetToken, verifyToken } from "@/lib/auth/token";
import { connectDB } from "@/lib/db/connection";
import UserModel from "@/lib/db/Models/User.model";
import { resetPasswordSchema } from "@/lib/db/Schemas/password-reset.schema";
import { sendPasswordChanged } from "@/lib/email/send-password-changed";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";


export async function POST(req:NextRequest){
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const rateLimit=await checkRateLimit(
            ip,
            {maxLimits:3,windowMS:60*60*1000},
            "reset-password"
        );

        if(!rateLimit.allowed){
            return NextResponse.json(
                {
                    success:false,
                    message:"Too many password reset attempts. Try again"
                },{
                    status:429
                }
            )
        };
        const body=await req.json();
        const {token,newPassword}=resetPasswordSchema.parse(body);

        let decodedToken;
        try {
            decodedToken=verifyResetToken(token)
        } catch (error) {
            return NextResponse.json(
                {
                    success:false,
                    message:"Invalid or expired reset token"
                },{
                    status:400
                }
            )
        }

        await connectDB();

        const user=await UserModel.findOne({
            email:decodedToken.email,
            resetPasswordToken:token
        });
        if(!user){
            return NextResponse.json(
                {
                    success:false,
                    message:"Invalid Reset Token"
                },{
                    status:400
                }
            )
        }
        if(!user.passwordResetExpiry || user.passwordResetExpiry<new Date()){
            return NextResponse.json(
                {
                    success:false,
                    message:"Reset Token has expired"
                },{
                    status:400
                }
            )
        };
        const hashedPassword=await hashPassword(newPassword);
        user.password=hashedPassword;
        user.resetPasswordToken=undefined;
        user.passwordResetExpiry=undefined;
        user.failedLoginAttempts=0;
        user.accountLockedUntil=undefined;

        await user.save();

        await sendPasswordChanged(user.email,user.username);

        return NextResponse.json(
            {
                success:true,
                message:"Password reset successfully. YOu can now login with your new password"
            },{
                status:200
            }
        )
    } catch (error:any) {
        console.error("Password reset Error",error);
        if(error.name==="ZobError"){
            return NextResponse.json(
                {
                    success:false,
                    message:"Invalid Input. Password must meet security requirements"
                },{
                    status:400
                }
            )
        };
        return NextResponse.json(
            {
                success:false,
                message:"Failed to reset password"
            },{
                status:500
            }
        )
    }
}