import { Request, Response } from "express";

import { AdminLogin } from "../../application/useCases/adminUseCases/AdminLogin";
import { JWTService } from "../../infrastructure/services/JWTService";
import { GetStudentsList } from "../../application/useCases/adminUseCases/GetStudentsList";
import { MongoStudentRepository } from "../../infrastructure/repositories/MongoStudentRepository";

const studentRepository = new MongoStudentRepository();
const getAllStudents = new GetStudentsList(studentRepository);

export class AdminController {
    private adminLogin: AdminLogin;

    constructor(adminLogin: AdminLogin) {
        this.adminLogin = adminLogin;
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        try {
            const { accessToken, refreshToken } = await this.adminLogin.execute(email, password);
            console.log("accessToken in admin controller: ", accessToken);
            console.log("refreshToken in admin controller: ", refreshToken);
            
            JWTService.setTokens(res, accessToken, refreshToken);
            res.status(200).json({ success: true, message: 'Login Successful', accessToken })
        } catch (error) {
            console.error("Error during admin login:", error);
            res.status(401).json({ success: false, error })
        }
    }

    public async getAllStudents(req: Request, res: Response): Promise<void> {
        try {
            const students = await getAllStudents.execute();
            res.status(200).json(students);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch students list' });
        }
    }

    public getStudentById = async (req: Request, res: Response) => {
        const {id} = req.params;
        try {
            const student = await studentRepository.findStudentById(id);
            
            if(!student) {
                return res.status(404).json({message: "Student details not found"});
            }
            res.json(student);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" })
        }
    }

    public blockStudent = async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        const {isBlocked} = req.body;

        try {
            const student = await studentRepository.findStudentById(id);
            // console.log(student);
            
            if (!student) {
                res.status(404).json({ message: "Student not found" });
                return;
            }

            student.isBlocked = isBlocked;
            await studentRepository.updateStudent(student);
            res.status(200).json({ message: `Student ${isBlocked ? 'blocked' : 'unblocked'}`, data: student });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update student status' });
        }
    }
}