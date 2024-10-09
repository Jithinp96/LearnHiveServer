import { ITutorRepository } from "../../domain/interfaces/ITutorRepository";
import { JWTService } from "../../shared/utils/JWTService";

export class TutorAuthService {
    constructor (private _tutorRepo: ITutorRepository) {}
    
    async validateTutorToken(token: string): Promise<string | null> {
        
        const decoded = JWTService.verifyAccessToken(token);
        if (!decoded) return null;
    
        const tutor = await this._tutorRepo.findTutorById(decoded.tutor._id);
        
        if (!tutor || tutor.isBlocked) return null;
    
        return tutor.toString();
    }
    
    async refreshTutorToken(refreshToken: string): Promise<string | null> {
        const decoded = JWTService.verifyRefreshToken(refreshToken);
        if (!decoded) return null;
    
        const newAccessToken = JWTService.generateAccessToken({
            userId: decoded.tutor._id,
            role: "tutor"});
        return newAccessToken;
    }
}