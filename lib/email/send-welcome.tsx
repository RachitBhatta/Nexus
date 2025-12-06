import WelcomeEmail from "@/emails/welcome"
import { sendEmail } from "../resend"

export function sendWelcome(
    to:string,
    username:string
){
    return sendEmail({
        to,
        subject:"Thank you for joining Nexus",
        react:(
            <WelcomeEmail
            username={username}
            />
        )
    })
}