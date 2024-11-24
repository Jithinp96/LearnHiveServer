import { TokenErrorEnum } from "../../shared/enums/ErrorMessagesEnum";

export class TokenMissingOrInvalidError extends Error {
    constructor(message: string = TokenErrorEnum.UNAUTHORIZED) {
        super(message);
        this.name = "TokenMissingOrInvalidError";
    }
}

export class RefreshTokenMissingError extends TokenMissingOrInvalidError {
    constructor(message: string = TokenErrorEnum.REFRESH_TOKEN_MISSING) {
        super(message);
        this.name = "RefreshTokenMissingError";
    }
}

export class AccessTokenRefreshFailedError extends TokenMissingOrInvalidError {
    constructor(message: string = TokenErrorEnum.ACCESS_TOKEN_REFRESH_FAILED) {
        super(message);
        this.name = "AccessTokenRefreshFailedError";
    }
}

export class InvalidOrExpiredTokenError extends TokenMissingOrInvalidError {
    constructor(message: string = TokenErrorEnum.INVALID_OR_EXPIRED_TOKEN) {
        super(message);
        this.name = "InvalidOrExpiredTokenError";
    }
}

export class AuthorizationFailedError extends TokenMissingOrInvalidError {
    constructor(message: string = TokenErrorEnum.AUTHORIZATION_FAILED) {
        super(message);
        this.name = "AuthorizationFailedError";
    }
}

export class UnauthorizedError extends TokenMissingOrInvalidError {
    constructor(message: string = TokenErrorEnum.UNAUTHORIZED) {
        super(message);
        this.name = "UnauthorizedError";
    }
}