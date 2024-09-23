import { Router } from "express";
import { StudentController } from "../controllers/StudentController";

const studentController = new StudentController();

const studentRoutes = Router();

studentRoutes.post("/auth", studentController.register);
studentRoutes.post("/resend-otp", studentController.resendOTP);
studentRoutes.post("/otp-verify", studentController.verifyOTP);

studentRoutes.post('/login', studentController.login);
studentRoutes.post('/logout/:role', studentController.logout);

export default studentRoutes;