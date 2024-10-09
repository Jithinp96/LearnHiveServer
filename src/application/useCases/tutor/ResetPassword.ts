import { Request, Response } from 'express';
import { JWTService } from '../../../shared/utils/JWTService';
import { HttpStatusEnum } from '../../../shared/enums/HttpStatusEnum';
import { ITutorRepository } from '../../../domain/interfaces/ITutorRepository';
import bcrypt from 'bcryptjs';

export class ResetPassword {
    constructor(private _tutorRepo: ITutorRepository) {}

    async execute (req: Request, res: Response): Promise<void> {
        const { token } = req.query;
        const { newPassword } = req.body;

        try {
            if (typeof token !== 'string') {
                res.status(HttpStatusEnum.UNAUTHORIZED).json({ message: 'Token is missing or invalid.' });
                return;
            }

            const decodedToken = JWTService.verifyForgotToken(token);

            if (!decodedToken) {
                res.status(HttpStatusEnum.UNAUTHORIZED).json({ message: 'Invalid or expired token.' });
                return;
            }

            const tutorId = decodedToken.userId._id;
            const tutor = await this._tutorRepo.findTutorById(tutorId);

            if (!tutor) {
                res.status(HttpStatusEnum.NOT_FOUND).json({ message: 'Student not found.' });
                return;
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await this._tutorRepo.updateTutorPassword(tutorId, hashedPassword);

            res.status(HttpStatusEnum.OK).json({ message: 'Password successfully reset.' });
        } catch (error) {
            console.error('Error in ResetPassword:', error);
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Error resetting password.' });
        }
    };
}