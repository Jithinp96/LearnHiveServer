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
          maxAge: 15 * 60 * 1000,
        });
    
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
    
    static clearTokens(res: Response): void {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
    }
}