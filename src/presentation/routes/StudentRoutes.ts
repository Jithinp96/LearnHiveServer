import { Router } from "express";

import { StudentController } from "../controllers/StudentController";
import studentAuthMiddleware from "../../infrastructure/middlewares/StudentAuthMiddleware";
import { StudentAuthService } from "../../application/services/StudentAuthService";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { CourseController } from "../controllers/CourseController";

const studentController = new StudentController();
const studentRepositoryInstance = new StudentRepository();
const courseController = new CourseController()
const studentAuthService = new StudentAuthService(studentRepositoryInstance)

const studentRoutes = Router();

studentRoutes.post("/auth", studentController.register);
studentRoutes.post("/resend-otp", studentController.resendOTP);
studentRoutes.post("/otp-verify", studentController.verifyOTP);
studentRoutes.post('/forgot-password', studentController.forgotPassword); 
studentRoutes.post('/reset-password', studentController.resetPassword);

studentRoutes.post('/login', studentController.login);
studentRoutes.post('/logout/:role', studentAuthMiddleware(studentAuthService), studentController.logout);

studentRoutes.get('/dashboard', studentAuthMiddleware(studentAuthService), studentController.getDashboard)

studentRoutes.get('/profile/:id', studentAuthMiddleware(studentAuthService), studentController.getProfile);
studentRoutes.put("/profile/:id/add-education", studentAuthMiddleware(studentAuthService), studentController.addEducation);
studentRoutes.put("/profile/:id/edit-education/:educationId", studentAuthMiddleware(studentAuthService), studentController.editEducation);
studentRoutes.delete("/profile/:id/delete-education/:educationId", studentAuthMiddleware(studentAuthService), studentController.deleteEducation);

studentRoutes.get('/getcategories', courseController.getAllCategories);

studentRoutes.get('/allcourses', courseController.fetchAllCourses);
studentRoutes.get('/course/:courseId', courseController.fetchCourseDetails);

export default studentRoutes;