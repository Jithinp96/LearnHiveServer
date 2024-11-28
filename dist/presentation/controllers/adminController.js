"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const JWTService_1 = require("../../shared/utils/JWTService");
const HttpStatusEnum_1 = require("../../shared/enums/HttpStatusEnum");
const GetStudentsList_1 = require("../../application/useCases/admin/GetStudentsList");
const StudentRepository_1 = require("../../infrastructure/repositories/StudentRepository");
const CourseCategoryRepository_1 = require("../../infrastructure/repositories/CourseCategoryRepository");
const CourseCategory_1 = require("../../application/useCases/admin/CourseCategory");
const TutorRepository_1 = require("../../infrastructure/repositories/TutorRepository");
const LogoutAdminUseCase_1 = require("../../application/useCases/admin/LogoutAdminUseCase");
const GetAdminDashboardUseCase_1 = require("../../application/useCases/admin/GetAdminDashboardUseCase");
const AdminDashboardRepository_1 = require("../../infrastructure/repositories/AdminDashboardRepository");
const SuccessMessageEnum_1 = require("../../shared/enums/SuccessMessageEnum");
const studentRepository = new StudentRepository_1.StudentRepository();
const tutorRepository = new TutorRepository_1.TutorRepository();
const adminDashboardRepository = new AdminDashboardRepository_1.AdminDashboardRepository();
const courseCategoryRepository = new CourseCategoryRepository_1.CourseCategoryRepository();
const getAllStudents = new GetStudentsList_1.GetStudentsList(studentRepository);
const courseCategoryUseCases = new CourseCategory_1.CourseCategoryUseCases(courseCategoryRepository);
const getAdminDashboardUseCase = new GetAdminDashboardUseCase_1.GetAdminDashboardStatsUseCase(adminDashboardRepository);
class AdminController {
    constructor(adminLogin) {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("Inside admin login controller");
            const { email, password } = req.body;
            try {
                const { accessToken, refreshToken } = yield this._adminLogin.execute(email, password);
                JWTService_1.JWTService.setTokens(res, accessToken, refreshToken);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({ success: true, message: 'Login Successful', accessToken });
            }
            catch (error) {
                console.error("Error during admin login:", error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ success: false, error });
            }
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield LogoutAdminUseCase_1.LogoutAdminUseCase.execute(res);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    success: true,
                    message: SuccessMessageEnum_1.SuccessMessageEnum.LOGOUT_SUCCESS
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.getAdminDashboard = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield getAdminDashboardUseCase.execute();
                res.json(stats);
            }
            catch (error) {
                console.error('Error fetching dashboard stats:', error);
                res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
            }
        });
        this.getStudentById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("Reached getStudentByID in admin controller");
            const { id } = req.params;
            try {
                const student = yield studentRepository.findStudentById(id);
                if (!student) {
                    return res.status(HttpStatusEnum_1.HttpStatusEnum.NOT_FOUND).json({ message: "Student details not found" });
                }
                res.json(student);
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
            }
        });
        this.getAllTutors = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tutors = yield tutorRepository.getAllTutors();
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(tutors);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch tutors list' });
            }
        });
        this.getTutorById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const tutor = yield tutorRepository.findTutorById(id);
                if (!tutor) {
                    return res.status(HttpStatusEnum_1.HttpStatusEnum.NOT_FOUND).json({ message: "Tutor details not found" });
                }
                res.json(tutor);
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
            }
        });
        this.blockStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { isBlocked } = req.body;
            try {
                const student = yield studentRepository.findStudentById(id);
                if (!student) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.NOT_FOUND).json({ message: "Student not found" });
                    return;
                }
                student.isBlocked = isBlocked;
                yield studentRepository.updateStudent(student);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({ message: `Student ${isBlocked ? 'blocked' : 'unblocked'}`, data: student });
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update student status' });
            }
        });
        this.blockTutor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { isBlocked } = req.body;
            try {
                const tutor = yield tutorRepository.findTutorById(id);
                if (!tutor) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.NOT_FOUND).json({ message: "Tutor not found" });
                    return;
                }
                tutor.isBlocked = isBlocked;
                yield tutorRepository.updateTutor(tutor);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({ message: `Tutor ${isBlocked ? 'blocked' : 'unblocked'}`, data: tutor });
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update tutor status' });
            }
        });
        // Create a course category
        this.createCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            console.log("Reached createCategory controller");
            console.log("Category Name: ", name);
            try {
                const newCategory = yield courseCategoryUseCases.createCategory({ name });
                console.log("newCategory in admin controller: ", newCategory);
                res.status(HttpStatusEnum_1.HttpStatusEnum.CREATED).json(newCategory);
            }
            catch (error) {
                console.log("Inside admin controller new category catch");
                console.error("Error in createCategory controller:", error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({ error: 'Failed to create category' });
            }
        });
        this.updateCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, isBlocked } = req.body;
            try {
                const updatedCategory = yield courseCategoryUseCases.updateCategory(id, name);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(updatedCategory);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update category' });
            }
        });
        // Get all course categories
        this.getAllCategories = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield courseCategoryUseCases.getAllCategories();
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(categories);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch categories' });
            }
        });
        this.toggleCategoryStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const updatedCategory = yield courseCategoryUseCases.toggleCategoryStatus(id);
                const status = (updatedCategory === null || updatedCategory === void 0 ? void 0 : updatedCategory.isBlocked) ? 'blocked' : 'unblocked';
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({ message: `Category ${status} successfully` });
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to toggle category status' });
            }
        });
        this._adminLogin = adminLogin;
    }
    getAllStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Inside admin controller get all students");
            try {
                const students = yield getAllStudents.execute();
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(students);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch students list' });
            }
        });
    }
}
exports.AdminController = AdminController;
