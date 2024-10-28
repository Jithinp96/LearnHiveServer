import { IStudentRepository } from "../../../domain/interfaces/IStudentRepository";
import { JWTService } from "../../../shared/utils/JWTService";
import { sendEmail } from "../../../shared/utils/SendEmail";
import { StudentNotFoundError } from "../../../domain/errors/StudentError";
import { AuthErrorEnum } from "../../../shared/enums/ErrorMessagesEnum";

export class ForgotPasswordUseCase {
    constructor(private _studentRepo: IStudentRepository) {}

    async execute(email: string): Promise<void> {
        if (!email) {
            throw new Error(AuthErrorEnum.EMAIL_NOT_RECEIVED);
        }

        const student = await this._studentRepo.findStudentByEmail(email);
        
        if (!student) {
            throw new StudentNotFoundError();
        }

        const forgotPasswordToken = JWTService.generateForgotToken({ userId: student.studentId });
        const resetLink = `${process.env.CORSURL}/reset-password?token=${forgotPasswordToken}`;

        const subject = 'Password Reset Request';
        const body = `To reset your password, please click the following link: ${resetLink}`;
        
        await sendEmail(student.email, subject, body);
    }
}
