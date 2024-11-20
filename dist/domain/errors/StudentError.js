"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationError = exports.StudentAlreadyExistsError = exports.StudentUpdateError = exports.StudentNotFoundError = void 0;
const ErrorMessagesEnum_1 = require("../../shared/enums/ErrorMessagesEnum");
class StudentNotFoundError extends Error {
    constructor(message = ErrorMessagesEnum_1.StudentErrorEnum.STUDENT_NOT_FOUND) {
        super(message);
        this.name = "StudentNotFoundError";
    }
}
exports.StudentNotFoundError = StudentNotFoundError;
class StudentUpdateError extends Error {
    constructor(message = ErrorMessagesEnum_1.StudentErrorEnum.STUDENT_UPDATE_ERROR) {
        super(message);
        this.name = "StudentUpdateError";
    }
}
exports.StudentUpdateError = StudentUpdateError;
class StudentAlreadyExistsError extends Error {
    constructor(message = ErrorMessagesEnum_1.StudentErrorEnum.STUDENT_ALREADY_EXISTS) {
        super(message);
        this.name = "StudentAlreadyExistsError";
    }
}
exports.StudentAlreadyExistsError = StudentAlreadyExistsError;
class RegistrationError extends Error {
    constructor(message = ErrorMessagesEnum_1.StudentErrorEnum.STUDENT_REGISTRATION_ERROR) {
        super(message);
        this.name = "RegistrationError";
    }
}
exports.RegistrationError = RegistrationError;
