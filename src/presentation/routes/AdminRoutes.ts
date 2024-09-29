import express from "express";

import { AdminController } from "../controllers/adminController";
import { AdminLogin } from "../../application/useCases/admin/AdminLogin";
import { RefreshTokenController } from "../controllers/RefreshTokenController";
import { JWTService } from "../../shared/utils/JWTService";

const adminRoutes = express.Router();

const jwtService = new JWTService();

const adminLogin = new AdminLogin(jwtService);
const refreshTokenController = new RefreshTokenController();

const adminController = new AdminController(adminLogin);

adminRoutes.post('/login', (req, res) => adminController.login(req, res));
adminRoutes.post('/refresh', (req, res) => refreshTokenController.refresh(req, res));
adminRoutes.post('/logout/:role', adminController.logout);

adminRoutes.get('/students', (req, res) => adminController.getAllStudents(req, res));
adminRoutes.get('/student/:id', (req, res) => adminController.getStudentById(req, res));
adminRoutes.patch('/student/:id/block', (req, res) => adminController.blockStudent(req, res));

adminRoutes.get('/tutors', (req, res) => adminController.getAllTutors(req, res));
adminRoutes.get('/tutor/:id', (req, res) => adminController.getTutorById(req, res));
adminRoutes.patch('/tutor/:id/block', (req, res) => adminController.blockTutor(req, res));

adminRoutes.post("/course-category/add", adminController.createCategory);
adminRoutes.get("/course-category", adminController.getAllCategories);
adminRoutes.patch("/course-category/toggle-status/:id", adminController.toggleCategoryStatus);
adminRoutes.put('/course-category/edit/:id', adminController.updateCategory);

export default adminRoutes;