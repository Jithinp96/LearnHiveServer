import bcrypt from 'bcryptjs';
import { IStudentRepository } from "../../../domain/interfaces/IStudentRepository";
import { JWTService } from "../../../shared/utils/JWTService";
import { InvalidCredentialsError, AccountBlockedError, AccountNotVerifiedError, LoginFailed } from '../../../domain/errors/AuthError';
import { UserRole } from '../../../shared/enums/UserRoleEnum';

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
            const studentId = student._id?.toString()
            const payload = { _id: studentId, email: student.email, role: UserRole.STUDENT };
            
            const accessToken = JWTService.generateAccessToken( payload );
            const refreshToken = JWTService.generateRefreshToken( {payload} );
            
            return { accessToken, refreshToken, student };
        } catch (error) {
            if (error instanceof InvalidCredentialsError ||
                error instanceof AccountBlockedError ||
                error instanceof AccountNotVerifiedError) {
              throw error;
            }
            throw new LoginFailed();
        }
    }
}

// import bcrypt from 'bcryptjs';

// import { IStudentRepository } from "../../../domain/interfaces/IStudentRepository";
// import { JWTService } from "../../../shared/utils/JWTService";
// import { InvalidCredentialsError, AccountBlockedError, AccountNotVerifiedError, LoginFailed } from '../../../domain/errors/AuthError';

// export class LoginStudentUseCase {
    
//     private _studentRepo: IStudentRepository;
//     private _jwtService: JWTService;

//     constructor(studentRepo: IStudentRepository, jwtService: JWTService) {
//         this._studentRepo = studentRepo;
//         this._jwtService = jwtService;
//     }

//     async execute(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; student: any }> {
//         try {
//             const student = await this._studentRepo.findStudentByEmail(email);
        
//             if (!student) {
//                 throw new InvalidCredentialsError();
//             }

//             if (student.isBlocked) {
//                 throw new AccountBlockedError();
//             }

//             if (!student.isVerified) {
//                 throw new AccountNotVerifiedError();
//             }

//             const isMatch = await bcrypt.compare(password, student.password);
//             if (!isMatch) {
//                 throw new InvalidCredentialsError();
//             }

//             const accessToken = JWTService.generateStudentAccessToken( student )
//             const refreshToken = JWTService.generateStudentRefreshToken({ student });
            
//             return { accessToken, refreshToken, student };
//         } catch (error) {
//             throw new LoginFailed();
//         }
//     }
// }