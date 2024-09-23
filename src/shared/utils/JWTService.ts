import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export class JWTService {
    static generateAccessToken(payload: object): string {
        return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
            expiresIn: process.env.JWT_ACCESS_EXPIRATION
        })
    }

    static generateRefreshToken(payload: object): string {
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION
        })
    }

    static verifyAccessToken(token: string): any {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    }

    static verifyRefreshToken(token: string): any {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    }

    static setTokens(res: Response, accessToken: string, refreshToken: string): void {
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });
    
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });
    }
    
    static clearTokens(res: Response): void {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
    }
}

// import jwt from 'jsonwebtoken'

// const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'accessSecretKey';
// const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshSecretKey';

// export const generateAccessToken = (userId: string) => {
//     return jwt.sign({ userId }, JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
// }

// export const generateRefreshToken = (userId: string) => {
//     return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
// }

// import jwt from 'jsonwebtoken';
// import { Response } from 'express';


// export const generateAccessToken = (payload: object) => {
//     return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
// }

// export const generateRefreshToken = (payload: object) => {
//     return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
//         expiresIn: process.env.JWT_REFRESH_EXPIRATION
//     });
// }

// export const verifyAccessToken = (token: string) => {
//     return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
// }

// export const verifyRefreshToken = (token: string) => {
//     return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
// }

// export const setTokens = async (res: Response, accessToken: string, refreshToken: string) => {
//     console.log("Inside setToken");
    
//     res.cookie('accessToken1', accessToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production' ? true : false,
//     });

//     res.cookie('refreshToken1', refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production' ? true : false,
//     });
// }

// export const clearTokens = (res: Response) => {
//     res.clearCookie('accessToken');
//     res.clearCookie('refreshToken');
// }
