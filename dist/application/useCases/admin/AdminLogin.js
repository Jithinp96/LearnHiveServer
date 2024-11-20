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
exports.AdminLogin = void 0;
const UserRoleEnum_1 = require("../../../shared/enums/UserRoleEnum");
const JWTService_1 = require("../../../shared/utils/JWTService");
class AdminLogin {
    constructor(jwtService) {
        this._jwtService = jwtService;
    }
    execute(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Inside Admin Login usecase");
            try {
                const adminEmail = process.env.ADMIN_EMAIL;
                const adminPassword = process.env.ADMIN_PASSWORD;
                if (email !== adminEmail || password !== adminPassword) {
                    throw new Error('Invalid credentials!');
                }
                const payload = { email: adminEmail, role: UserRoleEnum_1.UserRole.ADMIN };
                const accessToken = JWTService_1.JWTService.generateAccessToken(payload);
                const refreshToken = JWTService_1.JWTService.generateRefreshToken({ payload });
                return { accessToken, refreshToken };
            }
            catch (error) {
                console.error("Admin login error:", error);
                throw new Error("Admin login failed: " + error);
            }
        });
    }
}
exports.AdminLogin = AdminLogin;
