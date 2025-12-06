import TwoFAEnabled from "@/emails/2fa-enabled-email";
import { sendEmail } from "./sendEmail";


export function sendTwoFAEnabled(
    to:string,
    username:string,
    location:string,
    time:string,
    device:string
){
    return sendEmail({
        to,
        subject:`Two Factor Authentication Enabled for ${username}`,
        react:(
            <TwoFAEnabled
                username={username}
                location={location}
                time={time}
                device={device}
            />
        )
    })
}