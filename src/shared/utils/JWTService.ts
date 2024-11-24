import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export class JWTService {
    static generateAccessToken(payload: object): string {
        try {
            const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
                expiresIn: process.env.JWT_ACCESS_EXPIRATION,
            });

            return token;
        } catch (error) {
            console.error("Error generating access token:", error);
            return "error";
        }
    }

    static generateRefreshToken(payload: object): string {
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION,
        });
    }

    static generateForgotToken(payload: object): string {
        return jwt.sign(payload, process.env.JWT_FORGOT_PASSWORD_SECRET as string, {
            expiresIn: '15m'
        });
    }

    static verifyAccessToken(token: string): any {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    }

    static verifyRefreshToken(token: string): any {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    }

    static verifyForgotToken(token: string): any {
        return jwt.verify(token, process.env.JWT_FORGOT_PASSWORD_SECRET as string);
    }

    static setTokens(res: Response, accessToken: string, refreshToken: string): void {
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
    
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }

    // static setTokens(res: Response, accessToken: string, refreshToken: string): void {
    //     res.cookie('accessToken', accessToken, {
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV !== "development",
    //         maxAge: 15 * 60 * 1000,
    //     });

    //     res.cookie('refreshToken', refreshToken, {
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV !== "development",
    //         maxAge: 7 * 24 * 60 * 60 * 1000,
    //     });
    // }

    static clearTokens(res: Response): void {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
    }
}

// import jwt from 'jsonwebtoken';
// import { Request, Response } from 'express';

// export class JWTService {
//     static generateStudentAccessToken(payload: object): string {
//         return jwt.sign(payload, process.env.JWT_STUDENT_ACCESS_SECRET as string, {
//             expiresIn: process.env.JWT_ACCESS_EXPIRATION
//         })
//     }

//     static generateStudentRefreshToken(payload: object): string {
//         return jwt.sign(payload, process.env.JWT_STUDENT_REFRESH_SECRET as string, {
//             expiresIn: process.env.JWT_REFRESH_EXPIRATION
//         })
//     }
//     static generateTutorAccessToken(payload: object): string {
//         return jwt.sign(payload, process.env.JWT_TUTOR_ACCESS_SECRET as string, {
//             expiresIn: process.env.JWT_ACCESS_EXPIRATION
//         })
//     }

//     static generateTutorRefreshToken(payload: object): string {
//         return jwt.sign(payload, process.env.JWT_TUTOR_REFRESH_SECRET as string, {
//             expiresIn: process.env.JWT_REFRESH_EXPIRATION
//         })
//     }
//     static generateAdminAccessToken(payload: object): string {
//         return jwt.sign(payload, process.env.JWT_ADMIN_ACCESS_SECRET as string, {
//             expiresIn: process.env.JWT_ACCESS_EXPIRATION
//         })
//     }

//     static generateAdminRefreshToken(payload: object): string {
//         return jwt.sign(payload, process.env.JWT_ADMIN_REFRESH_SECRET as string, {
//             expiresIn: process.env.JWT_REFRESH_EXPIRATION
//         })
//     }

//     static generateForgotToken(payload: object): string {
//         return jwt.sign(payload, process.env.JWT_FORGOT_PASSWORD_SECRET as string, {
//             expiresIn: '15m'
//         });
//     }

//     static verifyStudentAccessToken(token: string): any {
//         const decoded = jwt.verify(token, process.env.JWT_STUDENT_ACCESS_SECRET as string);
//         return {student: decoded};
//     }

//     static verifyTutorAccessToken(token: string): any {
//         const decoded = jwt.verify(token, process.env.JWT_TUTOR_ACCESS_SECRET as string);
//         return {tutor: decoded};
//     }
//     static verifyAdminAccessToken(token: string): any {
//         const decoded = jwt.verify(token, process.env.JWT_ADMIN_ACCESS_SECRET as string);
//         return {admin: decoded};
//     }

//     static verifyStudentRefreshToken(token: string): any {
//         return jwt.verify(token, process.env.JWT_STUDENT_REFRESH_SECRET as string);
//     }
//     static verifyTutorRefreshToken(token: string): any {
//         return jwt.verify(token, process.env.JWT_TUTOR_REFRESH_SECRET as string);
//     }
//     static verifyAdminRefreshToken(token: string): any {
//         return jwt.verify(token, process.env.JWT_ADMIN_REFRESH_SECRET as string);
//     }

//     static verifyForgotToken(token: string): any {
//         return jwt.verify(token, process.env.JWT_FORGOT_PASSWORD_SECRET as string);
//     }

//     static setTokens(res: Response, accessToken: string, refreshToken: string, role: string): void {
//         res.cookie(`${role}AccessToken`, accessToken, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === 'production',
//           maxAge: 15 * 60 * 1000,
//         });
    
//         res.cookie(`${role}RefreshToken`, refreshToken, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === 'production',
//           maxAge: 7 * 24 * 60 * 60 * 1000,
//         });
//     }
    
//     static clearTokens(res: Response, role: string): void {
//         res.clearCookie(`${role}AccessToken`);
//         res.clearCookie(`${role}RefreshToken`);
//     }
// }