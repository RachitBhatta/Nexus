import { checkRateLimit } from "@/lib/auth/rate-limit";
import { verifyToken } from "@/lib/auth/token";
import { connectDB } from "@/lib/db/connection";
import UserModel from "@/lib/db/Models/User.model";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as speakeasy from "speakeasy";
import * as QRCode from "qrcode";



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
                    status:401
                }
            )
        };
        let decoded;
        try {
            decoded=verifyToken(accessToken);
        } catch (error) {
            return NextResponse.json(
                {
                    success:false,
                    message:"Invalid or Expired Session"
                },{
                    status:401
                }
            )
        };
        
        await connectDB();
        const user=await UserModel.findById(decoded.userId);

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

        if(user.twoFactorEnabled){
            return NextResponse.json(
                {
                    success:false,
                    message:"Two Factor Authentication is already enabled"
                },{
                    status:400
                }
            )
        };

        const secret=speakeasy.generateSecret({
            name:`Nexus ${user.email}`,
            issuer:"Nexus"
        });

        user.twoFactorSecret=secret.base32;
        await user.save();

        const qrCodeUrl=await QRCode.toDataURL(secret.otpauth_url!);

        return NextResponse.json(
            {
                success:true,
                message:"Two Factor Authentication Setup initialized. Scan QR code with your authentication app.",
                qrCode:qrCodeUrl,
                secret:secret.base32,
                backupCodes:[]
            },{
                status:200
            }
        )

    } catch (error) {
        console.error("2FA setup error",error);

        return NextResponse.json(
            {
                success:false,
                message:"Failed to setup 2FA"
            },{
                status:500
            }
        )
    }
}