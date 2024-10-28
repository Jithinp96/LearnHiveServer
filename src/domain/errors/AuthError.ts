import { AuthErrorEnum } from "../../shared/enums/ErrorMessagesEnum";

export class InvalidCredentialsError extends Error {
    constructor(message: string = AuthErrorEnum.INVALID_EMAIL_PASSWORD) {
        super(message);
        this.name = "InvalidCredentialsError";
    }
}

export class AccountBlockedError extends Error {
    constructor(message: string = AuthErrorEnum.ACCOUNT_BLOCKED) {
        super(message);
        this.name = "AccountBlockedError";
    }
}

export class AccountNotVerifiedError  extends Error {
    constructor(message: string = AuthErrorEnum.ACCOUNT_NOT_VERIFIED) {
        super(message);
        this.name = "AccountNotVerifiedError";
    }
}

export class LoginFailed  extends Error {
    constructor(message: string = AuthErrorEnum.LOGIN_FAILED) {
        super(message);
        this.name = "LoginFailed";
    }
}