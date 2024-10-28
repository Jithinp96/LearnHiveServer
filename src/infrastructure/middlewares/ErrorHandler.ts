import { Request, Response, NextFunction } from 'express';
import { StudentNotFoundError } from '../../domain/errors/StudentError';
import { OTPExpiredError, InvalidOTPError } from '../../domain/errors/OTPErrors';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof StudentNotFoundError) {
        return res.status(404).json({
            success: false,
            message: err.message,
            error: 'STUDENT_NOT_FOUND'
        });
    }

    if (err instanceof InvalidOTPError) {
        return res.status(400).json({
            success: false,
            message: err.message,
            error: 'INVALID_OTP'
        });
    }

    if (err instanceof OTPExpiredError) {
        return res.status(400).json({
            success: false,
            message: err.message,
            error: 'OTP_EXPIRED'
        });
    }

    return res.status(500).json({
        success: false,
        message: 'An unexpected error occurred',
        error: 'INTERNAL_SERVER_ERROR'
    });
};