import { Resend } from "resend";
import ApiError from "./ApiError.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  attachments = [],
}) => {
  try {
    await resend.emails.send({
      from: "HireFlow <onboarding@resend.dev>",
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
      attachments,
    });
  } catch (error) {
    console.error("Email send failed:", error);
    throw new ApiError("Failed to send email", 500);
  }
};
