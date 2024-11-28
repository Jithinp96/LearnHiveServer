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
    subject: 'Your Verification Code',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #f0f4f8;
        }
        .container { 
          background-color: #ffffff; 
          border-radius: 12px; 
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          overflow: hidden;
          margin: 20px;
        }
        .header { 
          background: linear-gradient(135deg, #ffd1dc 0%, #b0e0e6 100%);
          color: #5c5c5c; 
          text-align: center; 
          padding: 20px; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 24px;
          font-weight: 300;
        }
        .content { 
          padding: 30px; 
          background-color: #ffffff;
        }
        .otp-code { 
          background-color: #f0f8ff; 
          border: 2px dashed #b0c4de;
          color: #4a4a4a; 
          font-size: 28px; 
          font-weight: 600; 
          text-align: center; 
          margin: 20px 0; 
          padding: 15px; 
          border-radius: 10px; 
          letter-spacing: 4px;
        }
        .footer { 
          background-color: #f5f5f5; 
          text-align: center; 
          padding: 15px; 
          font-size: 12px; 
          color: #888;
        }
        .note {
          background-color: #fff0f5;
          border-left: 4px solid #ffc0cb;
          padding: 10px 15px;
          margin: 20px 0;
          font-style: italic;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verification Code</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>To complete your registration, please use the following one-time code:</p>
          <div class="otp-code">${otp}</div>
          <div class="note">
            This code is valid for 10 minutes. If you did not request this verification, please disregard this email.
          </div>
        </div>
        <div class="footer">
          © 2025 LearnHive | Secure Verification System
        </div>
      </div>
    </body>
    </html>
    `
  };

  await transporter.sendMail(mailOptions);
}