import { Router } from "express";

import { TutorController } from "../controllers/TutorController";
import { TutorRepository } from "../../infrastructure/repositories/TutorRepository";
import { TutorAuthService } from "../../application/services/TutorAuthService";
import tutorAuthMiddleware from "../../infrastructure/middlewares/TutorAuthMiddleware";
import { CourseController } from "../controllers/CourseController";
import { upload } from "../../infrastructure/config/multerConfig"

const tutorRoutes = Router();
const tutorController = new TutorController();
const courseController = new CourseController();
const tutorRepositoryInstance = new TutorRepository();
const tutorAuthService = new TutorAuthService(tutorRepositoryInstance)

tutorRoutes.post("/auth", tutorController.register);
tutorRoutes.post("/resend-otp", tutorController.resendOTP);
tutorRoutes.post("/otp-verify", tutorController.verifyOTP);

tutorRoutes.post('/forgot-password', tutorController.forgotPassword);
tutorRoutes.post('/reset-password', tutorController.resetPassword);

tutorRoutes.post('/login', tutorController.login);
tutorRoutes.post('/logout/:role', tutorAuthMiddleware(tutorAuthService), tutorController.logout);

tutorRoutes.get('/profile/:id', tutorAuthMiddleware(tutorAuthService), tutorController.getProfile);
tutorRoutes.get('/tutorprofile/:id', tutorController.getProfile);
tutorRoutes.put("/profile/:id/add-education", tutorAuthMiddleware(tutorAuthService), tutorController.addEducation);
tutorRoutes.put("/profile/:id/edit-education/:educationId", tutorAuthMiddleware(tutorAuthService), tutorController.editEducation);
tutorRoutes.delete("/profile/:id/delete-education/:educationId", tutorAuthMiddleware(tutorAuthService), tutorController.deleteEducation);

tutorRoutes.put('/profile/edit-name', tutorController.editProfileName)
tutorRoutes.put('/profile/edit-mobile', tutorController.editMobileNumber)
tutorRoutes.put('/profile/edit-profilePic/:id', upload.single('image'), tutorController.editProfilePicture)

tutorRoutes.put('/profile/add-subject', tutorAuthMiddleware(tutorAuthService), tutorController.addSubject)
tutorRoutes.put('/profile/edit-subject', tutorAuthMiddleware(tutorAuthService), tutorController.editSubject)
tutorRoutes.put('/profile/delete-subject', tutorAuthMiddleware(tutorAuthService), tutorController.deleteSubject)

tutorRoutes.post('/:id/add-course', tutorAuthMiddleware(tutorAuthService), courseController.addCourse)
tutorRoutes.get(`/edit-course/:courseId`, tutorAuthMiddleware(tutorAuthService), courseController.fetchCourseDetails)
tutorRoutes.put(`/edit-course/:courseId`, tutorAuthMiddleware(tutorAuthService), courseController.editCourse)
tutorRoutes.post('/upload-video', tutorAuthMiddleware(tutorAuthService), upload.single('video'), courseController.uploadVideoController)
tutorRoutes.post('/upload-thumbnail', tutorAuthMiddleware(tutorAuthService), upload.single('image'), courseController.uploadThumbnail)
tutorRoutes.get('/getcategories', tutorAuthMiddleware(tutorAuthService), courseController.getAllCategories);
tutorRoutes.get('/course-list', tutorAuthMiddleware(tutorAuthService), courseController.fetchTutorCourses);

tutorRoutes.get('/getSubjects', tutorAuthMiddleware(tutorAuthService), tutorController.fetchSubjects);
tutorRoutes.post('/addslot', tutorAuthMiddleware(tutorAuthService), tutorController.addSlot)
tutorRoutes.put('/editslot', tutorAuthMiddleware(tutorAuthService), tutorController.editSlot)
tutorRoutes.get('/slot/:slotId', tutorAuthMiddleware(tutorAuthService), tutorController.getSlotById)
tutorRoutes.get('/appointment', tutorAuthMiddleware(tutorAuthService), tutorController.getAllSlotsByTutorId)
tutorRoutes.post('/generate-slots', tutorAuthMiddleware(tutorAuthService), tutorController.multipleSlotGeneration);
tutorRoutes.post('/generate-slots-preference', tutorAuthMiddleware(tutorAuthService), tutorController.saveSlotPreference)

export default tutorRoutes;