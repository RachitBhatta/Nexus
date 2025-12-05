import { sendEmail } from "./sendEmail";
import TwoFAEmail from "@/emails/2fa-email";

export async function sendTwoFACode(
    username:string,
    twoFACode:string,
    device:string,
    location:string,
    expiresIn:number
){
    return sendEmail({
        to,
        subject:"",
        react:(
            <TwoFAEmail
            username={username}
            twoFACode={twoFACode}
            device={device}
            location={location}
            expiresIn={expiresIn}

            />
        )
    })
}