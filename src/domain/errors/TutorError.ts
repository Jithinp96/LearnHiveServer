import { TutorErrorEnum } from "../../shared/enums/ErrorMessagesEnum";

export class TutorNotFoundError extends Error {
    constructor(message: string = TutorErrorEnum.TUTOR_NOT_FOUND) {
        super(message);
        this.name = "TutorNotFoundError";
    }
}

export class TutorUpdateError extends Error {
    constructor(message: string = TutorErrorEnum.TUTOR_UPDATE_ERROR) {
        super(message);
        this.name = "TutorUpdateError";
    }
}

export class TutorAlreadyExistsError extends Error {
    constructor(message: string = TutorErrorEnum.TUTOR_ALREADY_EXISTS) {
        super(message);
        this.name = "TutorAlreadyExistsError";
    }
}

export class RegistrationError extends Error {
    constructor(message: string = TutorErrorEnum.TUTOR_REGISTRATION_ERROR) {
        super(message);
        this.name = "RegistrationError";
    }
}