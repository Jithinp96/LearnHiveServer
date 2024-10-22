import { Router } from "express";
import express from 'express';

import { StudentController } from "../controllers/StudentController";
import studentAuthMiddleware from "../../infrastructure/middlewares/StudentAuthMiddleware";
import { StudentAuthService } from "../../application/services/StudentAuthService";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { CourseController } from "../controllers/CourseController";
import { upload } from "../../infrastructure/config/multerConfig"
import { CartController } from "../controllers/CartController";
import { PaymentController } from "../controllers/PaymentController";

const studentController = new StudentController();
const studentRepositoryInstance = new StudentRepository();
const courseController = new CourseController();
const cartController = new CartController()
const studentAuthService = new StudentAuthService(studentRepositoryInstance)
const paymentController = new PaymentController();

const studentRoutes = Router();

studentRoutes.post("/auth", studentController.register);
studentRoutes.post("/resend-otp", studentController.resendOTP);
studentRoutes.post("/otp-verify", studentController.verifyOTP);
studentRoutes.post('/forgot-password', studentController.forgotPassword); 
studentRoutes.post('/reset-password', studentController.resetPassword);

studentRoutes.post('/login', studentController.login);
studentRoutes.post('/logout/:role', studentAuthMiddleware(studentAuthService), studentController.logout);

studentRoutes.get('/dashboard', studentAuthMiddleware(studentAuthService), studentController.getDashboard)

studentRoutes.get('/profile/:id', studentAuthMiddleware(studentAuthService), studentController.getProfile);
studentRoutes.put("/profile/:id/add-education", studentAuthMiddleware(studentAuthService), studentController.addEducation);
studentRoutes.put("/profile/:id/edit-education/:educationId", studentAuthMiddleware(studentAuthService), studentController.editEducation);
studentRoutes.delete("/profile/:id/delete-education/:educationId", studentAuthMiddleware(studentAuthService), studentController.deleteEducation);

studentRoutes.put('/profile/edit-name', studentController.editProfileName)
studentRoutes.put('/profile/edit-mobile', studentController.editMobileNumber)
studentRoutes.put('/profile/edit-profilePic/:id', upload.single('image'), studentController.editProfilePicture)

studentRoutes.get('/tutorprofile/:tutorId', studentAuthMiddleware(studentAuthService), studentController.fetchTutorDetails)
studentRoutes.get('/slotbooking/:tutorId', studentAuthMiddleware(studentAuthService), studentController.fetchTutorSlotDetails)

studentRoutes.post('/slotbooking/create-payment-intent', studentAuthMiddleware(studentAuthService), paymentController.createPaymentIntent)
studentRoutes.post('/courseenroll/create-payment-intent', studentAuthMiddleware(studentAuthService), paymentController.createCoursePaymentIntent)
studentRoutes.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handlePaymentWebhook);

studentRoutes.get('/getcategories', courseController.getAllCategories);

studentRoutes.get('/allcourses', courseController.fetchAllCourses);
studentRoutes.get('/course/:courseId', courseController.fetchCourseDetails);

studentRoutes.post('/add-to-cart', studentAuthMiddleware(studentAuthService), cartController.addCourseToCart);
studentRoutes.get('/cart', studentAuthMiddleware(studentAuthService), cartController.fetchCart)
studentRoutes.delete('/cart/delete/:courseId', studentAuthMiddleware(studentAuthService), cartController.deleteFromCart)

studentRoutes.post('/create-checkout-session', studentAuthMiddleware(studentAuthService), cartController.payment)

export default studentRoutes;