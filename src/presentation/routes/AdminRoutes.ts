import express from "express";

import { AdminController } from "../controllers/adminController";
import { AdminLogin } from "../../application/useCases/admin/AdminLogin";
import { JWTService } from "../../shared/utils/JWTService";
import { AdminAuthService } from "../../application/services/AdminAuthService";
import adminAuthMiddleware from "../../infrastructure/middlewares/AdminAuthMiddleware";
import { CourseController } from "../controllers/CourseController";

const adminRoutes = express.Router();

const jwtService = new JWTService();
const adminLogin = new AdminLogin(jwtService);
const adminController = new AdminController(adminLogin);
const courseController = new CourseController()
const adminAuthService = new AdminAuthService();

adminRoutes.post('/login', (req, res) => adminController.login(req, res));
adminRoutes.post('/logout/:role', adminController.logout);

adminRoutes.get('/students', adminAuthMiddleware(adminAuthService), (req, res) => adminController.getAllStudents(req, res));
adminRoutes.get('/student/:id', adminAuthMiddleware(adminAuthService), (req, res) => adminController.getStudentById(req, res));
adminRoutes.patch('/student/:id/block', adminAuthMiddleware(adminAuthService), (req, res) => adminController.blockStudent(req, res));

adminRoutes.get('/tutors', (req, res) => adminController.getAllTutors(req, res));
adminRoutes.get('/tutor/:id', (req, res) => adminController.getTutorById(req, res));
adminRoutes.patch('/tutor/:id/block', (req, res) => adminController.blockTutor(req, res));

adminRoutes.post("/course-category/add", adminController.createCategory);
adminRoutes.get("/course-category", adminController.getAllCategories);
adminRoutes.patch("/course-category/toggle-status/:id", adminController.toggleCategoryStatus);
adminRoutes.put('/course-category/edit/:id', adminController.updateCategory);

adminRoutes.get('/courses', courseController.fetchAllCourses);

export default adminRoutes;