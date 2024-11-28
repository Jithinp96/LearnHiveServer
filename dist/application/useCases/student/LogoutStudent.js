"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutStudentUseCase = void 0;
const JWTService_1 = require("../../../shared/utils/JWTService");
class LogoutStudentUseCase {
    static execute(res) {
        try {
            JWTService_1.JWTService.clearTokens(res);
        }
        catch (error) {
            throw new Error('Logout failed. Please try again!');
        }
    }
}
exports.LogoutStudentUseCase = LogoutStudentUseCase;
