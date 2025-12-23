import transporter from "../configs/email.js";
import ApiError from "./ApiError.js";

export const sendEmail = async ({ to, subject, text, attachments = [] }) => {
  try {
    await transporter.sendMail({
      from: `"HireFlow - " <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      attachments,
    });
  } catch (error) {
    console.error("Email send failed:", error);
    throw new ApiError("Failed to send email", 500);
  }
};
