import nodemailer from "nodemailer";

export async function sendEmail(recipientEmail: string, subject: string, body: string): Promise<void> {
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
    subject: subject,
    text: body,
  };

  await transporter.sendMail(mailOptions);
}