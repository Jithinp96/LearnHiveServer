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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordUseCase = void 0;
const JWTService_1 = require("../../../shared/utils/JWTService");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const StudentError_1 = require("../../../domain/errors/StudentError");
const ErrorMessagesEnum_1 = require("../../../shared/enums/ErrorMessagesEnum");
const TokenError_1 = require("../../../domain/errors/TokenError");
class ResetPasswordUseCase {
    constructor(_studentRepo) {
        this._studentRepo = _studentRepo;
    }
    execute(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                throw new TokenError_1.TokenMissingOrInvalidError(ErrorMessagesEnum_1.AuthErrorEnum.INVALID_OR_EXPIRED_TOKEN);
            }
            const decodedToken = JWTService_1.JWTService.verifyForgotToken(token);
            if (!decodedToken) {
                throw new TokenError_1.TokenMissingOrInvalidError(ErrorMessagesEnum_1.AuthErrorEnum.INVALID_OR_EXPIRED_TOKEN);
            }
            const studentId = decodedToken.userId;
            const student = yield this._studentRepo.findStudentById(studentId);
            if (!student) {
                throw new StudentError_1.StudentNotFoundError(ErrorMessagesEnum_1.StudentErrorEnum.STUDENT_NOT_FOUND);
            }
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
            yield this._studentRepo.updateStudentPassword(studentId, hashedPassword);
        });
    }
}
exports.ResetPasswordUseCase = ResetPasswordUseCase;
