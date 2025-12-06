import { Resend } from "resend";
import { ReactElement } from "react";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is not set");
}
const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  react: ReactElement;
}

export async function sendEmail({ to, subject, react }: SendEmailOptions) {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL as string,
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
