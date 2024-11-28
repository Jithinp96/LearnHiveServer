"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleware_1 = __importDefault(require("../../infrastructure/middlewares/AuthMiddleware"));
const AuthService_1 = require("../../application/services/AuthService");
const VideoCallController_1 = require("../controllers/VideoCallController");
const StudentRepository_1 = require("../../infrastructure/repositories/StudentRepository");
const TutorRepository_1 = require("../../infrastructure/repositories/TutorRepository");
const videoCallRoute = (0, express_1.Router)();
const videoCallController = new VideoCallController_1.VideoCallController();
const studentRepo = new StudentRepository_1.StudentRepository();
const tutorRepo = new TutorRepository_1.TutorRepository();
const authService = new AuthService_1.AuthService(studentRepo, tutorRepo);
videoCallRoute.post('/validate', (0, AuthMiddleware_1.default)(authService), videoCallController.validateVideoCallAccess);
exports.default = videoCallRoute;
