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
exports.LoginTutorUseCase = void 0;
const UserRoleEnum_1 = require("../../../shared/enums/UserRoleEnum");
const JWTService_1 = require("../../../shared/utils/JWTService");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class LoginTutorUseCase {
    constructor(tutorRepo, jwtService) {
        this._tutorRepo = tutorRepo;
        this._jwtService = jwtService;
    }
    execute(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield this._tutorRepo.findTutorByEmail(email);
                if (!tutor) {
                    throw new Error("Invalid email or password");
                }
                if (tutor.isBlocked) {
                    throw new Error("Your account is blocked");
                }
                if (!tutor.isVerified) {
                    throw new Error("Your account is not verified");
                }
                const isMatch = yield bcryptjs_1.default.compare(password, tutor.password);
                if (!isMatch) {
                    throw new Error("Invalid email or password");
                }
                const payload = { _id: tutor._id, email: tutor.email, role: UserRoleEnum_1.UserRole.TUTOR };
                const accessToken = JWTService_1.JWTService.generateAccessToken(payload);
                const refreshToken = JWTService_1.JWTService.generateRefreshToken({ payload });
                // const accessToken = JWTService.generateAccessToken( tutor );
                // const refreshToken = JWTService.generateRefreshToken({ tutor });
                return { accessToken, refreshToken, tutor };
            }
            catch (error) {
                console.error("Tutor Login error:", error);
                throw new Error("Tutor Login Failed");
            }
        });
    }
}
exports.LoginTutorUseCase = LoginTutorUseCase;
