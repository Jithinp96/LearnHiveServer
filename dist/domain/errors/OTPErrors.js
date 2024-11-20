"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidOTPError = exports.OTPExpiredError = void 0;
class OTPExpiredError extends Error {
    constructor(message = "OTP has expired. Please request a new OTP!") {
        super(message);
        this.name = "OTPExpiredError";
    }
}
exports.OTPExpiredError = OTPExpiredError;
class InvalidOTPError extends Error {
    constructor(message = "Invalid OTP. Please try again!") {
        super(message);
        this.name = "InvalidOTPError";
    }
}
exports.InvalidOTPError = InvalidOTPError;
