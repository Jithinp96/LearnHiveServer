"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const StudentError_1 = require("../../domain/errors/StudentError");
const OTPErrors_1 = require("../../domain/errors/OTPErrors");
const AuthError_1 = require("../../domain/errors/AuthError");
const TutorError_1 = require("../../domain/errors/TutorError");
const errorHandler = (err, req, res, next) => {
    if (err instanceof AuthError_1.InvalidCredentialsError) {
        return res.status(404).json({
            // success: false,
            message: err.message,
            error: 'INVALID_CREDENTIALS'
        });
    }
    if (err instanceof AuthError_1.AccountBlockedError) {
        return res.status(403).json({
            success: false,
            message: err.message,
            error: 'ACCOUNT_BLOCKED'
        });
    }
    if (err instanceof AuthError_1.AccountNotVerifiedError) {
        return res.status(403).json({
            success: false,
            message: err.message,
            error: 'ACCOUNT_NOT_VERIFIED'
        });
    }
    if (err instanceof StudentError_1.StudentNotFoundError) {
        return res.status(404).json({
            success: false,
            message: err.message,
            error: 'STUDENT_NOT_FOUND'
        });
    }
    if (err instanceof OTPErrors_1.InvalidOTPError) {
        return res.status(400).json({
            success: false,
            message: err.message,
            error: 'INVALID_OTP'
        });
    }
    if (err instanceof OTPErrors_1.OTPExpiredError) {
        return res.status(400).json({
            success: false,
            message: err.message,
            error: 'OTP_EXPIRED'
        });
    }
    if (err instanceof StudentError_1.StudentAlreadyExistsError) {
        return res.status(409).json({
            success: false,
            message: err.message,
            error: 'EMAIL_ID_ALREADY_EXIST'
        });
    }
    if (err instanceof TutorError_1.TutorAlreadyExistsError) {
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
exports.errorHandler = errorHandler;
