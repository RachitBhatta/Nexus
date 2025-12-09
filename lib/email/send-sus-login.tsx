import { sendEmail } from "../resend";
import SuspiciousLogin from "@/emails/sus-login-email";

export function sendSusLogin(
    to:string,
    username:string,
    location:string,
    device:string
){
    return sendEmail({
        to,
        subject:"A suspicious login was detected on your account",
        react:(
            <SuspiciousLogin
                username={username}
                location={location}
                device={device}
            />
        )
    })
}