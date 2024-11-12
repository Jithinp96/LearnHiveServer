import { Router } from "express";
import { MessageController } from "../controllers/MessageController";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { TutorRepository } from "../../infrastructure/repositories/TutorRepository";

import AuthMiddleware from "../../infrastructure/middlewares/AuthMiddleware";
import { AuthService } from "../../application/services/AuthService";

const messageRoute = Router();

const studentRepo = new StudentRepository();
const tutorRepo = new TutorRepository()
const authService = new AuthService(studentRepo, tutorRepo)

const messageController = new MessageController()

messageRoute.post("/:receiverRole/:receiverId", AuthMiddleware(authService), messageController.sendMessage)
// messageRoute.get("/:receiverRole/:receiverId", AuthMiddleware(authService), messageController.getUserConversations)
messageRoute.get("/:receiverRole/:receiverId/:conversationId", AuthMiddleware(authService), messageController.getMessages)
messageRoute.get("/", AuthMiddleware(authService), messageController.getAllConversations)

export default messageRoute