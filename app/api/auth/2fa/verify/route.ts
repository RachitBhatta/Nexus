import { generateBackupCodes, hashBackupCodes } from "@/lib/auth/password";
import { verifyToken } from "@/lib/auth/token";
import { connectDB } from "@/lib/db/connection";
import UserModel from "@/lib/db/Models/User.model";
import { sendTwoFAEnabled } from "@/lib/email/send-2fa-enabled";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as speakeasy from "speakeasy";
import { success } from "zod";

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

        // 2. VERIFY TOKEN
        let decodedToken;
        try {
            decodedToken = verifyToken(accessToken);
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid session" },
                { status: 401 }
            );
        }

        const { twoFACode } = await req.json();

        if (!twoFACode || twoFACode.length !== 6) {
            return NextResponse.json(
                { success: false, message: "Invalid 2FA code format" },
                { status: 400 }
            );
        };

        
        await connectDB();

        const user = await UserModel.findById(decodedToken.userId);

        if (!user || !user.twoFactorSecret) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Two Factor Authentication setup is not initialized"
                }, {
                status: 401
            }
            )
        };

        const isValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token: twoFACode
        });

        if (!isValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Two Factor Authentication code"
                }, {
                status: 400
            }
            )
        }


        const backupCodes = generateBackupCodes(6);
        const hashedBackupCodes = await Promise.all(
            backupCodes.map(code => hashBackupCodes(code))
        );

        user.twoFactorEnabled = true;
        user.backupCodes = hashedBackupCodes;

        await user.save();

        const userAgent = req.headers.get("user-agent") || "unknown device";
        const device = userAgent.includes("Mobile") ? "Mobile" : "Desktop";
        const location = req.headers.get("cf-ipcountry") || "unknown location";
        const time = new Date().toLocaleString();

        await sendTwoFAEnabled(
            user.email,
            user.username,
            device,
            location,
            time
        );

        return NextResponse.json(
            {
                success: true,
                message: "Two Factor Authentication Enabled Successfully",
                backupCodes: backupCodes
            }, {
            status: 200
        }
        );

    } catch (error) {
        console.error("2FA Verify Error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to enable 2FA" },
            { status: 500 }
        );

    }
}