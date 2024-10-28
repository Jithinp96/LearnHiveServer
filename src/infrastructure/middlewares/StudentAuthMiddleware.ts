import { Request, Response, NextFunction } from "express";
import { StudentAuthService } from "../../application/services/StudentAuthService";

interface IAuthRequest extends Request {
    userId?: string;
}

const studentAuthMiddleware = (studentAuthService: StudentAuthService) => {    
    return async (req: IAuthRequest, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.StudentRefreshToken;
            let accessToken = req.cookies.StudentAccessToken;
            
            if (!refreshToken) {
                return res.status(401).json({ 
                    message: "Not authorized, missing refresh token" 
                });
            }

            if (!accessToken) {
                accessToken = await studentAuthService.refreshStudentToken(refreshToken);
                
                if (!accessToken) {
                    return res.status(401).json({ 
                        message: "Failed to refresh access token, please login again" 
                    });
                }
                res.cookie("studentAccessToken", accessToken, { 
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === "production", 
                    maxAge: 15 * 60 * 1000 
                });
            }

            const userId = await studentAuthService.validateStudentToken(accessToken);
            if (!userId) {
                return res.status(401).json({ 
                    message: "Invalid or expired token" 
                });
            }

            req.userId = userId;
            next();
        } catch (error) {
            return res.status(401).json({ 
                message: "Authorization failed" 
            });
        }
    };
};

export default studentAuthMiddleware;
