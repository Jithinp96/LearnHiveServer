import { JWTService } from "../../shared/utils/JWTService";

export class AdminAuthService {
    async validateAdminToken(token: string): Promise<string | null> {
        const decoded = JWTService.verifyAdminAccessToken(token);

        if (!decoded) return null;
        return decoded
    }

    async refreshAdminToken(refreshToken: string): Promise<string | null> {
        const decoded = JWTService.verifyAdminRefreshToken(refreshToken);

        if (!decoded) {
            return null;
        }

        const newAccessToken = JWTService.generateAdminAccessToken(decoded.payload);
        return newAccessToken;
    }
}