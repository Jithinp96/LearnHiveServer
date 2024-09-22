import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request{
    user?:{ id: string; email: string; role: string }
}

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'accessSecretKey';

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ message: 'Access token is required' })
    }

    jwt.verify(token, JWT_ACCESS_SECRET, (err, decoded) => {
        if(err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        if (typeof decoded === 'object' && decoded !== null && 'id' in decoded && 'email' in decoded && 'role' in decoded) {
            req.user = decoded as { id: string; email: string; role: string };
            next();
        } else {
            return res.status(403).json({ message: 'Invalid token structure' });
        }
    });
}