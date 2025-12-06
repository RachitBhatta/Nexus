import VerifyEmail from "@/emails/Verification-email";
import { sendEmail } from "./sendEmail";

export function ResendVerifyEmail(
    to:string,
    verificationCode:string,
    username:string
){
    return sendEmail({
        to,
        subject:"Verification Code from Nexus",
        react:(
            <VerifyEmail
            username={username}
            otp={verificationCode}
        />
        )
    })
}