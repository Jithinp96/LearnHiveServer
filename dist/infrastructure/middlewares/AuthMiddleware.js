"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusEnum_1 = require("../../shared/enums/HttpStatusEnum");
const TokenError_1 = require("../../domain/errors/TokenError");
const AuthMiddleware = (authService) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const refreshToken = req.cookies.refreshToken;
            let accessToken = req.cookies.accessToken;
            if (!refreshToken) {
                throw new TokenError_1.RefreshTokenMissingError();
            }
            if (!accessToken) {
                const newAccessToken = yield authService.refreshToken(refreshToken);
                if (!(newAccessToken === null || newAccessToken === void 0 ? void 0 : newAccessToken.accessToken)) {
                    throw new TokenError_1.AccessTokenRefreshFailedError();
                }
                accessToken = newAccessToken.accessToken;
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    maxAge: 15 * 60 * 1000,
                });
            }
            const validationResult = yield authService.validateAccessToken(accessToken);
            if (!validationResult) {
                throw new TokenError_1.InvalidOrExpiredTokenError();
            }
            const { userId, role } = validationResult;
            req.userId = userId;
            req.userRole = role;
            next();
        }
        catch (error) {
            if (error instanceof TokenError_1.RefreshTokenMissingError) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ message: error.message });
            }
            if (error instanceof TokenError_1.AccessTokenRefreshFailedError) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ message: error.message });
            }
            if (error instanceof TokenError_1.InvalidOrExpiredTokenError) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ message: error.message });
            }
            const genericError = new TokenError_1.AuthorizationFailedError();
            return res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ message: genericError.message });
        }
    });
};
exports.default = AuthMiddleware;
