"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginFailed = exports.AccountNotVerifiedError = exports.AccountBlockedError = exports.InvalidCredentialsError = void 0;
const ErrorMessagesEnum_1 = require("../../shared/enums/ErrorMessagesEnum");
class InvalidCredentialsError extends Error {
    constructor(message = ErrorMessagesEnum_1.AuthErrorEnum.INVALID_EMAIL_PASSWORD) {
        super(message);
        this.name = "InvalidCredentialsError";
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class AccountBlockedError extends Error {
    constructor(message = ErrorMessagesEnum_1.AuthErrorEnum.ACCOUNT_BLOCKED) {
        super(message);
        this.name = "AccountBlockedError";
    }
}
exports.AccountBlockedError = AccountBlockedError;
class AccountNotVerifiedError extends Error {
    constructor(message = ErrorMessagesEnum_1.AuthErrorEnum.ACCOUNT_NOT_VERIFIED) {
        super(message);
        this.name = "AccountNotVerifiedError";
    }
}
exports.AccountNotVerifiedError = AccountNotVerifiedError;
class LoginFailed extends Error {
    constructor(message = ErrorMessagesEnum_1.AuthErrorEnum.LOGIN_FAILED) {
        super(message);
        this.name = "LoginFailed";
    }
}
exports.LoginFailed = LoginFailed;
