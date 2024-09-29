import { IStudentRepository } from "../../domain/interfaces/IStudentRepository";
import { JWTService } from "../../shared/utils/JWTService";

export class AuthService {
    constructor (private _studentRepo: IStudentRepository) {}

    async validateStudentToken(token: string): Promise<string | null> {
        const decoded = JWTService.verifyAccessToken(token);
        if (!decoded) return null;

        const student = await this._studentRepo.findStudentById(decoded.userId);
        if (!student || student.isBlocked) return null;

        return student._id.toString();
    }

    async refreshStudentToken(refreshToken: string): Promise<string | null> {
        const decoded = JWTService.verifyRefreshToken(refreshToken);
        if (!decoded) return null;

        const newAccessToken = JWTService.generateAccessToken({
            userId: decoded.userId,
            role: "student",
        });
        return newAccessToken;
    }
}