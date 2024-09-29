import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../application/services/AuthService";

interface IAuthRequest extends Request {
    userId?: string;
}

const studentAuthMiddleware = (authService: AuthService) => {
    return async (req: IAuthRequest, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies.studentRefreshToken;
        let accessToken = req.cookies.studentAccessToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "Not authorized, no refresh token" });
        }

        // Refresh access token if needed
        if (!accessToken) {
            try {
                accessToken = await authService.refreshStudentToken(refreshToken);
                if (!accessToken) {
                    throw new Error("Failed to refresh access token");
                }
                res.cookie("studentAccessToken", accessToken, { httpOnly: true });
            } catch (error) {
                return res.status(401).json({ message: error });
            }
        }

        // Validate access token
        try {
            const userId = await authService.validateStudentToken(accessToken);
            if (!userId) {
                return res.status(401).json({ message: "Not authorized" });
            }

            req.userId = userId;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
    };
};

export default studentAuthMiddleware;