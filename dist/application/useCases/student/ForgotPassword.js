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
exports.ForgotPasswordUseCase = void 0;
const JWTService_1 = require("../../../shared/utils/JWTService");
const SendEmail_1 = require("../../../shared/utils/SendEmail");
const StudentError_1 = require("../../../domain/errors/StudentError");
const ErrorMessagesEnum_1 = require("../../../shared/enums/ErrorMessagesEnum");
class ForgotPasswordUseCase {
    constructor(_studentRepo) {
        this._studentRepo = _studentRepo;
    }
    execute(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                throw new Error(ErrorMessagesEnum_1.AuthErrorEnum.EMAIL_NOT_RECEIVED);
            }
            const student = yield this._studentRepo.findStudentByEmail(email);
            if (!student) {
                throw new StudentError_1.StudentNotFoundError();
            }
            const forgotPasswordToken = JWTService_1.JWTService.generateForgotToken({ userId: student.studentId });
            const resetLink = `${process.env.CORSURL}/reset-password?token=${forgotPasswordToken}`;
            // const subject = 'Password Reset Request';
            // const body = `To reset your password, please click the following link: ${resetLink}`;
            // await sendEmail(student.email, subject, body);
            yield (0, SendEmail_1.sendEmail)(student.email, resetLink);
        });
    }
}
exports.ForgotPasswordUseCase = ForgotPasswordUseCase;
