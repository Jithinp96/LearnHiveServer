import express from "express";

import { AdminController } from "../controllers/adminController";
import { AdminLogin } from "../../application/useCases/admin/AdminLogin";
import { JWTService } from "../../shared/utils/JWTService";
import { CourseController } from "../controllers/CourseController";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { TutorRepository } from "../../infrastructure/repositories/TutorRepository";
import { AuthService } from "../../application/services/AuthService";
import AuthMiddleware from "../../infrastructure/middlewares/AuthMiddleware";

const adminRoutes = express.Router();

const jwtService = new JWTService();
const adminLogin = new AdminLogin(jwtService);
const adminController = new AdminController(adminLogin);
const courseController = new CourseController()
// const adminAuthService = new AdminAuthService();

const studentRepo = new StudentRepository();
const tutorRepo = new TutorRepository()
const authService = new AuthService(studentRepo, tutorRepo)

adminRoutes.post('/login', (req, res) => adminController.login(req, res));
adminRoutes.post('/logout/:role', adminController.logout);

adminRoutes.get('/students', AuthMiddleware(authService), (req, res) => adminController.getAllStudents(req, res));
adminRoutes.get('/student/:id', AuthMiddleware(authService), (req, res) => adminController.getStudentById(req, res));
adminRoutes.patch('/student/:id/block', AuthMiddleware(authService), (req, res) => adminController.blockStudent(req, res));

adminRoutes.get('/tutors', AuthMiddleware(authService), (req, res) => adminController.getAllTutors(req, res));
adminRoutes.get('/tutor/:id', AuthMiddleware(authService), (req, res) => adminController.getTutorById(req, res));
adminRoutes.patch('/tutor/:id/block', AuthMiddleware(authService), (req, res) => adminController.blockTutor(req, res));

adminRoutes.post("/course-category/add", AuthMiddleware(authService), adminController.createCategory);
adminRoutes.get("/course-category", AuthMiddleware(authService), adminController.getAllCategories);
adminRoutes.patch("/course-category/toggle-status/:id", AuthMiddleware(authService), adminController.toggleCategoryStatus);
adminRoutes.put('/course-category/edit/:id', AuthMiddleware(authService), adminController.updateCategory);

adminRoutes.get('/courses', AuthMiddleware(authService), courseController.fetchAllCoursesforAdmin);
adminRoutes.get("/course/:courseId", AuthMiddleware(authService), courseController.fetchCourseDetails)
adminRoutes.put("/course/:courseId/approval", AuthMiddleware(authService), courseController.approveCourse)
adminRoutes.put("/course/:courseId/toggle-status", AuthMiddleware(authService), courseController.toggleCourseStatus)

export default adminRoutes;