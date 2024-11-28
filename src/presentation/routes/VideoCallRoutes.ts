import { Router } from "express";

import AuthMiddleware from "../../infrastructure/middlewares/AuthMiddleware";
import { AuthService } from "../../application/services/AuthService";
import { VideoCallController } from "../controllers/VideoCallController";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { TutorRepository } from "../../infrastructure/repositories/TutorRepository";

const videoCallRoute = Router();

const videoCallController = new VideoCallController();
const studentRepo = new StudentRepository();
const tutorRepo = new TutorRepository()
const authService = new AuthService(studentRepo, tutorRepo)

videoCallRoute.post('/validate', AuthMiddleware(authService), videoCallController.validateVideoCallAccess)

export default videoCallRoute