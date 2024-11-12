import { Router } from "express";

import AuthMiddleware from "../../infrastructure/middlewares/AuthMiddleware";
import { AuthService } from "../../application/services/AuthService";

import { TutorRepository } from "../../infrastructure/repositories/TutorRepository";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";

import { TutorController } from "../controllers/TutorController";
import { CourseController } from "../controllers/CourseController";
import { upload } from "../../infrastructure/config/multerConfig"

const tutorRoutes = Router();

const studentRepo = new StudentRepository();
const tutorRepo = new TutorRepository()
const authService = new AuthService(studentRepo, tutorRepo)

const tutorController = new TutorController();
const courseController = new CourseController();

tutorRoutes.post("/auth", tutorController.register);
tutorRoutes.post("/resend-otp", tutorController.resendOTP);
tutorRoutes.post("/otp-verify", tutorController.verifyOTP);

tutorRoutes.post('/forgot-password', tutorController.forgotPassword);
tutorRoutes.post('/reset-password', tutorController.resetPassword);

tutorRoutes.post('/login', tutorController.login);
tutorRoutes.post('/logout/:role', AuthMiddleware(authService), tutorController.logout);

tutorRoutes.get('/profile/:id', AuthMiddleware(authService), tutorController.getProfile);
tutorRoutes.get('/tutorprofile/:id', tutorController.getProfile);
tutorRoutes.put("/profile/:id/add-education", AuthMiddleware(authService), tutorController.addEducation);
tutorRoutes.put("/profile/:id/edit-education/:educationId", AuthMiddleware(authService), tutorController.editEducation);
tutorRoutes.delete("/profile/:id/delete-education/:educationId", AuthMiddleware(authService), tutorController.deleteEducation);

tutorRoutes.put('/profile/edit-name', tutorController.editProfileName)
tutorRoutes.put('/profile/edit-mobile', tutorController.editMobileNumber)
tutorRoutes.put('/profile/edit-profilePic/:id', upload.single('image'), tutorController.editProfilePicture)

tutorRoutes.put('/profile/add-subject', AuthMiddleware(authService), tutorController.addSubject)
tutorRoutes.put('/profile/edit-subject', AuthMiddleware(authService), tutorController.editSubject)
tutorRoutes.put('/profile/delete-subject', AuthMiddleware(authService), tutorController.deleteSubject)

tutorRoutes.post('/:id/add-course', AuthMiddleware(authService), courseController.addCourse)
tutorRoutes.get(`/edit-course/:courseId`, AuthMiddleware(authService), courseController.fetchCourseDetails)
tutorRoutes.put(`/edit-course/:courseId`, AuthMiddleware(authService), courseController.editCourse)
tutorRoutes.post('/upload-video', AuthMiddleware(authService), upload.single('video'), courseController.uploadVideoController)
tutorRoutes.post('/upload-thumbnail', AuthMiddleware(authService), upload.single('image'), courseController.uploadThumbnail)
tutorRoutes.get('/getcategories', AuthMiddleware(authService), courseController.getAllCategories);
tutorRoutes.get('/course-list', AuthMiddleware(authService), courseController.fetchTutorCourses);

tutorRoutes.get('/getSubjects', AuthMiddleware(authService), tutorController.fetchSubjects);
tutorRoutes.post('/addslot', AuthMiddleware(authService), tutorController.addSlot)
tutorRoutes.put('/editslot', AuthMiddleware(authService), tutorController.editSlot)
tutorRoutes.get('/slot/:slotId', AuthMiddleware(authService), tutorController.getSlotById)
tutorRoutes.get('/appointment', AuthMiddleware(authService), tutorController.getAllSlotsByTutorId)
tutorRoutes.post('/generate-slots', AuthMiddleware(authService), tutorController.multipleSlotGeneration);
tutorRoutes.post('/generate-slots-preference', AuthMiddleware(authService), tutorController.saveSlotPreference)

export default tutorRoutes;