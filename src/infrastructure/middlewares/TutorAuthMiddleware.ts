import { Request, Response, NextFunction } from "express";
import { TutorAuthService } from "../../application/services/TutorAuthService";

interface IAuthRequest extends Request {
    userId?: string;
}

const tutorAuthMiddleware = (tutorAuthService: TutorAuthService) => {
    return async (req: IAuthRequest, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies.tutorRefreshToken;
        let accessToken = req.cookies.tutorAccessToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "Not authorized, no refresh token" });
        }

        if (!accessToken) {
            try {
                accessToken = await tutorAuthService.refreshTutorToken(refreshToken);
                if (!accessToken) {
                    throw new Error("Failed to refresh access token");
                }
                res.cookie("tutorAccessToken", accessToken, { httpOnly: true });
            } catch (error) {
                return res.status(401).json({ message: error });
            }
        }

        try {
            const userId = await tutorAuthService.validateTutorToken(accessToken);
            
            if (!userId) {
                return res.status(401).json({ message: "Not authorized" });
            }

            req.userId = userId;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
    }
}

export default tutorAuthMiddleware;