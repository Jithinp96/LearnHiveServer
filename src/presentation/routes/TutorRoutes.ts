import { Router } from "express";

import { TutorController } from "../controllers/TutorController";
import { TutorRepository } from "../../infrastructure/repositories/TutorRepository";
import { TutorAuthService } from "../../application/services/TutorAuthService";
import tutorAuthMiddleware from "../../infrastructure/middlewares/TutorAuthMiddleware";
import { CourseController } from "../controllers/CourseController";
import { upload } from "../../infrastructure/config/multerConfig"

const tutorRoutes = Router();
const tutorController = new TutorController();
const courseController = new CourseController();
const tutorRepositoryInstance = new TutorRepository();
const tutorAuthService = new TutorAuthService(tutorRepositoryInstance)

tutorRoutes.post("/auth", tutorController.register);
tutorRoutes.post("/resend-otp", tutorController.resendOTP);
tutorRoutes.post("/otp-verify", tutorController.verifyOTP);

tutorRoutes.post('/forgot-password', tutorController.forgotPassword);
tutorRoutes.post('/reset-password', tutorController.resetPassword);

tutorRoutes.post('/login', tutorController.login);
tutorRoutes.post('/logout/:role', tutorAuthMiddleware(tutorAuthService), tutorController.logout);

tutorRoutes.get('/profile/:id', tutorAuthMiddleware(tutorAuthService), tutorController.getProfile);
tutorRoutes.put('/profile/:id/update-education', tutorController.addEducation);

tutorRoutes.post('/:id/add-course', tutorAuthMiddleware(tutorAuthService), courseController.addCourse)
tutorRoutes.post('/upload-video', tutorAuthMiddleware(tutorAuthService), upload.single('video'), courseController.uploadVideoController)
tutorRoutes.post('/upload-thumbnail', tutorAuthMiddleware(tutorAuthService), upload.single('image'), courseController.uploadThumbnail)
tutorRoutes.get('/getcategories', tutorAuthMiddleware(tutorAuthService), courseController.getAllCategories);
tutorRoutes.get('/course-list', tutorAuthMiddleware(tutorAuthService), courseController.fetchTutorCourses);

export default tutorRoutes;