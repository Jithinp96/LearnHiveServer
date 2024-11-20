"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentUseCase = void 0;
const mongodb_1 = require("mongodb");
const StudentError_1 = require("../../../domain/errors/StudentError");
const ErrorMessagesEnum_1 = require("../../../shared/enums/ErrorMessagesEnum");
class StudentUseCase {
    constructor(_studentRepository) {
        this._studentRepository = _studentRepository;
    }
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._studentRepository.findStudentById(id);
            if (!student) {
                throw new StudentError_1.StudentNotFoundError();
            }
            return student;
        });
    }
    editProfileName(id, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._studentRepository.findStudentById(id);
            if (!student) {
                throw new StudentError_1.StudentNotFoundError();
            }
            student.name = newName;
            return yield this._studentRepository.updateStudent(student);
        });
    }
    editMobileNumber(id, newMobile) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._studentRepository.findStudentById(id);
            if (!student) {
                throw new StudentError_1.StudentNotFoundError();
            }
            student.mobile = newMobile;
            return yield this._studentRepository.updateStudent(student);
        });
    }
    editProfilePic(id, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._studentRepository.findStudentById(id);
            if (!student) {
                throw new StudentError_1.StudentNotFoundError();
            }
            student.profileImage = url;
            return yield this._studentRepository.updateStudent(student);
        });
    }
    addEducation(id, newEducationDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const validatedEducation = this.validateEducationDetails(newEducationDetails);
            const student = yield this._studentRepository.findStudentById(id);
            if (!student) {
                throw new StudentError_1.StudentNotFoundError();
            }
            student.education.push(validatedEducation);
            return yield this._studentRepository.updateStudent(student);
        });
    }
    editEducation(studentId, educationId, educationData) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._studentRepository.findStudentById(studentId);
            if (!student) {
                throw new StudentError_1.StudentNotFoundError();
            }
            const educationObjectId = new mongodb_1.ObjectId(educationId);
            const educationIndex = student.education.findIndex((edu) => edu._id.equals(educationObjectId));
            if (educationIndex === -1) {
                throw new Error(ErrorMessagesEnum_1.ProfileErrorEnum.EDU_NOT_FOUND);
            }
            student.education[educationIndex] = Object.assign(Object.assign({}, student.education[educationIndex]), educationData);
            return yield this._studentRepository.updateStudent(student);
        });
    }
    deleteEducation(studentId, educationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._studentRepository.findStudentById(studentId);
            if (!student) {
                throw new StudentError_1.StudentNotFoundError();
            }
            const educationObjectId = new mongodb_1.ObjectId(educationId);
            student.education = student.education.filter((edu) => {
                const educationWithId = edu;
                return !educationWithId._id.equals(educationObjectId);
            });
            return yield this._studentRepository.updateStudent(student);
        });
    }
    validateEducationDetails(details) {
        const requiredFields = ['level', 'board', 'startDate', 'endDate', 'grade', 'institution'];
        const educationDetails = details;
        requiredFields.forEach(field => {
            if (!(field in educationDetails)) {
                throw new Error(`Missing required field: ${field}`);
            }
        });
        return educationDetails;
    }
}
exports.StudentUseCase = StudentUseCase;
