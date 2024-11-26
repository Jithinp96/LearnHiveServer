import { NextFunction, Request, Response } from "express";

import { JWTService } from "../../shared/utils/JWTService";
import { HttpStatusEnum } from "../../shared/enums/HttpStatusEnum";

import { AdminLogin } from "../../application/useCases/admin/AdminLogin";
import { GetStudentsList } from "../../application/useCases/admin/GetStudentsList";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";

import { CourseCategoryRepository } from "../../infrastructure/repositories/CourseCategoryRepository";
import { CourseCategoryUseCases } from "../../application/useCases/admin/CourseCategory";
import { TutorRepository } from "../../infrastructure/repositories/TutorRepository";
import { LogoutAdminUseCase } from "../../application/useCases/admin/LogoutAdminUseCase";
import { GetAdminDashboardStatsUseCase } from "../../application/useCases/admin/GetAdminDashboardUseCase";
import { AdminDashboardRepository } from "../../infrastructure/repositories/AdminDashboardRepository";
import { SuccessMessageEnum } from "../../shared/enums/SuccessMessageEnum";


const studentRepository = new StudentRepository();
const tutorRepository = new TutorRepository();
const adminDashboardRepository = new AdminDashboardRepository()
const courseCategoryRepository = new CourseCategoryRepository();

const getAllStudents = new GetStudentsList(studentRepository);
const courseCategoryUseCases = new CourseCategoryUseCases(courseCategoryRepository);
const getAdminDashboardUseCase = new GetAdminDashboardStatsUseCase(adminDashboardRepository)
export class AdminController {
    private _adminLogin: AdminLogin;

    constructor(adminLogin: AdminLogin) {
        this._adminLogin = adminLogin;
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        console.log("Inside admin login controller");
        
        const { email, password } = req.body;

        try {
            const { accessToken, refreshToken } = await this._adminLogin.execute(email, password);
            
            JWTService.setTokens(res, accessToken, refreshToken);
            res.status(HttpStatusEnum.OK).json({ success: true, message: 'Login Successful', accessToken })
        } catch (error) {
            console.error("Error during admin login:", error);
            res.status(HttpStatusEnum.UNAUTHORIZED).json({ success: false, error })
        }
    }

    public logout = async(req: Request, res: Response, next: NextFunction) => {
        try {
            await LogoutAdminUseCase.execute(res);
            res.status(HttpStatusEnum.OK).json({
                success: true,
                message: SuccessMessageEnum.LOGOUT_SUCCESS
            });
        } catch (error) {
            next(error);
        }
      }

    public getAdminDashboard = async(req: Request, res: Response) => {
        try {
            const stats = await getAdminDashboardUseCase.execute();
            res.json(stats);
          } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
          }
    }
    public async getAllStudents(req: Request, res: Response): Promise<void> {
        console.log("Inside admin controller get all students");
        
        try {
            const students = await getAllStudents.execute();
            res.status(HttpStatusEnum.OK).json(students);
        } catch (error) {
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch students list' });
        }
    }

    public getStudentById = async (req: Request, res: Response) => {
        console.log("Reached getStudentByID in admin controller");
        
        const {id} = req.params;
        try {
            const student = await studentRepository.findStudentById(id);
            
            if(!student) {
                return res.status(HttpStatusEnum.NOT_FOUND).json({message: "Student details not found"});
            }
            res.json(student);
        } catch (error) {
            console.error(error);
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: "Server error" })
        }
    }

    public getAllTutors = async (req: Request, res: Response) => {
        try {
            const tutors = await tutorRepository.getAllTutors();
            res.status(HttpStatusEnum.OK).json(tutors);
        } catch (error) {
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch tutors list' });
        }
    }

    public getTutorById = async (req: Request, res: Response) => {
        const {id} = req.params;
        try {
            const tutor = await tutorRepository.findTutorById(id);

            if(!tutor) {
                return res.status(HttpStatusEnum.NOT_FOUND).json({message: "Tutor details not found"});
            }
            res.json(tutor)
        } catch (error) {
            console.error(error);
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: "Server error" })
        }
    }

    public blockStudent = async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        const {isBlocked} = req.body;

        try {
            const student = await studentRepository.findStudentById(id);
            
            if (!student) {
                res.status(HttpStatusEnum.NOT_FOUND).json({ message: "Student not found" });
                return;
            }

            student.isBlocked = isBlocked;
            await studentRepository.updateStudent(student);
            res.status(HttpStatusEnum.OK).json({ message: `Student ${isBlocked ? 'blocked' : 'unblocked'}`, data: student });
        } catch (error) {
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update student status' });
        }
    }

    public blockTutor = async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        const {isBlocked} = req.body;

        try {
            const tutor = await tutorRepository.findTutorById(id);

            if (!tutor) {
                res.status(HttpStatusEnum.NOT_FOUND).json({ message: "Tutor not found" });
                return;
            }

            tutor.isBlocked = isBlocked;
            await tutorRepository.updateTutor(tutor);
            res.status(HttpStatusEnum.OK).json({ message: `Tutor ${isBlocked ? 'blocked' : 'unblocked'}`, data: tutor })

        } catch (error) {
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update tutor status' });
        }
    }

    // Create a course category
    public createCategory = async (req: Request, res: Response): Promise<void> => {
        const { name } = req.body;
        console.log("Reached createCategory controller");
        console.log("Category Name: ", name);
        

        try {
            const newCategory = await courseCategoryUseCases.createCategory({ name });
            console.log("newCategory in admin controller: ", newCategory);
            
            res.status(HttpStatusEnum.CREATED).json(newCategory);
        } catch (error) {
            console.log("Inside admin controller new category catch");
            console.error("Error in createCategory controller:", error); 
            res.status(HttpStatusEnum.BAD_REQUEST).json({ error: 'Failed to create category' });
        }
    };

    public updateCategory = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { name, isBlocked } = req.body;
    
        try {
            const updatedCategory = await courseCategoryUseCases.updateCategory(id, name);
            res.status(HttpStatusEnum.OK).json(updatedCategory);
        } catch (error) {
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update category' });
        }
    };

    // Get all course categories
    public getAllCategories = async (req: Request, res: Response): Promise<void> => {
        try {
            const categories = await courseCategoryUseCases.getAllCategories();
            res.status(HttpStatusEnum.OK).json(categories);
        } catch (error) {
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch categories' });
        }
    };

    public toggleCategoryStatus = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
    
        try {
            const updatedCategory = await courseCategoryUseCases.toggleCategoryStatus(id);
            const status = updatedCategory?.isBlocked ? 'blocked' : 'unblocked';
            res.status(HttpStatusEnum.OK).json({ message: `Category ${status} successfully` });
        } catch (error) {
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to toggle category status' });
        }
    };
}