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
exports.LoginStudentUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const JWTService_1 = require("../../../shared/utils/JWTService");
const AuthError_1 = require("../../../domain/errors/AuthError");
const UserRoleEnum_1 = require("../../../shared/enums/UserRoleEnum");
class LoginStudentUseCase {
    constructor(studentRepo, jwtService) {
        this._studentRepo = studentRepo;
        this._jwtService = jwtService;
    }
    execute(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const student = yield this._studentRepo.findStudentByEmail(email);
                if (!student) {
                    throw new AuthError_1.InvalidCredentialsError();
                }
                if (student.isBlocked) {
                    throw new AuthError_1.AccountBlockedError();
                }
                if (!student.isVerified) {
                    throw new AuthError_1.AccountNotVerifiedError();
                }
                const isMatch = yield bcryptjs_1.default.compare(password, student.password);
                if (!isMatch) {
                    throw new AuthError_1.InvalidCredentialsError();
                }
                const studentId = (_a = student._id) === null || _a === void 0 ? void 0 : _a.toString();
                const payload = { _id: studentId, email: student.email, role: UserRoleEnum_1.UserRole.STUDENT };
                const accessToken = JWTService_1.JWTService.generateAccessToken(payload);
                const refreshToken = JWTService_1.JWTService.generateRefreshToken({ payload });
                return { accessToken, refreshToken, student };
            }
            catch (error) {
                if (error instanceof AuthError_1.InvalidCredentialsError ||
                    error instanceof AuthError_1.AccountBlockedError ||
                    error instanceof AuthError_1.AccountNotVerifiedError) {
                    throw error;
                }
                throw new AuthError_1.LoginFailed();
            }
        });
    }
}
exports.LoginStudentUseCase = LoginStudentUseCase;
// import bcrypt from 'bcryptjs';
// import { IStudentRepository } from "../../../domain/interfaces/IStudentRepository";
// import { JWTService } from "../../../shared/utils/JWTService";
// import { InvalidCredentialsError, AccountBlockedError, AccountNotVerifiedError, LoginFailed } from '../../../domain/errors/AuthError';
// export class LoginStudentUseCase {
//     private _studentRepo: IStudentRepository;
//     private _jwtService: JWTService;
//     constructor(studentRepo: IStudentRepository, jwtService: JWTService) {
//         this._studentRepo = studentRepo;
//         this._jwtService = jwtService;
//     }
//     async execute(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; student: any }> {
//         try {
//             const student = await this._studentRepo.findStudentByEmail(email);
//             if (!student) {
//                 throw new InvalidCredentialsError();
//             }
//             if (student.isBlocked) {
//                 throw new AccountBlockedError();
//             }
//             if (!student.isVerified) {
//                 throw new AccountNotVerifiedError();
//             }
//             const isMatch = await bcrypt.compare(password, student.password);
//             if (!isMatch) {
//                 throw new InvalidCredentialsError();
//             }
//             const accessToken = JWTService.generateStudentAccessToken( student )
//             const refreshToken = JWTService.generateStudentRefreshToken({ student });
//             return { accessToken, refreshToken, student };
//         } catch (error) {
//             throw new LoginFailed();
//         }
//     }
// }
