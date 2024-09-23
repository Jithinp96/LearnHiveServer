import { Router } from "express";
import { StudentController } from "../controllers/StudentController";

const studentController = new StudentController();

const studentRoutes = Router();

studentRoutes.use((req, res, next) => {
    console.log(req.url, req.cookies);
    next()
    
})

studentRoutes.post("/auth", studentController.register);
studentRoutes.post("/otp-verify", studentController.verifyOTP);

studentRoutes.post('/login', studentController.login);

// studentRoutes.get('/dashboard', authenticateToken, (req, res) => {
//     res.send('Welcome to your student dashboard!');
// });

export default studentRoutes;