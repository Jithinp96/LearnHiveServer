"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleware_1 = __importDefault(require("../../infrastructure/middlewares/AuthMiddleware"));
const AuthService_1 = require("../../application/services/AuthService");
const TutorRepository_1 = require("../../infrastructure/repositories/TutorRepository");
const StudentRepository_1 = require("../../infrastructure/repositories/StudentRepository");
const TutorController_1 = require("../controllers/TutorController");
const CourseController_1 = require("../controllers/CourseController");
const multerConfig_1 = require("../../infrastructure/config/multerConfig");
const tutorRoutes = (0, express_1.Router)();
const studentRepo = new StudentRepository_1.StudentRepository();
const tutorRepo = new TutorRepository_1.TutorRepository();
const authService = new AuthService_1.AuthService(studentRepo, tutorRepo);
const tutorController = new TutorController_1.TutorController();
const courseController = new CourseController_1.CourseController();
tutorRoutes.post("/auth", tutorController.register);
tutorRoutes.post("/resend-otp", tutorController.resendOTP);
tutorRoutes.post("/otp-verify", tutorController.verifyOTP);
tutorRoutes.post('/forgot-password', tutorController.forgotPassword);
tutorRoutes.post('/reset-password', tutorController.resetPassword);
tutorRoutes.post('/login', tutorController.login);
tutorRoutes.post('/google-login', tutorController.googleLogin);
tutorRoutes.post('/logout/:role', (0, AuthMiddleware_1.default)(authService), tutorController.logout);
tutorRoutes.get('/dashboard', (0, AuthMiddleware_1.default)(authService), tutorController.getDashboard);
tutorRoutes.get('/profile/:id', (0, AuthMiddleware_1.default)(authService), tutorController.getProfile);
tutorRoutes.get('/tutorprofile/:id', tutorController.getProfile);
tutorRoutes.put("/profile/:id/add-education", (0, AuthMiddleware_1.default)(authService), tutorController.addEducation);
tutorRoutes.put("/profile/:id/edit-education/:educationId", (0, AuthMiddleware_1.default)(authService), tutorController.editEducation);
tutorRoutes.delete("/profile/:id/delete-education/:educationId", (0, AuthMiddleware_1.default)(authService), tutorController.deleteEducation);
tutorRoutes.put('/profile/edit-name', tutorController.editProfileName);
tutorRoutes.put('/profile/edit-mobile', tutorController.editMobileNumber);
tutorRoutes.put('/profile/edit-profilePic/:id', multerConfig_1.upload.single('image'), tutorController.editProfilePicture);
tutorRoutes.put('/profile/add-subject', (0, AuthMiddleware_1.default)(authService), tutorController.addSubject);
tutorRoutes.put('/profile/edit-subject', (0, AuthMiddleware_1.default)(authService), tutorController.editSubject);
tutorRoutes.put('/profile/delete-subject', (0, AuthMiddleware_1.default)(authService), tutorController.deleteSubject);
tutorRoutes.post('/:id/add-course', (0, AuthMiddleware_1.default)(authService), courseController.addCourse);
tutorRoutes.get(`/edit-course/:courseId`, (0, AuthMiddleware_1.default)(authService), courseController.fetchCourseDetails);
tutorRoutes.put(`/edit-course/:courseId`, (0, AuthMiddleware_1.default)(authService), courseController.editCourse);
tutorRoutes.post('/upload-video', (0, AuthMiddleware_1.default)(authService), multerConfig_1.upload.single('video'), courseController.uploadVideoController);
tutorRoutes.post('/upload-thumbnail', (0, AuthMiddleware_1.default)(authService), multerConfig_1.upload.single('image'), courseController.uploadThumbnail);
tutorRoutes.get('/getcategories', (0, AuthMiddleware_1.default)(authService), courseController.getAllCategories);
tutorRoutes.get('/course-list', (0, AuthMiddleware_1.default)(authService), courseController.fetchTutorCourses);
tutorRoutes.get('/getSubjects', (0, AuthMiddleware_1.default)(authService), tutorController.fetchSubjects);
tutorRoutes.post('/addslot', (0, AuthMiddleware_1.default)(authService), tutorController.addSlot);
tutorRoutes.put('/editslot', (0, AuthMiddleware_1.default)(authService), tutorController.editSlot);
tutorRoutes.get('/slot/:slotId', (0, AuthMiddleware_1.default)(authService), tutorController.getSlotById);
tutorRoutes.get('/appointment', (0, AuthMiddleware_1.default)(authService), tutorController.getAllSlotsByTutorId);
tutorRoutes.post('/generate-slots', (0, AuthMiddleware_1.default)(authService), tutorController.multipleSlotGeneration);
tutorRoutes.post('/generate-slots-preference', (0, AuthMiddleware_1.default)(authService), tutorController.saveSlotPreference);
exports.default = tutorRoutes;
