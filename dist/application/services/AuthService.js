"use strict";
// import { IAuthService, RefreshResult, ValidationResult } from "../../domain/interfaces/IAuthService";
// import { IStudentRepository } from "../../domain/interfaces/IStudentRepository";
// import { UserRole } from "../../shared/enums/UserRoleEnum";
// import { JWTService } from "../../shared/utils/JWTService";
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
exports.AuthService = void 0;
const UserRoleEnum_1 = require("../../shared/enums/UserRoleEnum");
const JWTService_1 = require("../../shared/utils/JWTService");
class AuthService {
    constructor(_studentRepo, _tutorRepo) {
        this._studentRepo = _studentRepo;
        this._tutorRepo = _tutorRepo;
    }
    validateAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = JWTService_1.JWTService.verifyAccessToken(token);
            // console.log("decoded inside validate access token: ", decoded);
            if (!decoded)
                return null;
            switch (decoded.role) {
                case UserRoleEnum_1.UserRole.STUDENT:
                    const student = yield this._studentRepo.findStudentById(decoded._id);
                    if (!student || student.isBlocked)
                        return null;
                    return {
                        userId: decoded._id,
                        role: UserRoleEnum_1.UserRole.STUDENT
                    };
                case UserRoleEnum_1.UserRole.TUTOR:
                    const tutor = yield this._tutorRepo.findTutorById(decoded._id);
                    if (!tutor || tutor.isBlocked)
                        return null;
                    return {
                        userId: decoded._id,
                        role: UserRoleEnum_1.UserRole.TUTOR
                    };
                case UserRoleEnum_1.UserRole.ADMIN:
                    return {
                        userId: decoded.email,
                        role: UserRoleEnum_1.UserRole.ADMIN
                    };
                default:
                    return null;
            }
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = JWTService_1.JWTService.verifyRefreshToken(refreshToken);
            if (!decoded)
                return null;
            let role;
            switch (decoded.payload.role) {
                case UserRoleEnum_1.UserRole.STUDENT:
                    role = UserRoleEnum_1.UserRole.STUDENT;
                    break;
                case UserRoleEnum_1.UserRole.TUTOR:
                    role = UserRoleEnum_1.UserRole.TUTOR;
                    break;
                case UserRoleEnum_1.UserRole.ADMIN:
                    role = UserRoleEnum_1.UserRole.ADMIN;
                    break;
                default:
                    return null;
            }
            const newAccessToken = JWTService_1.JWTService.generateAccessToken({
                _id: decoded.payload._id,
                email: decoded.payload.email,
                role
            });
            return {
                accessToken: newAccessToken,
                role
            };
        });
    }
}
exports.AuthService = AuthService;
