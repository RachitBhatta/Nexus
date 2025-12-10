import { generateOTP, verifyPassword } from "@/lib/auth/password";
import { checkRateLimit, resetRateLimit } from "@/lib/auth/rate-limit";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth/token";
import { connectDB } from "@/lib/db/connection";
import UserModel from "@/lib/db/Models/User.model";
import { SignInSchema } from "@/lib/db/Schemas/SignIn.schema";
import { sendTwoFACode } from "@/lib/email/send-2fa-code";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";


export async function POST(req:NextRequest){
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const rateLimit=await checkRateLimit(
            ip,
            {maxLimits:5,windowMS:15*60*1000,blockdurationMS:60*60*1000},
            "login"
        );
        if(!rateLimit.allowed){
            return NextResponse.json(
                {
                    success:false,
                    message:"Too many login attemps. Account is temporarily locked",
                },{
                    status:429
                }
            )
        };

        const body=await req.json();
        const {identifier,password}=SignInSchema.parse(body);

        await connectDB();

        const user=await UserModel.findOne({
            $or:[
                {email:identifier},
                {username:identifier}
            ]
        })
        if(!user){
            return NextResponse.json(
                {
                    success:false,
                    message:"Invalid Credentials"
                },
                {
                    status:401
                }
            )
        }
        if(user.isAccountLocked()){
            const timeRemaining=Math.ceil(
                (user.accountLockedUntil!.getTime()-Date.now())/60000
            )
            return NextResponse.json(
                {
                    success:false,
                    message:`Account Locked.Try again in ${timeRemaining} in minutes`
                },{
                    status:423
                }
            )
        }

        const isPasswordVaild=verifyPassword(password,user.password);

        if(!isPasswordVaild){
            await user.failedLoginAttempts();
            return NextResponse.json(
                {
                    success:false,
                    message:"Invalid credentials"
                },{
                    status:401
                }
            )
        }
        if(!user.isVerified){
            return NextResponse.json(
                {
                    success:false,
                    message:"Please verify your account before logging in.",
                    requiresVerification: true,
                    email: user.email
                },{
                    status:403
                }
            )
        }

        await user.resetLoginAttempts();
        await resetRateLimit(ip,"login")

        if(user.twoFactorEnabled){
            const twoFACode=await generateOTP(6);
            const twoFAExpiry=new Date(Date.now()+5*60*1000);

            user.VerifyOTP=twoFACode;
            user.OTPexpiry=twoFAExpiry;

            await user.save()

            const userAgent=req.headers.get("user-agent") || "Unknown device";
            const device=userAgent.includes("Mobile")?"Mobile":"Desktop";
            const location=req.headers.get("cf-ipcountry") || "Unknown location";

            sendTwoFACode(
                user.username,
                twoFACode,
                device,
                location,
                5,
                user.email
            )
            return NextResponse.json(
                {
                    success:true,
                    message:"TwoFA code has been sent to your account",
                    identifier:user.email,
                    required2FA:true
                },{
                    status:200
                }
            )
        }
        const accessToken=generateAccessToken({
            userId:user._id.toString(),
            email:user.email,
            username:user.username,
            isVerified:user.isVerified,
            twoFactorEnabled:user.twoFactorEnabled
        })

        const refreshToken=generateRefreshToken(user._id.toString());

        user.lastLogin=new Date();
        await user.save();

        const cookie=await cookies();

        cookie.set("accessToken",accessToken,{
            httpOnly:true,
            sameSite:"lax",
            secure:process.env.NODE_ENV==="production",
            maxAge:7*24*60*60,
            path:"/"
        })
        cookie.set("refreshToken",refreshToken,{
            httpOnly:true,
            sameSite:"lax",
            secure:process.env.NODE_ENV==="production",
            maxAge:30*24*60*60,
            path:"/"
        })

        return NextResponse.json(
            {
                success:true,
                message:"Login successfully",
                user:{
                    id:user._id,
                    username:user.username,
                    email:user.email,
                    isVerified:user.isVerified,

                }
            },{
                status:200
            }
        )

        
    } catch (error:any) {
        console.error("Login Failed",error);
        if(error.name==="ZodError"){
            return NextResponse.json(
                {
                    success:false,
                    message:"Invalid credentials"
                },
                {
                    status:401
                }
            )
        }
        return NextResponse.json(
            {
                success:false,
                message:"Login Failed .Please Try Again"
            },{
                status:500
            }
        )
    }
}