import express from "express";

import { AdminController } from "../controllers/adminController";
import { AdminLogin } from "../../application/useCases/adminUseCases/AdminLogin";
import { RefreshTokenController } from "../controllers/RefreshTokenController";
import { JWTService } from "../../infrastructure/services/JWTService";

const adminRoutes = express.Router();

const jwtService = new JWTService();

const adminLogin = new AdminLogin(jwtService);
const refreshTokenController = new RefreshTokenController();

const adminController = new AdminController(adminLogin);

adminRoutes.post('/login', (req, res) => adminController.login(req, res));
adminRoutes.post('/refresh', (req, res) => refreshTokenController.refresh(req, res));
adminRoutes.post('/logout', (req, res) => {
    JWTService.clearTokens(res);
    res.status(200).json({ message: 'Logged out successfully' });
});

adminRoutes.get('/students', (req, res) => adminController.getAllStudents(req, res));
adminRoutes.get('/student/:id', (req, res) => adminController.getStudentById(req, res));
adminRoutes.patch('/student/:id/block', (req, res) => adminController.blockStudent(req, res));

export default adminRoutes;