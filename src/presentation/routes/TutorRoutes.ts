import { Router } from "express";
import { TutorController } from "../controllers/TutorController";

const tutorRoutes = Router();
const tutorController = new TutorController();

tutorRoutes.post("/auth", tutorController.register);
tutorRoutes.post("/otp-verify", tutorController.verifyOTP);

export default tutorRoutes;