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
exports.ResendOTPUseCase = void 0;
const ErrorMessagesEnum_1 = require("../../../shared/enums/ErrorMessagesEnum");
const SuccessMessageEnum_1 = require("../../../shared/enums/SuccessMessageEnum");
const OTPService_1 = require("../../../shared/utils/OTPService");
class ResendOTPUseCase {
    constructor(otpRepository, emailService) {
        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }
    execute(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                throw new Error(ErrorMessagesEnum_1.AuthErrorEnum.EMAIL_NOT_RECEIVED);
            }
            const otp = (0, OTPService_1.generateOTP)();
            const expiredAt = new Date(Date.now() + 60000);
            const dbOTP = yield this.otpRepository.findByEmail(email);
            if (dbOTP) {
                yield this.otpRepository.delete(dbOTP._id);
            }
            console.log("New OTP: ", otp);
            yield this.otpRepository.save({ email, otp, expiredAt });
            // await this.emailService.send(email, `Your OTP is: ${otp}`);
            return SuccessMessageEnum_1.SuccessMessageEnum.OTP_RESENT;
        });
    }
}
exports.ResendOTPUseCase = ResendOTPUseCase;
