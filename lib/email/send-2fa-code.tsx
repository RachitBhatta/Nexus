import { sendEmail } from "./resend";
import TwoFAEmail from "@/emails/2fa-email";

export async function sendTwoFACode(
    username:string,
    twoFACode:string,
    device:string,
    location:string,
    expiresIn:number,
    to:string
){
    return sendEmail({
        to,
        subject:"Two Factor authentication code has been sent",
        react:(
            <TwoFAEmail
            username={username}
            twoFACode={twoFACode}
            device={device}
            location={location}
            expiresInMinutes={expiresIn}

            />
        )
    })
}