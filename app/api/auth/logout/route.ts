import { verifyToken } from "@/lib/auth/token";
import { connectDB } from "@/lib/db/connection";
import SessionModel from "@/lib/db/Models/Sessions.model";
import UserModel from "@/lib/db/Models/User.model";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (accessToken) {
            try {
                const decodedToken = verifyToken(accessToken);
                await connectDB();

                await SessionModel.updateMany(
                    { userId: decodedToken.userId, isActive: true },
                    { $set: { isActive: false } }
                )
            } catch (error) {
                console.error("Token verification failed during logout", error);
            }
        }

        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");

        cookieStore.set("accessToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 0,
            sameSite: "lax",
            path: '/'
        });
        cookieStore.set("refreshToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 0,
            sameSite: "lax",
            path: '/'
        });

        return NextResponse.json(
            {
                success: true,
                message: "Logged Out Successfully"
            }, {
            status: 200
        }
        )
    } catch (error) {
        console.error("Logout Error", error);

        const cookieStore = await cookies();
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");

        return NextResponse.json(
            {
                success: true,
                message: "Logged Out"
            },
            {
                status: 200
            }
        )
    }
}

export async function GET() {
    const cookieStore = await cookies();
    const hasAccessToken = cookieStore.has("accessToken");

    return NextResponse.json(
        {
            loggedIn: hasAccessToken
        },
        { status: 200 }
    );
}