import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { verifyToken } from "@/lib/auth/token";
import { connectDB } from "@/lib/db/connection";
import UserModel from "@/lib/db/Models/User.model";
import { changePasswordSchema } from "@/lib/db/Schemas/password-reset.schema";
import { sendPasswordChanged } from "@/lib/email/send-password-changed";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";


export async function POST(req:NextRequest){
    try {
        const cookieStore=await cookies();
        const accessToken=cookieStore.get("accessToken")?.value;
        if(!accessToken){
            return NextResponse.json(
                {
                    success:false,
                    message:"Unauthorized. Please Login"
                },{
                    status:400
                }
            )
        };

        let decoded;
        try {
            decoded=verifyToken(accessToken)
        } catch (error) {
            return NextResponse.json(
                {
                    success:false,
                    message:"Invalid or expired token"
                },{
                    status:401
                }
            )
        };

        const rateLimit=await checkRateLimit(
            decoded.userId,
            {maxLimits:3,windowMS:30*60*1000},
            "change-password"
        )
        if(!rateLimit.allowed){
            return NextResponse.json(
                {
                    success:false,
                    message:"Too many password change attempts"
                },{
                    status:429
                }
            )
        };

        let body;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json(
                { success: false, message: "Invalid request body" },
                { status: 400 }
            );
        }
        const {currentPassword,newPassword}=changePasswordSchema.parse(body);

        await connectDB();

        const user=await UserModel.findById(decoded.userId);
        if(!user){
            return NextResponse.json(
                {
                    success:false,
                    message:"User not found"
                },{
                    status:400
                }
            )
        }
        const isCurrentPasswordValid=verifyPassword(currentPassword,user.password);

        if(!isCurrentPasswordValid){
            return NextResponse.json(
                {
                    success:false,
                    message:"Password is incorrect"
                },{
                    status:401
                }
            )
        };
        const isSamePassword = await verifyPassword(newPassword, user.password);
        if(isSamePassword){
            return NextResponse.json(
                {
                    success:false,
                    message:"New password must be different from current password"
                }
            )
        };

        const hashedPassword=await hashPassword(newPassword);
        
        user.password=hashedPassword;
        await user.save();

        sendPasswordChanged(user.email,user.username);

        return NextResponse.json(
            {
                success:true,
                message:"Password changed successfully"
            },{
                status:200
            }
        )


    } catch (error:any) {
        console.error("Password change failed",error);
        if(error.name==="ZodError"){
            return NextResponse.json(
                {
                    success:false,
                    message:"Invalid input. Password must meet security requirements"
                },{
                    status:400
                }
            )
        }

        return NextResponse.json(
            {
                success:false,
                message:"Failed to change password"
            },{
                status:500
            }
        )
    }
}