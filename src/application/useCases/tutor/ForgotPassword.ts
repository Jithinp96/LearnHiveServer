import { Request, Response } from "express";
import { JWTService } from "../../../shared/utils/JWTService";
import { HttpStatusEnum } from "../../../shared/enums/HttpStatusEnum";
import { ITutorRepository } from "../../../domain/interfaces/ITutorRepository";
import { sendEmail } from "../../../shared/utils/SendEmail";

export class ForgotPassword {
    constructor(private _tutorRepo: ITutorRepository) {}

    async execute(req: Request, res: Response): Promise<void> {
        const { email } = req.body;

        if (!email) {
            res.status(HttpStatusEnum.BAD_REQUEST).json({ message: "Email is required" });
            return
        }


        try {
            const tutor = await this._tutorRepo.findTutorByEmail(email);

            if (!tutor) {
                res.status(HttpStatusEnum.NOT_FOUND).json({ message: "Tutor not found" });
                return
            }

            const payload = { id: tutor.tutorId, role: tutor.role };
            const forgotPasswordToken = JWTService.generateForgotToken(payload);
            const resetLink = `${process.env.CORSURL}/tutor/reset-password?token=${forgotPasswordToken}`;

            const subject = 'Password Reset Request';
            const body = `To reset your password, please click the following link: ${resetLink}`;
            await sendEmail(tutor.email, subject, body);

            res.status(HttpStatusEnum.OK).json({ message: 'Password reset link sent to your email.' });
            return;

        } catch (error) {
            console.error('Error in ForgotPassword:', error);
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Error sending reset link.' });
            return;
        }
    }
}