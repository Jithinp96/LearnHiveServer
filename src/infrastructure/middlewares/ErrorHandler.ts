import { Request, Response, NextFunction } from 'express';
import { StudentAlreadyExistsError, StudentNotFoundError } from '../../domain/errors/StudentError';
import { OTPExpiredError, InvalidOTPError } from '../../domain/errors/OTPErrors';
import { AccountBlockedError, AccountNotVerifiedError, InvalidCredentialsError } from '../../domain/errors/AuthError';
import { TutorAlreadyExistsError } from '../../domain/errors/TutorError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof InvalidCredentialsError) {
        return res.status(404).json({
            // success: false,
            message: err.message,
            error: 'INVALID_CREDENTIALS'
        });
    }

    if (err instanceof AccountBlockedError) {
        return res.status(403).json({
            success: false,
            message: err.message,
            error: 'ACCOUNT_BLOCKED'
        });
    }

    if (err instanceof AccountNotVerifiedError) {
        return res.status(403).json({
            success: false,
            message: err.message,
            error: 'ACCOUNT_NOT_VERIFIED'
        });
    }
    
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

    if (err instanceof StudentAlreadyExistsError) {
        return res.status(409).json({
            success: false,
            message: err.message,
            error: 'EMAIL_ID_ALREADY_EXIST'
        });
    }

    if (err instanceof TutorAlreadyExistsError) {
        return res.status(409).json({
            success: false,
            message: err.message,
            error: 'EMAIL_ID_ALREADY_EXIST'
        });
    }

    return res.status(500).json({
        success: false,
        message: 'An unexpected error occurred',
        error: 'INTERNAL_SERVER_ERROR'
    });
};