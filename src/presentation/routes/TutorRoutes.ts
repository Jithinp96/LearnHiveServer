import { Router } from "express";
import { TutorController } from "../controllers/TutorController";

const tutorRoutes = Router();
const tutorController = new TutorController();

tutorRoutes.post("/auth", tutorController.register);
tutorRoutes.post("/resend-otp", tutorController.resendOTP);
tutorRoutes.post("/otp-verify", tutorController.verifyOTP);

tutorRoutes.post('/forgot-password', tutorController.forgotPassword);
tutorRoutes.post('/reset-password', tutorController.resetPassword);

tutorRoutes.post('/login', tutorController.login);
tutorRoutes.post('/logout/:role', tutorController.logout);

export default tutorRoutes;