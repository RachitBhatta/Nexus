import { generateOTP, hashPassword } from "@/lib/auth/password";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { connectDB } from "@/lib/db/connection";
import UserModel from "@/lib/db/Models/User.model";
import { SignUpSchema } from "@/lib/db/Schemas/SignUp.schema";
import { sendVerifyEmail } from "@/lib/email/send-verification";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";


export async function POST(req:NextRequest){
    try {
        
        const ip =req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
        const rateLimit=await checkRateLimit(
            ip,
            {
                maxLimits:5,
                windowMS:15*60*1000
            },
            "signup"
        );
        if(!rateLimit.allowed){
            return NextResponse.json({
                success:false,
                message:"To many signup attempts.Try again later",
                resetTime:new Date(rateLimit.resetTime).toISOString()
            },{status:429})
        }

        const body=await req.json();
        const validateData =SignUpSchema.parse(body);
        
        await connectDB();

        const existingUser=await UserModel.findOne({
            $or:[
                {email:validateData.email},
                {username:validateData.username}
            ]
        });
        if(existingUser){
            if(existingUser.email===validateData.email){
                return NextResponse.json(
                    {success:false,
                    message:"Email is Already Registered"
                    },
                    {
                        status:409
                    }
                );
            }
            return NextResponse.json(
                {
                    success:false,
                    message:"Username is already registered"
                },{
                    status:409
                }
            );           
        }

        const hashedPassword=hashPassword(validateData.password);

        const otp=await generateOTP(6);
        const otpExpiry=new Date(Date.now()+10*60*1000);

        const newUser=new UserModel({
            username: validateData.username,
            email: validateData.email,
            password: hashedPassword,
            VerifyOTP: otp,
            OTPexpiry: otpExpiry,
            isVerified: false,
            failedLoginAttempts: 0
        });

        await newUser.save();

        await sendVerifyEmail(validateData.email,otp,validateData.username);

        return  NextResponse.json(
            {
                success:true,
                message:"Account created successfully.Please verify your email",
                data:{
                    email:validateData.email,
                    username:validateData.username

                }
            },{
                status:201
            }
        )

    } catch (error:any) {
        console.error("Signup Error",error);

        if(error.name==="ZodError"){
            return NextResponse.json(
                {
                    success:false,
                    message:"Invalid Input Data",
                    errors:error.errors
                },{
                    status:400
                }
            )

        }
        if(error.name===11000){
            return NextResponse.json(
                {
                    success:false,
                    message:"User already exists"
                },
                {
                    status:409
                }
            )
        };
        return NextResponse.json(
            {
                success:false,
                message:"Registration Failed.Try again"
            },{
                status:500
            }
        );
    }
}