import { sendEmail } from "../resend";
import PasswordChanged from "@/emails/password-changed";

export function sendPasswordChanged(
    to:string,
    username:string
){
    return sendEmail({
        to,
        subject:"Your password has been changed",
        react:(
            <PasswordChanged 
            username={username}
            />
        )
    })
}