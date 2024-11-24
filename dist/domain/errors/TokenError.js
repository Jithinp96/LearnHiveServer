"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.AuthorizationFailedError = exports.InvalidOrExpiredTokenError = exports.AccessTokenRefreshFailedError = exports.RefreshTokenMissingError = exports.TokenMissingOrInvalidError = void 0;
const ErrorMessagesEnum_1 = require("../../shared/enums/ErrorMessagesEnum");
class TokenMissingOrInvalidError extends Error {
    constructor(message = ErrorMessagesEnum_1.TokenErrorEnum.UNAUTHORIZED) {
        super(message);
        this.name = "TokenMissingOrInvalidError";
    }
}
exports.TokenMissingOrInvalidError = TokenMissingOrInvalidError;
class RefreshTokenMissingError extends TokenMissingOrInvalidError {
    constructor(message = ErrorMessagesEnum_1.TokenErrorEnum.REFRESH_TOKEN_MISSING) {
        super(message);
        this.name = "RefreshTokenMissingError";
    }
}
exports.RefreshTokenMissingError = RefreshTokenMissingError;
class AccessTokenRefreshFailedError extends TokenMissingOrInvalidError {
    constructor(message = ErrorMessagesEnum_1.TokenErrorEnum.ACCESS_TOKEN_REFRESH_FAILED) {
        super(message);
        this.name = "AccessTokenRefreshFailedError";
    }
}
exports.AccessTokenRefreshFailedError = AccessTokenRefreshFailedError;
class InvalidOrExpiredTokenError extends TokenMissingOrInvalidError {
    constructor(message = ErrorMessagesEnum_1.TokenErrorEnum.INVALID_OR_EXPIRED_TOKEN) {
        super(message);
        this.name = "InvalidOrExpiredTokenError";
    }
}
exports.InvalidOrExpiredTokenError = InvalidOrExpiredTokenError;
class AuthorizationFailedError extends TokenMissingOrInvalidError {
    constructor(message = ErrorMessagesEnum_1.TokenErrorEnum.AUTHORIZATION_FAILED) {
        super(message);
        this.name = "AuthorizationFailedError";
    }
}
exports.AuthorizationFailedError = AuthorizationFailedError;
class UnauthorizedError extends TokenMissingOrInvalidError {
    constructor(message = ErrorMessagesEnum_1.TokenErrorEnum.UNAUTHORIZED) {
        super(message);
        this.name = "UnauthorizedError";
    }
}
exports.UnauthorizedError = UnauthorizedError;
