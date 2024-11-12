import { Router } from "express";
import { AssessmentController } from '../controllers/AssessmentController';

import AuthMiddleware from "../../infrastructure/middlewares/AuthMiddleware";
import { AuthService } from "../../application/services/AuthService";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { TutorRepository } from "../../infrastructure/repositories/TutorRepository";

const assessmentRoute = Router();

const studentRepo = new StudentRepository();
const tutorRepo = new TutorRepository()
const authService = new AuthService(studentRepo, tutorRepo)
const assessmentController = new AssessmentController();

assessmentRoute.post('/create', AuthMiddleware(authService), assessmentController.createAssessment);
assessmentRoute.get('/', AuthMiddleware(authService), assessmentController.fetchAssessmentsByTutor);
assessmentRoute.get('/assessment-list', AuthMiddleware(authService), assessmentController.fetchAssessmentsForStudent);
assessmentRoute.get('/:assessmentId', AuthMiddleware(authService), assessmentController.fetchAssessmentById)
assessmentRoute.post('/:assessmentId/submit', AuthMiddleware(authService), assessmentController.submitAssessment)
assessmentRoute.get('/assessment-result/:assessmentId', AuthMiddleware(authService), assessmentController.fetchAssessmentResultById)
// assessmentRoute.post('/submit', AuthMiddleware(authService), assessmentController.submitAssessment);

export default assessmentRoute;