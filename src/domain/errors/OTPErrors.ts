export class OTPExpiredError extends Error {
    constructor(message: string = "OTP has expired. Please request a new OTP!") {
        super(message);
        this.name = "OTPExpiredError";
    }
}

export class InvalidOTPError extends Error {
    constructor(message: string = "Invalid OTP. Please try again!") {
        super(message);
        this.name = "InvalidOTPError";
    }
}