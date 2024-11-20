"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutStudentUseCase = void 0;
const JWTService_1 = require("../../../shared/utils/JWTService");
const HttpStatusEnum_1 = require("../../../shared/enums/HttpStatusEnum");
class LogoutStudentUseCase {
    static execute(req, res, role) {
        try {
            // JWTService.clearTokens(res, role);
            JWTService_1.JWTService.clearTokens(res);
            return res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({ message: 'Logged out successfully' });
        }
        catch (error) {
            console.error("Logout error:", error);
            return res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Logout failed', error });
        }
    }
}
exports.LogoutStudentUseCase = LogoutStudentUseCase;
