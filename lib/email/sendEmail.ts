import { Resend } from "resend";
import { ReactElement } from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  react: ReactElement;
}

export async function sendEmail({ to, subject, react }: SendEmailOptions) {
  try {
    const result = await resend.emails.send({
      from: "rachitbhatta2009@gmail.com",
      to,
      subject,
      react,
    });

    return { success: true, result };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}
