"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationError = exports.TutorAlreadyExistsError = exports.TutorUpdateError = exports.TutorNotFoundError = void 0;
const ErrorMessagesEnum_1 = require("../../shared/enums/ErrorMessagesEnum");
class TutorNotFoundError extends Error {
    constructor(message = ErrorMessagesEnum_1.TutorErrorEnum.TUTOR_NOT_FOUND) {
        super(message);
        this.name = "TutorNotFoundError";
    }
}
exports.TutorNotFoundError = TutorNotFoundError;
class TutorUpdateError extends Error {
    constructor(message = ErrorMessagesEnum_1.TutorErrorEnum.TUTOR_UPDATE_ERROR) {
        super(message);
        this.name = "TutorUpdateError";
    }
}
exports.TutorUpdateError = TutorUpdateError;
class TutorAlreadyExistsError extends Error {
    constructor(message = ErrorMessagesEnum_1.TutorErrorEnum.TUTOR_ALREADY_EXISTS) {
        super(message);
        this.name = "TutorAlreadyExistsError";
    }
}
exports.TutorAlreadyExistsError = TutorAlreadyExistsError;
class RegistrationError extends Error {
    constructor(message = ErrorMessagesEnum_1.TutorErrorEnum.TUTOR_REGISTRATION_ERROR) {
        super(message);
        this.name = "RegistrationError";
    }
}
exports.RegistrationError = RegistrationError;
