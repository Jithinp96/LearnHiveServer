"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MessageController_1 = require("../controllers/MessageController");
const StudentRepository_1 = require("../../infrastructure/repositories/StudentRepository");
const TutorRepository_1 = require("../../infrastructure/repositories/TutorRepository");
const AuthMiddleware_1 = __importDefault(require("../../infrastructure/middlewares/AuthMiddleware"));
const AuthService_1 = require("../../application/services/AuthService");
const messageRoute = (0, express_1.Router)();
const studentRepo = new StudentRepository_1.StudentRepository();
const tutorRepo = new TutorRepository_1.TutorRepository();
const authService = new AuthService_1.AuthService(studentRepo, tutorRepo);
const messageController = new MessageController_1.MessageController();
messageRoute.post("/send", (0, AuthMiddleware_1.default)(authService), messageController.sendMessage);
// messageRoute.get("/:receiverRole/:receiverId", AuthMiddleware(authService), messageController.getUserConversations)
// messageRoute.get("/:receiverRole/:receiverId/:conversationId", AuthMiddleware(authService), messageController.getMessages)
messageRoute.get("/messages", (0, AuthMiddleware_1.default)(authService), messageController.getUserMessages);
// messageRoute.get("/", AuthMiddleware(authService), messageController.getAllConversations)
messageRoute.get("/", (0, AuthMiddleware_1.default)(authService), messageController.getUserConversations);
exports.default = messageRoute;
