import nodemailer from "nodemailer";

export async function sendOTPEmail(recipientEmail: string, otp: number): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: recipientEmail,
    subject: 'OTP for Student Registration',
    text: `Your OTP for registration is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}