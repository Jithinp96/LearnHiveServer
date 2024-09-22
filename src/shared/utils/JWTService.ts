import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongoose';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'accessSecretKey';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshSecretKey';

export const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
}

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
}