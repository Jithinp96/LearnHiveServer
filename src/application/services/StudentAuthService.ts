import { IStudentRepository } from "../../domain/interfaces/IStudentRepository";
import { JWTService } from "../../shared/utils/JWTService";

export class StudentAuthService {
    constructor (private _studentRepo: IStudentRepository) {}

    async validateStudentToken(token: string): Promise<string | null> {
        
        const decoded = JWTService.verifyAccessToken(token);
        if (!decoded) return null;

        const student = await this._studentRepo.findStudentById(decoded.student._id);
        
        if (!student || student.isBlocked) return null;

        return student.toString();
    }

    async refreshStudentToken(refreshToken: string): Promise<string | null> {
        const decoded = JWTService.verifyRefreshToken(refreshToken);
        if (!decoded) return null;

        const newAccessToken = JWTService.generateAccessToken({
            userId: decoded.student._id,
            role: "student"});
        return newAccessToken;
    }
}