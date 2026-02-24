import { decodeToken, verifyToken } from "@/lib/auth/token";
import { connectDB } from "@/lib/db/connection";
import UserModel from "@/lib/db/Models/User.model";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { success } from "zod";


export async function GET(){
    try {
        const cookieStore=await cookies();
        const accessToken=cookieStore.get("accessToken")?.value;
        if(!accessToken){
            return NextResponse.json({
                success:false,
                message:"Unauthorized"
            }, { status: 401 });
        }
        let decoded;
        try {
            decoded=verifyToken(accessToken);
        } catch {
            return NextResponse.json({
                success:false,
                message:"Invalid Token"            
            }, { status: 401 });
        } 
        await connectDB();
        const user=await UserModel.findById(decoded?.userId)
                                    .select("username avatar followers email projects");
        if(!user){
            return NextResponse.json({
                success:false,
                message:"User not found"
            }, { status: 404 });
        }
        return NextResponse.json({
            username:user.username,
            profilePicture:user.avatar,
            
        },{
            status:200
        });
    } catch(error) {
        console.error("User Api Error:",error)
        return NextResponse.json({
            success:false,
            message:"Failed to fetch user data"
        }, { status: 500 });
    }
}