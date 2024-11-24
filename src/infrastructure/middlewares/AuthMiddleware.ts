import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../../domain/interfaces/IAuthService";
import { UserRole } from "../../shared/enums/UserRoleEnum";
import { HttpStatusEnum } from "../../shared/enums/HttpStatusEnum";
import { AccessTokenRefreshFailedError, AuthorizationFailedError, InvalidOrExpiredTokenError, RefreshTokenMissingError } from "../../domain/errors/TokenError";

interface IAuthRequest extends Request {
    userId?: string;
    userRole?: UserRole;
}

const AuthMiddleware = (authService: IAuthService) => {
    return async (req: IAuthRequest, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            let accessToken = req.cookies.accessToken;

            if (!refreshToken) {
                throw new RefreshTokenMissingError();
            }

            if (!accessToken) {
                const newAccessToken = await authService.refreshToken(refreshToken);

                if (!newAccessToken?.accessToken) {
                    throw new AccessTokenRefreshFailedError();
                }

                accessToken = newAccessToken.accessToken;

                // res.cookie("accessToken", accessToken, {
                //     httpOnly: true,
                //     secure: process.env.NODE_ENV !== "development",
                //     maxAge: 15 * 60 * 1000,
                // });
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
                    maxAge: 15 * 60 * 1000,
                });
            }

            const validationResult = await authService.validateAccessToken(accessToken);

            if (!validationResult) {
                throw new InvalidOrExpiredTokenError();
            }

            const { userId, role } = validationResult;
            req.userId = userId;
            req.userRole = role;

            next();
        } catch (error) {
            if (error instanceof RefreshTokenMissingError) {
                return res.status(HttpStatusEnum.UNAUTHORIZED).json({ message: error.message });
            }
            if (error instanceof AccessTokenRefreshFailedError) {
                return res.status(HttpStatusEnum.UNAUTHORIZED).json({ message: error.message });
            }
            if (error instanceof InvalidOrExpiredTokenError) {
                return res.status(HttpStatusEnum.UNAUTHORIZED).json({ message: error.message });
            }

            const genericError = new AuthorizationFailedError();
            return res.status(HttpStatusEnum.UNAUTHORIZED).json({ message: genericError.message });
        }
    };
};

export default AuthMiddleware;