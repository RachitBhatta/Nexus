import { sendEmail } from "../resend";
import AccountRecovery from "@/emails/account-recovery-email";

export function sendAccountRecovery(
    to:string,
    recoveryCode:string,
    username:string
){
    return sendEmail({
        to,
        subject:"Account Recovery Email from nexus",
        react:(
            <AccountRecovery
                username={username}
                recoveryCode={recoveryCode}
            />
        )
    })
}