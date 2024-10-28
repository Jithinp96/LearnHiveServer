import nodemailer from 'nodemailer';
import { IEmailService } from '../../domain/interfaces/IEmailService';

export class EmailService implements IEmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
    }

    async send(recipientEmail: string, message: string): Promise<void> {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: recipientEmail,
            subject: 'OTP for Student Registration',
            text: message,
        };

        await this.transporter.sendMail(mailOptions);
    }
}