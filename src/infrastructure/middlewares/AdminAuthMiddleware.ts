import { Request, Response, NextFunction } from "express";
import { AdminAuthService } from "../../application/services/AdminAuthService";

const adminAuthMiddleware = (adminAuthService: AdminAuthService) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.adminRefreshToken;
            let accessToken = req.cookies.adminAccessToken;
            
            if (!refreshToken) {
                return res.status(401).json({ message: "Not authorized, missing refresh token" });
            }

            if (!accessToken) {
                accessToken = await adminAuthService.refreshAdminToken(refreshToken);
                
                if (!accessToken) {
                    return res.status(401).json({ message: "Failed to refresh access token, please login again" });
                }
                res.cookie("adminAccessToken", accessToken, { 
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === "production", 
                    maxAge: 15 * 60 * 1000 
                });
            }

            const admin = await adminAuthService.validateAdminToken(accessToken);
            if (!admin) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }
            next();
        } catch (error) {
            return res.status(401).json({ message: "Authorization failed" });
        }
    }
}

export default adminAuthMiddleware