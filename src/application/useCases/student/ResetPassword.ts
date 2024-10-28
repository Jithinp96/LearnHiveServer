import { Request, Response } from 'express';
import { JWTService } from '../../../shared/utils/JWTService';
import { HttpStatusEnum } from '../../../shared/enums/HttpStatusEnum';
import { IStudentRepository } from '../../../domain/interfaces/IStudentRepository';
import bcrypt from 'bcryptjs';
import { StudentNotFoundError } from '../../../domain/errors/StudentError';
import { AuthErrorEnum, StudentErrorEnum } from '../../../shared/enums/ErrorMessagesEnum';
import { TokenMissingOrInvalidError } from '../../../domain/errors/TokenError';

export class ResetPasswordUseCase {
    constructor(private _studentRepo: IStudentRepository) {}

    async execute(token: string, newPassword: string): Promise<void> {
        if (!token) {
            throw new TokenMissingOrInvalidError(AuthErrorEnum.INVALID_OR_EXPIRED_TOKEN);
        }

        const decodedToken = JWTService.verifyForgotToken(token);

        if (!decodedToken) {
            throw new TokenMissingOrInvalidError(AuthErrorEnum.INVALID_OR_EXPIRED_TOKEN);
        }

        const studentId = decodedToken.userId;
        const student = await this._studentRepo.findStudentById(studentId);

        if (!student) {
            throw new StudentNotFoundError(StudentErrorEnum.STUDENT_NOT_FOUND);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this._studentRepo.updateStudentPassword(studentId, hashedPassword);
    }
}