import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/token";
import { connectDB } from "@/lib/db/connection";
import UserModel from "@/lib/db/Models/User.model";
import SessionModel from "@/lib/db/Models/Sessions.model";
import { verifyPassword } from "@/lib/auth/password";
import { sendAccountDeletedEmail } from "@/lib/email/send-account-delete";
import { cookies } from "next/headers";

export async function DELETE(req: NextRequest) {
    try {

        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }


        let decodedToken;
        try {
            decodedToken = verifyToken(accessToken);
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid session" },
                { status: 401 }
            );
        }

        const { password, confirmation } = await req.json();

        if (!password) {
            return NextResponse.json(
                { success: false, message: "Password is required" },
                { status: 400 }
            );
        }

        if (confirmation !== "DELETE MY ACCOUNT") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please type 'DELETE MY ACCOUNT' to confirm"
                },
                { status: 400 }
            );
        }


        await connectDB();


        const user = await UserModel.findById(decodedToken.userId);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }


        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Incorrect password" },
                { status: 401 }
            );
        }


        await SessionModel.deleteMany({ userId: user._id });


        const deletionTime = new Date().toLocaleString();
        await sendAccountDeletedEmail(
            user.email,
            user.username,
            deletionTime
        );


        await UserModel.findByIdAndDelete(user._id);


        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");


        return NextResponse.json(
            {
                success: true,
                message: "Account deleted successfully"
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Delete Account Error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to delete account" },
            { status: 500 }
        );
    }
}