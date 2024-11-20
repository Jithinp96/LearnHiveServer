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
exports.VerifyOTPTutor = exports.VerifyOTP = void 0;
const OTPModel_1 = require("../../infrastructure/database/models/OTPModel");
const StudentError_1 = require("../../domain/errors/StudentError");
const OTPErrors_1 = require("../../domain/errors/OTPErrors");
class VerifyOTP {
    constructor(_studentRepo) {
        this._studentRepo = _studentRepo;
    }
    execute(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._studentRepo.findStudentByEmail(email);
            if (!student) {
                throw new StudentError_1.StudentNotFoundError();
            }
            const dbOTP = yield OTPModel_1.OTPModel.findOne({ email, otp });
            if (!dbOTP) {
                throw new OTPErrors_1.InvalidOTPError();
            }
            if (new Date() > dbOTP.expiresAt) {
                throw new OTPErrors_1.OTPExpiredError();
            }
            student.isVerified = true;
            yield this._studentRepo.updateStudent(student);
            yield OTPModel_1.OTPModel.deleteOne({ _id: dbOTP._id });
            return true;
        });
    }
}
exports.VerifyOTP = VerifyOTP;
class VerifyOTPTutor {
    constructor(_tutorRepo) {
        this._tutorRepo = _tutorRepo;
    }
    execute(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield this._tutorRepo.findTutorByEmail(email);
                if (!tutor) {
                    throw new Error('Tutor not found!');
                }
                const dbOTP = yield OTPModel_1.OTPModel.findOne({ email, otp });
                if (!dbOTP) {
                    throw new Error('Invalid OTP');
                }
                if (new Date() > dbOTP.expiresAt) {
                    throw new Error('OTP has expired');
                }
                tutor.isVerified = true;
                yield this._tutorRepo.updateTutor(tutor);
                yield OTPModel_1.OTPModel.deleteOne({ _id: dbOTP._id });
                return true;
            }
            catch (error) {
                console.error('Error during OTP verification: ', error);
                throw error;
            }
        });
    }
}
exports.VerifyOTPTutor = VerifyOTPTutor;
