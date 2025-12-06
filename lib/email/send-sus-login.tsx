import { sendEmail } from "./resend";
import SuspiciousLogin from "@/emails/sus-login-email";

export function sendSusLogin(
    to:string,
    username:string,
    location:string,
    device:string
){
    return sendEmail({
        to,
        subject:"There has been suspicious login in you account",
        react:(
            <SuspiciousLogin
                username={username}
                location={location}
                device={device}
            />
        )
    })
}