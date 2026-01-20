import { decodeToken } from "@/lib/auth/token";
import UserModel from "@/lib/db/Models/User.model";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET(){
    try {
        const cookieStore=await cookies();
        const refreshToken=cookieStore.get("refreshToken")?.value;
        if(!refreshToken){
            return NextResponse.json(null, { status: 401 });
        }
        let decoded;
        try {
            decoded=decodeToken(refreshToken);
        } catch {
            return NextResponse.json(null, { status: 401 });
        }
        const user=await UserModel.findById(decoded?.userId);
        if(!user){
            return NextResponse.json(null, { status: 404 });
        }
        return NextResponse.json({
            username:user.username,
            profilePicture:user.avatar
        });
    } catch {
        return NextResponse.json(null, { status: 500 });
    }
}