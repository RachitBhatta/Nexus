import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/token";
import { connectDB } from "@/lib/db/connection";
import UserModel from "@/lib/db/Models/User.model";
import { generateBackupCodes, hashBackupCodes, verifyPassword } from "@/lib/auth/password";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
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


        let password;
        try {
            const body = await req.json();
            password = body.password;
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid request format"
                }, {
                status: 400
            }
            )
        }

        if (!password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Password is required to regenerate backup codes"
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

        if (!user.twoFactorEnabled) {
            return NextResponse.json(
                { success: false, message: "2FA is not enabled" },
                { status: 400 }
            );
        }


        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Incorrect password" },
                { status: 401 }
            );
        }


        const newBackupCodes = generateBackupCodes(8);
        const hashedBackupCodes = await Promise.all(
            newBackupCodes.map(code => hashBackupCodes(code))
        );

        user.backupCodes = hashedBackupCodes;
        await user.save();


        return NextResponse.json(
            {
                success: true,
                message: "New backup codes generated successfully",
                backupCodes: newBackupCodes,
                warning: "Save these codes securely. Old backup codes are now invalid."
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Backup Codes Generation Error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to generate backup codes" },
            { status: 500 }
        );
    }
}