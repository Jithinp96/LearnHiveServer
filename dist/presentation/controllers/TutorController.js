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
exports.TutorController = void 0;
const RegisterTutor_1 = require("../../application/useCases/tutor/RegisterTutor");
const VerifyOTP_1 = require("../../application/useCases/VerifyOTP");
const TutorRepository_1 = require("../../infrastructure/repositories/TutorRepository");
const TutorLogin_1 = require("../../application/useCases/tutor/TutorLogin");
const JWTService_1 = require("../../shared/utils/JWTService");
const OTPService_1 = require("../../shared/utils/OTPService");
const OTPModel_1 = require("../../infrastructure/database/models/OTPModel");
const EmailServiceTutor_1 = require("../../infrastructure/services/EmailServiceTutor");
const HttpStatusEnum_1 = require("../../shared/enums/HttpStatusEnum");
const ForgotPassword_1 = require("../../application/useCases/tutor/ForgotPassword");
const ResetPassword_1 = require("../../application/useCases/tutor/ResetPassword");
const LogoutTutorUseCase_1 = require("../../application/useCases/tutor/LogoutTutorUseCase");
const TutorUseCase_1 = require("../../application/useCases/tutor/TutorUseCase");
const client_s3_1 = require("@aws-sdk/client-s3");
const awsS3Config_1 = require("../../infrastructure/config/awsS3Config");
const TutorSlotRepository_1 = require("../../infrastructure/repositories/TutorSlotRepository");
const SaveSlotPreferenceUseCase_1 = require("../../application/useCases/tutor/SaveSlotPreferenceUseCase");
const TutorSlotPreferenceRepository_1 = require("../../infrastructure/repositories/TutorSlotPreferenceRepository");
const MultipleSlotSchedulerRepository_1 = require("../../infrastructure/repositories/MultipleSlotSchedulerRepository");
const GenerateMultipleSlotUseCase_1 = require("../../application/useCases/tutor/GenerateMultipleSlotUseCase");
const GetTutorDashboardUseCase_1 = require("../../application/useCases/tutor/GetTutorDashboardUseCase");
const TutorDashboardRepository_1 = require("../../infrastructure/repositories/TutorDashboardRepository");
const jwt_decode_1 = require("jwt-decode");
const SuccessMessageEnum_1 = require("../../shared/enums/SuccessMessageEnum");
const GoogleSignInUseCase_1 = require("../../application/useCases/tutor/GoogleSignInUseCase");
const EmailService_1 = require("../../infrastructure/services/EmailService");
class TutorController {
    constructor() {
        //REGISTER TUTOR
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { name, email, mobile, password } = req.body;
            try {
                yield this._registerTutor.execute({ name, email, mobile, password });
                res.cookie("OTPEmail", email, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                    secure: process.env.NODE_ENV !== "development"
                });
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
                next(error);
            }
        });
        this.resendOTP = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.cookies.OTPEmail;
                const otp = (0, OTPService_1.generateOTP)();
                console.log("Tutor OTP: ", otp);
                const dbOTP = yield OTPModel_1.OTPModel.findOne({ email });
                yield OTPModel_1.OTPModel.deleteOne({ _id: dbOTP === null || dbOTP === void 0 ? void 0 : dbOTP._id });
                const expiredAt = new Date(Date.now() + 60000);
                yield OTPModel_1.OTPModel.create({ email: email, otp, expiredAt });
                yield (0, EmailServiceTutor_1.sendOTPEmail)(email, otp);
                res.status(HttpStatusEnum_1.HttpStatusEnum.CREATED).json({ message: "OTP Resent successful." });
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "An error occurred during otp resend" });
            }
        });
        //TUTOR OTP VERIFICATION
        this.verifyOTP = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { otp } = req.body;
            const email = req.cookies.OTPEmail;
            if (!email || !otp) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({
                    success: false,
                    message: "Email and OTP are required",
                    error: "INVALID_INPUT"
                });
            }
            try {
                const isVerified = yield this._verifyOTPUseCase.execute(email, parseInt(otp));
                if (isVerified) {
                    res.clearCookie('OTPEmail');
                    return res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                        success: true,
                        message: "OTP verified successfully!",
                        error: null
                    });
                }
                else {
                    return res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({
                        success: false,
                        message: "Invalid OTP. Please try again!",
                        error: "INVALID_OTP"
                    });
                }
            }
            catch (error) {
                console.error("OTP verification failed: ", error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal server error",
                    error: "SERVER_ERROR"
                });
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const { accessToken, refreshToken, tutor } = yield this._loginTutorUseCase.execute(email, password);
                JWTService_1.JWTService.setTokens(res, accessToken, refreshToken);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    message: "Tutor Login Successful",
                    tutor,
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
                const { accessToken, refreshToken, tutor } = yield this._googleSignInUseCase.execute(email, name, sub);
                JWTService_1.JWTService.setTokens(res, accessToken, refreshToken);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    success: true,
                    message: SuccessMessageEnum_1.SuccessMessageEnum.LOGIN_SUCCESS,
                    tutor
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.forgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._forgotPasswordUseCase.execute(req, res);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
            }
        });
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._resetPasswordUseCase.execute(req, res);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
            }
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const role = req.params.role;
            return LogoutTutorUseCase_1.LogoutTutorUseCase.execute(req, res, role);
        });
        this.getDashboard = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tutorId = req.userId;
            if (!tutorId) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ message: 'Unauthorized: Tutor ID is required.' });
                return;
            }
            try {
                const dashboardData = yield this._getTutorDashboardUseCase.execute(tutorId);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(dashboardData);
            }
            catch (error) {
                console.error('Error fetching dashboard data:', error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch dashboard data. Please try again later.' });
            }
        });
        this.getProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tutorId = req.userId;
            if (!tutorId) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ message: 'Unauthorized: Tutor ID is required.' });
                return;
            }
            try {
                const tutor = yield this._tutorRepo.findTutorById(tutorId);
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
        this.addSubject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tutorId = req.userId;
            const { subjectData } = req.body;
            if (!tutorId) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ message: 'Unauthorized: Tutor ID is required.' });
                return;
            }
            try {
                const updatedTutor = yield this._tutorUseCase.addSubject(tutorId, subjectData);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(updatedTutor);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to add subject" });
            }
        });
        this.editSubject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tutorId = req.userId;
            const { subjectId, editedSubject } = req.body;
            if (!tutorId) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ message: 'Unauthorized: Tutor ID is required.' });
                return;
            }
            try {
                const updatedTutor = yield this._tutorUseCase.editSubject(tutorId, subjectId, editedSubject);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(updatedTutor);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to edit subject" });
            }
        });
        this.deleteSubject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tutorId = req.userId;
            const { subjectId } = req.body;
            if (!tutorId) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ message: 'Unauthorized: Tutor ID is required.' });
                return;
            }
            try {
                const updatedTutor = yield this._tutorUseCase.deleteSubject(tutorId, subjectId);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(updatedTutor);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete subject" });
            }
        });
        this.fetchSubjects = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tutorId = req.userId;
            if (!tutorId) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ message: 'Unauthorized: Tutor ID is required.' });
                return;
            }
            try {
                const subjects = yield this._tutorUseCase.fetchSubjects(tutorId);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({ subjects });
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch subjects' });
            }
        });
        this.addEducation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { level, board, startDate, endDate, grade, institution } = req.body;
            try {
                const tutor = yield this._tutorRepo.findTutorById(id);
                if (!tutor) {
                    return res.status(HttpStatusEnum_1.HttpStatusEnum.NOT_FOUND).json({
                        message: "Tutor details not found"
                    });
                }
                yield this._tutorUseCase.addEducation(id, { level, board, startDate, endDate, grade, institution });
            }
            catch (error) {
                console.error(error);
            }
        });
        this.editEducation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, educationId } = req.params;
            const educationData = req.body;
            try {
                const updatedTutor = yield this._tutorUseCase.editEducation(id, educationId, educationData);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(updatedTutor);
            }
            catch (error) {
                console.error(error);
            }
        });
        this.deleteEducation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, educationId } = req.params;
            try {
                const updatedTutor = yield this._tutorUseCase.deleteEducation(id, educationId);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(updatedTutor);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete education" });
            }
        });
        this.editProfileName = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, newName } = req.body;
            try {
                const updatedTutor = yield this._tutorUseCase.editProfileName(id, newName);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(updatedTutor);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to update name" });
            }
        });
        this.editMobileNumber = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, newNumber } = req.body;
            try {
                const updatedTutor = yield this._tutorUseCase.editMobileNumber(id, newNumber);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(updatedTutor);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to update name" });
            }
        });
        this.editProfilePicture = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const bucketRegion = process.env.S3_BUCKET_REGION;
            const bucketName = process.env.S3_BUCKET_NAME;
            const { id } = req.params;
            if (!req.file) {
                console.log("No file received");
                return res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({ error: 'No profile image file provided' });
            }
            const fileName = `${Date.now()}-${req.file.originalname}`;
            const params = {
                Bucket: bucketName,
                Key: fileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };
            const command = new client_s3_1.PutObjectCommand(params);
            yield awsS3Config_1.s3.send(command);
            const url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;
            const updatedTutor = yield this._tutorUseCase.editProfilePic(id, url);
            res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(updatedTutor);
        });
        this.addSlot = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tutorId = req.userId;
            const slotData = req.body;
            const mergedSlotData = Object.assign({ tutorId }, slotData);
            try {
                const newSlot = yield this._tutorUseCase.addSlot(mergedSlotData);
                res.status(HttpStatusEnum_1.HttpStatusEnum.CREATED).json(newSlot);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({ error: error });
            }
        });
        this.editSlot = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { slotData, slotId } = req.body;
            try {
                const updatedSlot = yield this._tutorUseCase.editSlot(slotId, slotData);
                if (!updatedSlot) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.NOT_FOUND).json({ message: 'Slot not found' });
                    return;
                }
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(updatedSlot);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({ error: error });
            }
        });
        this.getSlotById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const slotId = req.params.slotId;
            try {
                const slot = yield this._tutorUseCase.getSlotById(slotId);
                if (!slot) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.NOT_FOUND).json({ message: 'Slot not found' });
                    return;
                }
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(slot);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({ error: error });
            }
        });
        this.getAllSlotsByTutorId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tutorId = req.userId;
            if (!tutorId) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ message: 'Unable to find tutor details. Please login again' });
                return;
            }
            try {
                const slots = yield this._tutorUseCase.getAllSlotsByTutorId(tutorId);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(slots);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({ error: error });
            }
        });
        this.saveSlotPreference = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Reached inside save preference constroller");
                const { tutorId, subject, level, date, startTime, endTime, price, requiresDailySlotCreation } = req.body;
                const saveData = {
                    tutorId: tutorId,
                    subject: subject,
                    level: level,
                    endDate: date,
                    startTime: startTime,
                    endTime: endTime,
                    price: price,
                    requiresDailySlotCreation: requiresDailySlotCreation
                };
                const slots = yield this._saveSlotPreferenceUseCase.execute(saveData);
                res.status(HttpStatusEnum_1.HttpStatusEnum.CREATED).json({ message: 'Slot preference saved successfully' });
            }
            catch (error) {
                console.log("error from the save slot preference in tutor controller");
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Failed to save slot preference', error });
            }
        });
        this.multipleSlotGeneration = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("Reached GenerateSlot controller");
            try {
                const { tutorId, subject, date, level, startTime, endTime, price } = req.body;
                const multipleSlotSchedulerRepository = new MultipleSlotSchedulerRepository_1.MultipleSlotSchedulerRepository();
                const generateMultipleSlotUseCase = new GenerateMultipleSlotUseCase_1.GenerateMultipleSlotUseCase(multipleSlotSchedulerRepository);
                const newSlots = yield generateMultipleSlotUseCase.execute(tutorId, subject, level, date, startTime, endTime, price);
                console.log("newSlots: ", newSlots);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({ message: 'Slots generated successfully', newSlots });
            }
            catch (error) {
                console.error('Error generating slots:', error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Error generating slots' });
            }
        });
        this._tutorRepo = new TutorRepository_1.TutorRepository();
        this._tutorSlotRepo = new TutorSlotRepository_1.TutorSlotRepository();
        this._tutorSlotPreferenceRepository = new TutorSlotPreferenceRepository_1.TutorSlotPreferenceRepository();
        this._tutorDashboardRepo = new TutorDashboardRepository_1.TutorDashboardRepository();
        this._jwtService = new JWTService_1.JWTService();
        this._emailService = new EmailService_1.EmailService();
        this._registerTutor = new RegisterTutor_1.RegisterTutor(this._tutorRepo, this._emailService);
        this._verifyOTPUseCase = new VerifyOTP_1.VerifyOTPTutor(this._tutorRepo);
        this._loginTutorUseCase = new TutorLogin_1.LoginTutorUseCase(this._tutorRepo, this._jwtService);
        this._googleSignInUseCase = new GoogleSignInUseCase_1.GoogleSignInUseCase(this._tutorRepo);
        this._forgotPasswordUseCase = new ForgotPassword_1.ForgotPassword(this._tutorRepo);
        this._resetPasswordUseCase = new ResetPassword_1.ResetPassword(this._tutorRepo);
        this._tutorUseCase = new TutorUseCase_1.TutorUseCase(this._tutorRepo, this._tutorSlotRepo);
        this._saveSlotPreferenceUseCase = new SaveSlotPreferenceUseCase_1.SaveSlotPreferenceUseCase(this._tutorSlotPreferenceRepository);
        this._getTutorDashboardUseCase = new GetTutorDashboardUseCase_1.GetTutorDashboardUseCase(this._tutorDashboardRepo);
    }
}
exports.TutorController = TutorController;
