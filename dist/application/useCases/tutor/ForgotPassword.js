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
exports.ForgotPassword = void 0;
const JWTService_1 = require("../../../shared/utils/JWTService");
const HttpStatusEnum_1 = require("../../../shared/enums/HttpStatusEnum");
const SendEmail_1 = require("../../../shared/utils/SendEmail");
class ForgotPassword {
    constructor(_tutorRepo) {
        this._tutorRepo = _tutorRepo;
    }
    execute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({ message: "Email is required" });
                return;
            }
            try {
                const tutor = yield this._tutorRepo.findTutorByEmail(email);
                if (!tutor) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.NOT_FOUND).json({ message: "Tutor not found" });
                    return;
                }
                const forgotPasswordToken = JWTService_1.JWTService.generateForgotToken({ userId: tutor });
                const resetLink = `${process.env.CORSURL}/tutor/reset-password?token=${forgotPasswordToken}`;
                const subject = 'Password Reset Request';
                const body = `To reset your password, please click the following link: ${resetLink}`;
                yield (0, SendEmail_1.sendEmail)(tutor.email, resetLink);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({ message: 'Password reset link sent to your email.' });
                return;
            }
            catch (error) {
                console.error('Error in ForgotPassword:', error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Error sending reset link.' });
                return;
            }
        });
    }
}
exports.ForgotPassword = ForgotPassword;
