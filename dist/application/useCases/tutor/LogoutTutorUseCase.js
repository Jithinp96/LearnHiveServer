"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutTutorUseCase = void 0;
const JWTService_1 = require("../../../shared/utils/JWTService");
class LogoutTutorUseCase {
    static execute(res) {
        try {
            JWTService_1.JWTService.clearTokens(res);
        }
        catch (error) {
            throw new Error('Logout failed. Please try again!');
        }
    }
}
exports.LogoutTutorUseCase = LogoutTutorUseCase;
