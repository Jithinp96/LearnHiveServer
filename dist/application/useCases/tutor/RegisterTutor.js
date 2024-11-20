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
exports.RegisterTutor = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const OTPService_1 = require("../../../shared/utils/OTPService");
const OTPModel_1 = require("../../../infrastructure/database/models/OTPModel");
const EmailServiceTutor_1 = require("../../../infrastructure/services/EmailServiceTutor");
const IDService_1 = require("../../../shared/utils/IDService");
class RegisterTutor {
    constructor(_tutorRepo) {
        this._tutorRepo = _tutorRepo;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingTutor = yield this._tutorRepo.findTutorByEmail(data.email);
                if (existingTutor) {
                    throw new Error("Tutor with this email already exists");
                }
                const id = `tutor-${(0, IDService_1.generateUniqueId)()}`;
                const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
                const otp = (0, OTPService_1.generateOTP)();
                console.log("Tutor OTP: ", otp);
                const newTutor = {
                    tutorId: id,
                    name: data.name,
                    email: data.email,
                    mobile: data.mobile,
                    password: hashedPassword,
                    isVerified: false,
                    isBlocked: false,
                    role: 'Tutor',
                    education: [],
                    subjects: [],
                    workExperience: []
                };
                const createdTutor = yield this._tutorRepo.createTutor(newTutor);
                const expiredAt = new Date(Date.now() + 60000);
                yield OTPModel_1.OTPModel.create({ email: data.email, otp, expiredAt });
                yield (0, EmailServiceTutor_1.sendOTPEmail)(data.email, otp);
            }
            catch (error) {
                console.error("Error in RegisterTutor:", error);
                throw new Error("Tutor registration failed" + error);
            }
        });
    }
}
exports.RegisterTutor = RegisterTutor;
