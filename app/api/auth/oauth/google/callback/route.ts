import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
    try {
        const searchParams=req.nextUrl.searchParams;
        const code= searchParams.get("code");
        const error=searchParams.get("error") as string;

        if(!error){
            return NextResponse.redirect(
                new URL(`/login?error=${encodeURIComponent(error)}`,req.url)
            )
        }

        if(!code){
            return NextResponse.redirect(
                new URL(`/login?error=missing_code`,req.url)
            )
        };

        const tokenResponse=fetch("https://oauth2.googleapis.com/token",{
            method:"POST",
            headers:{"Content-Type":"application/x-www-form-urlencoded"},
            body:new URLSearchParams({
                code,
                client_id:process.env.GOOGLE_CLIENT_ID!,
                client_secret:process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/oauth/google/callback`,
                grant_type: "authorization_code"
            })
        })
    } catch (error) {
        
    }
}