import { StudentErrorEnum } from "../../shared/enums/ErrorMessagesEnum";

export class StudentNotFoundError extends Error {
    constructor(message: string = StudentErrorEnum.STUDENT_NOT_FOUND) {
        super(message);
        this.name = "StudentNotFoundError";
    }
}

export class StudentUpdateError extends Error {
    constructor(message: string = StudentErrorEnum.STUDENT_UPDATE_ERROR) {
        super(message);
        this.name = "StudentUpdateError";
    }
}

export class StudentAlreadyExistsError extends Error {
    constructor(message: string = StudentErrorEnum.STUDENT_ALREADY_EXISTS) {
        super(message);
        this.name = "StudentAlreadyExistsError";
    }
}

export class RegistrationError extends Error {
    constructor(message: string = StudentErrorEnum.STUDENT_REGISTRATION_ERROR) {
        super(message);
        this.name = "RegistrationError";
    }
}