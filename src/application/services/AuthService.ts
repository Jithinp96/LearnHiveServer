// import { IAuthService, RefreshResult, ValidationResult } from "../../domain/interfaces/IAuthService";
// import { IStudentRepository } from "../../domain/interfaces/IStudentRepository";
// import { UserRole } from "../../shared/enums/UserRoleEnum";
// import { JWTService } from "../../shared/utils/JWTService";

// export class StudentAuthService implements IAuthService{
//     constructor (private _studentRepo: IStudentRepository) {}

//     async validateAccessToken(token: string): Promise<ValidationResult | null> {
//         const decoded = JWTService.verifyAccessToken(token)
        
//         if (!decoded || decoded.role !== UserRole.STUDENT) return null;

//         const student = await this._studentRepo.findStudentById(decoded._id);
        
//         if (!student || student.isBlocked) return null;

//         return {
//             userId: decoded._id,
//             role: UserRole.STUDENT
//         };
//     }

//     async refreshToken(refreshToken: string): Promise<RefreshResult | null> {
//         const decoded = JWTService.verifyRefreshToken(refreshToken);
        
//         if (!decoded || decoded.studentPayload.role !== UserRole.STUDENT) {
//             return null;
//         }
//         const newAccessToken = JWTService.generateAccessToken(decoded.studentPayload);
//         return {
//             accessToken: newAccessToken,
//             role: UserRole.TUTOR
//         };
//     }
// }

import { IAuthService, RefreshResult, ValidationResult } from "../../domain/interfaces/IAuthService";
import { IStudentRepository } from "../../domain/interfaces/IStudentRepository";
import { ITutorRepository } from "../../domain/interfaces/ITutorRepository";
import { UserRole } from "../../shared/enums/UserRoleEnum";
import { JWTService } from "../../shared/utils/JWTService";

export class AuthService implements IAuthService {
    constructor(
        private _studentRepo: IStudentRepository,
        private _tutorRepo: ITutorRepository
    ) {}

    async validateAccessToken(token: string): Promise<ValidationResult | null> {
        const decoded = JWTService.verifyAccessToken(token);
        // console.log("decoded inside validate access token: ", decoded);
        
        if (!decoded) return null;

        switch (decoded.role) {
            case UserRole.STUDENT:
                const student = await this._studentRepo.findStudentById(decoded._id);
                if (!student || student.isBlocked) return null;
                return {
                    userId: decoded._id,
                    role: UserRole.STUDENT
                };
            case UserRole.TUTOR:
                const tutor = await this._tutorRepo.findTutorById(decoded._id);
                if (!tutor || tutor.isBlocked) return null;
                return {
                    userId: decoded._id,
                    role: UserRole.TUTOR
                };
            case UserRole.ADMIN:
                return {
                    userId: decoded.email,
                    role: UserRole.ADMIN
                };
            default:
                return null;
        }
    }

    async refreshToken(refreshToken: string): Promise<RefreshResult | null> {
        const decoded = JWTService.verifyRefreshToken(refreshToken);

        if (!decoded) return null;

        let role: UserRole;
        switch (decoded.payload.role) {
            case UserRole.STUDENT:
                role = UserRole.STUDENT;
                break;
            case UserRole.TUTOR:
                role = UserRole.TUTOR;
                break;
            case UserRole.ADMIN:
                role = UserRole.ADMIN;
                break;
            default:
                return null;
        }

        const newAccessToken = JWTService.generateAccessToken({
            _id: decoded.payload._id,
            email: decoded.payload.email,
            role
        });

        return {
            accessToken: newAccessToken,
            role
        };
    }
}