import { sendEmail } from "./sendEmail";
import AccountDeletedEmail from "@/emails/account-deleted-email";

export async function sendAccountDeletedEmail(
  to: string,
  username: string,
  deletionTime: string
) {
  return sendEmail({
    to,
    subject: "Your Nexus Account Has Been Deleted",
    react: (
      <AccountDeletedEmail
        username={username}
        deletionTime={deletionTime}
      />
    ),
  });
}
