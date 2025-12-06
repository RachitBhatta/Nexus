import { sendEmail } from "./sendEmail";
import PasswordChanged from "@/emails/password-changed";

export function sendPasswordChanged(
    to:string,
    username:string
){
    return sendEmail({
        to,
        subject:"You password has been changed",
        react:(
            <PasswordChanged 
            username={username}
            />
        )
    })
}