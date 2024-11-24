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
exports.StudentController = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const jwt_decode_1 = require("jwt-decode");
const RegisterStudent_1 = require("../../application/useCases/student/RegisterStudent");
const VerifyOTP_1 = require("../../application/useCases/VerifyOTP");
const StudentLogin_1 = require("../../application/useCases/student/StudentLogin");
const GoogleSignInUseCase_1 = require("../../application/useCases/student/GoogleSignInUseCase");
const LogoutStudent_1 = require("../../application/useCases/student/LogoutStudent");
const TutorUseCase_1 = require("../../application/useCases/tutor/TutorUseCase");
const ForgotPassword_1 = require("../../application/useCases/student/ForgotPassword");
const ResetPassword_1 = require("../../application/useCases/student/ResetPassword");
const StudentUseCase_1 = require("../../application/useCases/student/StudentUseCase");
const CourseCategory_1 = require("../../application/useCases/admin/CourseCategory");
const ResendOTPUseCase_1 = require("../../application/useCases/student/ResendOTPUseCase");
const StudentRepository_1 = require("../../infrastructure/repositories/StudentRepository");
const OTPRepository_1 = require("../../infrastructure/repositories/OTPRepository");
const TutorRepository_1 = require("../../infrastructure/repositories/TutorRepository");
const TutorSlotRepository_1 = require("../../infrastructure/repositories/TutorSlotRepository");
const CourseCategoryRepository_1 = require("../../infrastructure/repositories/CourseCategoryRepository");
const JWTService_1 = require("../../shared/utils/JWTService");
const TutorModel_1 = require("../../infrastructure/database/models/TutorModel");
const EmailService_1 = require("../../infrastructure/services/EmailService");
const awsS3Config_1 = require("../../infrastructure/config/awsS3Config");
const HttpStatusEnum_1 = require("../../shared/enums/HttpStatusEnum");
const SuccessMessageEnum_1 = require("../../shared/enums/SuccessMessageEnum");
const ErrorMessagesEnum_1 = require("../../shared/enums/ErrorMessagesEnum");
const courseCategoryRepository = new CourseCategoryRepository_1.CourseCategoryRepository();
const courseCategoryUseCases = new CourseCategory_1.CourseCategoryUseCases(courseCategoryRepository);
class StudentController {
    constructor() {
        // Register a new student
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { name, email, mobile, password } = req.body;
            try {
                yield this._registerStudentUseCase.execute({ name, email, mobile, password });
                // res.cookie("OTPEmail", email, {
                //     httpOnly: true,
                //     maxAge: 24 * 60 * 60 * 1000,
                //     secure: process.env.NODE_ENV !== "development"
                // });
                res.cookie("OTPEmail", email, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
                    maxAge: 24 * 60 * 60 * 1000,
                });
                res.status(HttpStatusEnum_1.HttpStatusEnum.CREATED).json({
                    success: true,
                    message: SuccessMessageEnum_1.SuccessMessageEnum.REGISTRATION_SUCCESS
                });
            }
            catch (error) {
                console.log("Inside register student controller catch: ", error);
                next(error);
            }
        });
        this.resendOTP = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.cookies.OTPEmail;
                const message = yield this._resendOTPUseCase.execute(email);
                res.status(HttpStatusEnum_1.HttpStatusEnum.CREATED).json({ success: true, message });
            }
            catch (error) {
                next(error);
            }
        });
        // Verify OTP
        this.verifyOTP = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { otp } = req.body;
            const email = req.cookies.OTPEmail;
            if (!email || !otp) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({
                    success: false,
                    message: ErrorMessagesEnum_1.AuthErrorEnum.EMAIL_OTP_NOT_RECEIVED,
                    error: "EMAIL_OTP_NOT_RECEIVED"
                });
            }
            try {
                const isVerified = yield this._verifyOTPUseCase.execute(email, parseInt(otp));
                if (isVerified) {
                    res.clearCookie('OTPEmail');
                    return res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                        success: true,
                        message: SuccessMessageEnum_1.SuccessMessageEnum.OTP_VERIFIED,
                        error: null
                    });
                }
            }
            catch (error) {
                next(error);
            }
        });
        // Login student
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const { accessToken, refreshToken, student } = yield this._loginStudentUseCase.execute(email, password);
                JWTService_1.JWTService.setTokens(res, accessToken, refreshToken);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    success: true,
                    message: SuccessMessageEnum_1.SuccessMessageEnum.LOGIN_SUCCESS,
                    student
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.googleLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { credentials } = req.body;
            const decoded = (0, jwt_decode_1.jwtDecode)(credentials);
            const { name, email, sub } = decoded;
            try {
                const { accessToken, refreshToken, student } = yield this._googleSignInUseCase.execute(email, name, sub);
                JWTService_1.JWTService.setTokens(res, accessToken, refreshToken);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    success: true,
                    message: SuccessMessageEnum_1.SuccessMessageEnum.LOGIN_SUCCESS,
                    student
                });
            }
            catch (error) {
                next(error);
            }
        });
        // Forgot password
        this.forgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                yield this._forgotPasswordUseCase.execute(email);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    success: true,
                    message: SuccessMessageEnum_1.SuccessMessageEnum.RESET_PASSWORD_LINK_SENT,
                });
            }
            catch (error) {
                next(error);
            }
        });
        // Reset password
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { token } = req.query;
            const { newPassword } = req.body;
            try {
                yield this._resetPasswordUseCase.execute(token, newPassword);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    success: true,
                    message: 'Password successfully reset.',
                });
            }
            catch (error) {
                next(error);
            }
        });
        // Logout student
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const role = req.params.role;
            try {
                yield LogoutStudent_1.LogoutStudentUseCase.execute(req, res, role);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    success: true,
                    message: SuccessMessageEnum_1.SuccessMessageEnum.LOGOUT_SUCCESS
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.getProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({
                    success: false,
                    message: ErrorMessagesEnum_1.AuthErrorEnum.INVALID_ID
                });
            }
            try {
                const student = yield this._studentUseCase.getProfile(studentId);
                if (!student) {
                    return res.status(HttpStatusEnum_1.HttpStatusEnum.NOT_FOUND).json({
                        success: false,
                        message: ErrorMessagesEnum_1.StudentErrorEnum.STUDENT_NOT_FOUND
                    });
                }
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    success: true,
                    data: student
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.addEducation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({
                    success: false,
                    message: ErrorMessagesEnum_1.AuthErrorEnum.INVALID_ID
                });
            }
            try {
                const updatedStudent = yield this._studentUseCase.addEducation(studentId, req.body);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    success: true,
                    message: SuccessMessageEnum_1.SuccessMessageEnum.UPDATE_EDUCATION_SUCCESS,
                    data: updatedStudent
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.editEducation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const studentId = req.userId;
            const { educationId } = req.params;
            if (!studentId) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({
                    success: false,
                    message: ErrorMessagesEnum_1.AuthErrorEnum.INVALID_ID
                });
            }
            try {
                const updatedStudent = yield this._studentUseCase.editEducation(studentId, educationId, req.body);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    success: true,
                    message: SuccessMessageEnum_1.SuccessMessageEnum.UPDATE_EDUCATION_SUCCESS,
                    data: updatedStudent
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteEducation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const studentId = req.userId;
            const { educationId } = req.params;
            if (!studentId) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({
                    success: false,
                    message: ErrorMessagesEnum_1.AuthErrorEnum.INVALID_ID
                });
            }
            try {
                const updatedStudent = yield this._studentUseCase.deleteEducation(studentId, educationId);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    success: true,
                    message: SuccessMessageEnum_1.SuccessMessageEnum.UPDATE_EDUCATION_SUCCESS,
                    data: updatedStudent
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.editProfileName = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id, newName } = req.body;
            try {
                const updatedStudent = yield this._studentUseCase.editProfileName(id, newName);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    success: true,
                    data: updatedStudent
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.editMobileNumber = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log("Reached edit mobile number");
            const studentId = req.userId;
            const { newMobile } = req.body;
            console.log("studentId: ", studentId);
            console.log("newMobile: ", newMobile);
            if (!studentId) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({
                    success: false,
                    message: ErrorMessagesEnum_1.AuthErrorEnum.INVALID_ID
                });
            }
            try {
                const updatedStudent = yield this._studentUseCase.editMobileNumber(studentId, newMobile);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    success: true,
                    data: updatedStudent
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.editProfilePicture = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!req.file) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({ error: 'No profile image file provided' });
            }
            const fileName = `${Date.now()}-${req.file.originalname}`;
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };
            const command = new client_s3_1.PutObjectCommand(params);
            yield awsS3Config_1.s3.send(command);
            const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${fileName}`;
            try {
                const updatedStudent = yield this._studentUseCase.editProfilePic(id, url);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    success: true,
                    data: updatedStudent
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.fetchTutorDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { tutorId } = req.params;
            try {
                const tutor = yield TutorModel_1.TutorModel.findById(tutorId).lean();
                if (!tutor) {
                    return res.status(HttpStatusEnum_1.HttpStatusEnum.NOT_FOUND).json({
                        message: "Tutor details not found"
                    });
                }
                res.json(tutor);
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
            }
        });
        this.fetchTutorSlotDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { tutorId } = req.params;
            if (!tutorId) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ message: 'Unable to find tutor details. Please login again' });
                return;
            }
            try {
                const slots = yield this._tutorUseCase.getAllSlotsByTutorId(tutorId);
                res.status(200).json(slots);
            }
            catch (error) {
            }
        });
        this._studentRepo = new StudentRepository_1.StudentRepository();
        this._courseCategoryRepo = new CourseCategoryRepository_1.CourseCategoryRepository();
        this._tutorRepo = new TutorRepository_1.TutorRepository();
        this._tutorSlotRepo = new TutorSlotRepository_1.TutorSlotRepository();
        this._otpRepo = new OTPRepository_1.OTPRepository();
        this._emailService = new EmailService_1.EmailService();
        this._jwtService = new JWTService_1.JWTService();
        this._registerStudentUseCase = new RegisterStudent_1.RegisterStudentUseCase(this._studentRepo, this._emailService);
        this._verifyOTPUseCase = new VerifyOTP_1.VerifyOTP(this._studentRepo);
        this._loginStudentUseCase = new StudentLogin_1.LoginStudentUseCase(this._studentRepo, this._jwtService);
        this._googleSignInUseCase = new GoogleSignInUseCase_1.GoogleSignInUseCase(this._studentRepo);
        this._forgotPasswordUseCase = new ForgotPassword_1.ForgotPasswordUseCase(this._studentRepo);
        this._resetPasswordUseCase = new ResetPassword_1.ResetPasswordUseCase(this._studentRepo);
        this._studentUseCase = new StudentUseCase_1.StudentUseCase(this._studentRepo);
        this._courseCategoryUseCases = new CourseCategory_1.CourseCategoryUseCases(this._courseCategoryRepo);
        this._resendOTPUseCase = new ResendOTPUseCase_1.ResendOTPUseCase(this._otpRepo, this._emailService);
        this._tutorUseCase = new TutorUseCase_1.TutorUseCase(this._tutorRepo, this._tutorSlotRepo);
    }
    //DAHSBOARD
    getDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Inside getDashboard in student controller");
            try {
                const studentId = req.userId;
                if (!studentId) {
                    res.status(401).json({ message: 'Unauthorized access' });
                    return;
                }
                const categories = yield courseCategoryUseCases.getAllCategories();
                res.status(200).json({ categories });
            }
            catch (error) {
                console.error('Error fetching dashboard:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.StudentController = StudentController;
