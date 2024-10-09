import { Router } from "express";

import { StudentController } from "../controllers/StudentController";
import studentAuthMiddleware from "../../infrastructure/middlewares/StudentAuthMiddleware";
import { StudentAuthService } from "../../application/services/StudentAuthService";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";

const studentController = new StudentController();
const studentRepositoryInstance = new StudentRepository();
const studentAuthService = new StudentAuthService(studentRepositoryInstance)

const studentRoutes = Router();

studentRoutes.post("/auth", studentController.register);
studentRoutes.post("/resend-otp", studentController.resendOTP);
studentRoutes.post("/otp-verify", studentController.verifyOTP);
studentRoutes.post('/forgot-password', studentController.forgotPassword);
studentRoutes.post('/reset-password', studentController.resetPassword);

studentRoutes.post('/login', studentController.login);
studentRoutes.post('/logout/:role', studentAuthMiddleware(studentAuthService), studentController.logout);

studentRoutes.get('/profile/:id', studentController.getProfile);
studentRoutes.put("/profile/:id/update-education", studentController.updateEducation);

export default studentRoutes;