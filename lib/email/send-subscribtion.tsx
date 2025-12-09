import { sendEmail } from "../resend";
import SubscriptionUpgrade from "@/emails/subscribtion-email";

export function sendSubscribtion(
    to:string,
    username:string,
    plan:string,
    price:string
){
    return sendEmail({
        to,
        subject:"Thank you for purchasing the subscribtion",
        react:(
            <SubscriptionUpgrade
                username={username}
                plan={plan}
                price={price}
            />
        )
    })
}