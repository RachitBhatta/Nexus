import { decodeToken } from "@/lib/auth/token";
import UserModel from "@/lib/db/Models/User.model";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";


export async function GET(){
    try {
        const cookieStore=await cookies();
        const refreshToken=cookieStore.get("refreshToken")?.value;
        if(!refreshToken){
            return null;
        }
        let decoded;
        try {
            decoded=decodeToken(refreshToken);
        } catch (error) {
            return null;
        }
        const user=await UserModel.findById(decoded?.userId);
        if(!user){
            return null;
        }
        return {
            username:user.username,
            profilePicture:user.avatar
        }
    } catch (error) {
        return null;
    }
}