import { Request, Response, NextFunction } from "express";
import { TutorAuthService } from "../../application/services/TutorAuthService";

interface IAuthRequest extends Request {
    userId?: string;
}

const tutorAuthMiddleware = (tutorAuthService: TutorAuthService) => {
    return async (req: IAuthRequest, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.tutorRefreshToken;
            let accessToken = req.cookies.tutorAccessToken;

            if (!refreshToken) {
                return res.status(401).json({ message: "Not authorized, no refresh token" });
            }

            if (!accessToken) {
                accessToken = await tutorAuthService.refreshTutorToken(refreshToken);

                if (!accessToken) {
                    return res.status(401).json({ message: "Failed to refresh access token, please login again" });
                }
                res.cookie("tutorAccessToken", accessToken, { 
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === "production", 
                    maxAge: 15 * 60 * 1000 
                });
            }

            const userId = await tutorAuthService.validateTutorToken(accessToken);
                
            if (!userId) {
                console.log("UserId not got");
                
                return res.status(401).json({ message: "Not authorized" });
            }

            req.userId = userId;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Authorization failed" });
        }
    }
}

export default tutorAuthMiddleware;