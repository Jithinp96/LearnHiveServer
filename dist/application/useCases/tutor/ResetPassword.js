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
exports.ResetPassword = void 0;
const JWTService_1 = require("../../../shared/utils/JWTService");
const HttpStatusEnum_1 = require("../../../shared/enums/HttpStatusEnum");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class ResetPassword {
    constructor(_tutorRepo) {
        this._tutorRepo = _tutorRepo;
    }
    execute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.query;
            const { newPassword } = req.body;
            try {
                if (typeof token !== 'string') {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ message: 'Token is missing or invalid.' });
                    return;
                }
                const decodedToken = JWTService_1.JWTService.verifyForgotToken(token);
                if (!decodedToken) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ message: 'Invalid or expired token.' });
                    return;
                }
                const tutorId = decodedToken.userId._id;
                const tutor = yield this._tutorRepo.findTutorById(tutorId);
                if (!tutor) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.NOT_FOUND).json({ message: 'Student not found.' });
                    return;
                }
                const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
                yield this._tutorRepo.updateTutorPassword(tutorId, hashedPassword);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({ message: 'Password successfully reset.' });
            }
            catch (error) {
                console.error('Error in ResetPassword:', error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Error resetting password.' });
            }
        });
    }
    ;
}
exports.ResetPassword = ResetPassword;
