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
exports.GoogleSignInUseCase = void 0;
const AuthError_1 = require("../../../domain/errors/AuthError");
const UserRoleEnum_1 = require("../../../shared/enums/UserRoleEnum");
const IDService_1 = require("../../../shared/utils/IDService");
const JWTService_1 = require("../../../shared/utils/JWTService");
class GoogleSignInUseCase {
    constructor(_studentRepo) {
        this._studentRepo = _studentRepo;
    }
    execute(email, name, sub) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let student = yield this._studentRepo.findStudentByEmail(email);
                if (!student) {
                    const id = `student-${(0, IDService_1.generateUniqueId)()}`;
                    const newStudent = {
                        studentId: id,
                        name: name,
                        email: email,
                        mobile: 0,
                        password: '',
                        isVerified: true,
                        role: "Student",
                        isBlocked: false,
                        education: []
                    };
                    student = yield this._studentRepo.createStudent(newStudent);
                }
                if (student === null || student === void 0 ? void 0 : student.isBlocked) {
                    throw new AuthError_1.AccountBlockedError();
                }
                const studentId = (_a = student === null || student === void 0 ? void 0 : student._id) === null || _a === void 0 ? void 0 : _a.toString();
                const payload = { _id: studentId, email: student === null || student === void 0 ? void 0 : student.email, role: UserRoleEnum_1.UserRole.STUDENT };
                const accessToken = JWTService_1.JWTService.generateAccessToken(payload);
                const refreshToken = JWTService_1.JWTService.generateRefreshToken({ payload });
                return { accessToken, refreshToken, student };
            }
            catch (error) {
                if (error instanceof AuthError_1.AccountBlockedError) {
                    throw error;
                }
                throw new AuthError_1.LoginFailed();
            }
        });
    }
}
exports.GoogleSignInUseCase = GoogleSignInUseCase;
