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
const AuthMiddleware = (authService) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log("Inside Auth middleware");
        try {
            const refreshToken = req.cookies.refreshToken;
            let accessToken = req.cookies.accessToken;
            // console.log("refreshToken: ", refreshToken);
            // console.log("accessToken: ", accessToken);
            if (!refreshToken) {
                return res.status(401).json({
                    message: "Not authorized, missing refresh token"
                });
            }
            if (!accessToken) {
                const newAccessToken = yield authService.refreshToken(refreshToken);
                let accessToken = newAccessToken === null || newAccessToken === void 0 ? void 0 : newAccessToken.accessToken;
                if (!accessToken) {
                    return res.status(401).json({
                        message: "Failed to refresh access token, please login again"
                    });
                }
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    maxAge: 15 * 60 * 1000
                });
            }
            const validationResult = yield authService.validateAccessToken(accessToken);
            // console.log("validationResult: ", validationResult);
            if (!validationResult) {
                console.log("Hereee");
                return res.status(401).json({
                    message: "Invalid or expired token"
                });
            }
            const { userId, role } = validationResult;
            req.userId = userId;
            req.userRole = role;
            next();
        }
        catch (error) {
            return res.status(401).json({
                message: "Authorization failed"
            });
        }
    });
};
exports.default = AuthMiddleware;
// import { Request, Response, NextFunction } from "express";
// import { StudentAuthService } from "../../application/services/StudentAuthService";
// interface IAuthRequest extends Request {
//     userId?: string;
// }
// const studentAuthMiddleware = (studentAuthService: StudentAuthService) => {    
//     return async (req: IAuthRequest, res: Response, next: NextFunction) => {
//         try {
//             const refreshToken = req.cookies.StudentRefreshToken;
//             let accessToken = req.cookies.StudentAccessToken;
//             if (!refreshToken) {
//                 return res.status(401).json({ 
//                     message: "Not authorized, missing refresh token" 
//                 });
//             }
//             if (!accessToken) {
//                 accessToken = await studentAuthService.refreshStudentToken(refreshToken);
//                 if (!accessToken) {
//                     return res.status(401).json({ 
//                         message: "Failed to refresh access token, please login again" 
//                     });
//                 }
//                 res.cookie("studentAccessToken", accessToken, { 
//                     httpOnly: true, 
//                     secure: process.env.NODE_ENV === "production", 
//                     maxAge: 15 * 60 * 1000 
//                 });
//             }
//             const userId = await studentAuthService.validateStudentToken(accessToken);
//             if (!userId) {
//                 return res.status(401).json({ 
//                     message: "Invalid or expired token" 
//                 });
//             }
//             req.userId = userId;
//             next();
//         } catch (error) {
//             return res.status(401).json({ 
//                 message: "Authorization failed" 
//             });
//         }
//     };
// };
// export default studentAuthMiddleware;
