import { Router } from "express";
import { StudentController } from "../controllers/StudentController";
import { authenticateToken } from "../../infrastructure/middlewares/AuthMiddleware";

const studentController = new StudentController();

const studentRoutes = Router();

studentRoutes.post("/auth", studentController.register);
studentRoutes.post("/otp-verify", studentController.verifyOTP);

studentRoutes.post('/login', studentController.login);

studentRoutes.get('/dashboard', authenticateToken, (req, res) => {
    res.send('Welcome to your student dashboard!');
});

export default studentRoutes;