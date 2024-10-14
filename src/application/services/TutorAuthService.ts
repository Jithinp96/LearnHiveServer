import { ITutorRepository } from "../../domain/interfaces/ITutorRepository";
import { JWTService } from "../../shared/utils/JWTService";

export class TutorAuthService {
    constructor (private _tutorRepo: ITutorRepository) {}
    
    async validateTutorToken(token: string): Promise<string | null> {
        const decoded = JWTService.verifyTutorAccessToken(token);
        
        if (!decoded) return null;
    
        const tutor = await this._tutorRepo.findTutorById(decoded.tutor._id);
        
        if (!tutor || tutor.isBlocked) return null;
    
        return decoded.tutor._id;
    }
    
    async refreshTutorToken(refreshToken: string): Promise<string | null> {
        const decoded = JWTService.verifyTutorRefreshToken(refreshToken);
        if (!decoded) return null;
    
        const newAccessToken = JWTService.generateTutorAccessToken(decoded.tutor);
        return newAccessToken;
    }
}