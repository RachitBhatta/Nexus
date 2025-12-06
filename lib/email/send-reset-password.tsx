
import { sendEmail } from "./resend";
import PasswordResetEmail from "@/emails/password-reset-email";

export function sendResetPassword(
    to:string,
    username:string,
    resetPasswordLink:string
){
    return sendEmail({
        to,
        subject:"Reset Your Password",
        react:(
            <PasswordResetEmail
                username={username}
                resetPasswordLink={resetPasswordLink}
            />
        )
    })
}