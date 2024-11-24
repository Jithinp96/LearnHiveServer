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
exports.RegisterStudentUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const IDService_1 = require("../../../shared/utils/IDService");
const OTPService_1 = require("../../../shared/utils/OTPService");
const StudentError_1 = require("../../../domain/errors/StudentError");
const OTPModel_1 = require("../../../infrastructure/database/models/OTPModel");
class RegisterStudentUseCase {
    constructor(_studentRepo, _emailService) {
        this._studentRepo = _studentRepo;
        this._emailService = _emailService;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingStudent = yield this._studentRepo.findStudentByEmail(data.email);
                if (existingStudent) {
                    throw new StudentError_1.StudentAlreadyExistsError();
                }
                const id = `student-${(0, IDService_1.generateUniqueId)()}`;
                const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
                const otp = (0, OTPService_1.generateOTP)();
                console.log("Student OTP: ", otp);
                const newStudent = {
                    studentId: id,
                    name: data.name,
                    email: data.email,
                    mobile: data.mobile,
                    password: hashedPassword,
                    isVerified: false,
                    role: "Student",
                    isBlocked: false,
                    education: []
                };
                yield this._studentRepo.createStudent(newStudent);
                const expiredAt = new Date(Date.now() + 60000);
                yield OTPModel_1.OTPModel.create({ email: data.email, otp, expiredAt });
                // await this._emailService.send(data.email, `Your OTP for registration is: ${otp}`);
            }
            catch (error) {
                if (error instanceof StudentError_1.StudentAlreadyExistsError) {
                    throw error;
                }
                throw new StudentError_1.RegistrationError();
            }
        });
    }
}
exports.RegisterStudentUseCase = RegisterStudentUseCase;
