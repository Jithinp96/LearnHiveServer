import { Request, Response } from "express";
import { JWTService } from "../../../shared/utils/JWTService";
import { HttpStatusEnum } from "../../../shared/enums/HttpStatusEnum";
import { IStudentRepository } from "../../../domain/interfaces/IStudentRepository";
import { sendEmail } from "../../../shared/utils/SendEmail";

export class ForgotPassword {
    constructor(private _studentRepo: IStudentRepository) {}

    async execute(req: Request, res: Response): Promise<void> {
        const { email } = req.body;

        if (!email) {
            res.status(HttpStatusEnum.BAD_REQUEST).json({ message: "Email is required" });
            return
        }


        try {
            const student = await this._studentRepo.findStudentByEmail(email);
            
            if (!student) {
                res.status(HttpStatusEnum.NOT_FOUND).json({ message: "Student not found" });
                return
            }
        
            const forgotPasswordToken = JWTService.generateForgotToken({ userId: student });
            const resetLink = `${process.env.CORSURL}/reset-password?token=${forgotPasswordToken}`;

            const subject = 'Password Reset Request';
            const body = `To reset your password, please click the following link: ${resetLink}`;
            await sendEmail(student.email, subject, body);

            res.status(HttpStatusEnum.OK).json({ message: 'Password reset link sent to your email.' });
            return;

        } catch (error) {
            console.error('Error in ForgotPassword:', error);
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Error sending reset link.' });
            return;
        }
    }
}
