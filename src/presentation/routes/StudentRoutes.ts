import { Router } from "express";
import { StudentController } from "../controllers/StudentController";
import studentAuthMiddleware from "../../infrastructure/middlewares/StudentAuthMiddleware";

const studentController = new StudentController();

const studentRoutes = Router();

studentRoutes.post("/auth", studentController.register);
studentRoutes.post("/resend-otp", studentController.resendOTP);
studentRoutes.post("/otp-verify", studentController.verifyOTP);
studentRoutes.post('/forgot-password', studentController.forgotPassword);
studentRoutes.post('/reset-password', studentController.resetPassword);

studentRoutes.post('/login', studentController.login);
studentRoutes.post('/logout/:role', studentController.logout);
// studentRoutes.get('/dashboard', studentAuthMiddleware, (req, res) => studentController.getDashboard(req, res));
    
export default studentRoutes;