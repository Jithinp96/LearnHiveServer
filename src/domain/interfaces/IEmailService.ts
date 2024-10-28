export interface IEmailService {
    send(recipientEmail: string, message: string): Promise<void>;
}