"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutAdminUseCase = void 0;
const JWTService_1 = require("../../../shared/utils/JWTService");
class LogoutAdminUseCase {
    static execute(res) {
        try {
            JWTService_1.JWTService.clearTokens(res);
        }
        catch (error) {
            throw new Error('Logout failed. Please try again!');
        }
    }
}
exports.LogoutAdminUseCase = LogoutAdminUseCase;
