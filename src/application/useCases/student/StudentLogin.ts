import bcrypt from 'bcryptjs';

import { IStudentRepository } from "../../../domain/interfaces/IStudentRepository";
import { JWTService } from "../../../shared/utils/JWTService";
import { InvalidCredentialsError, AccountBlockedError, AccountNotVerifiedError, LoginFailed } from '../../../domain/errors/AuthError';

export class LoginStudentUseCase {
    
    private _studentRepo: IStudentRepository;
    private _jwtService: JWTService;

    constructor(studentRepo: IStudentRepository, jwtService: JWTService) {
        this._studentRepo = studentRepo;
        this._jwtService = jwtService;
    }

    async execute(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; student: any }> {
        try {
            const student = await this._studentRepo.findStudentByEmail(email);
        
            if (!student) {
                throw new InvalidCredentialsError();
            }

            if (student.isBlocked) {
                throw new AccountBlockedError();
            }

            if (!student.isVerified) {
                throw new AccountNotVerifiedError();
            }

            const isMatch = await bcrypt.compare(password, student.password);
            if (!isMatch) {
                throw new InvalidCredentialsError();
            }

            const accessToken = JWTService.generateStudentAccessToken( student )
            const refreshToken = JWTService.generateStudentRefreshToken({ student });
            
            return { accessToken, refreshToken, student };
        } catch (error) {
            throw new LoginFailed();
        }
    }
}